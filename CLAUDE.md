# Fichas ESDI Frontend 2.0 — AI Context

## Domain

**ESDI** (Escala de Desarrollo Infantil) — sistema del programa CUNAMAS / MIDIS (Perú) para seguimiento del desarrollo infantil.

### Core entities
- **Child (Niño/a)**: Entidad principal. Permanece en el programa hasta ~36 meses. Tiene una única Ficha (registro de desarrollo).
- **Committee (Comité de gestión)**: Catálogo de comités. Relación con usuarios vía `CommitteeMembership`.
- **CommitteeMembership**: Junction table — asigna usuarios a comités. Backend ya migró desde el viejo `ManagementCommittee`.
- **CommunityHall (Local Comunal)**: Donde asisten los niños. Cuelga directamente de `Committee` (no de la membresía).
- **AlertChild / AlertSignals**: Carga masiva de niños con señales de alerta basadas en edad.
- **Person**: Registro de persona (nombre, email, teléfono, fecha de nacimiento).
- **User**: Usuario autenticado (email, roles: `admin` | `user`).

### Relationship chain
```
User → CommitteeMembership → Committee → CommunityHall → Child
```

## Tech Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 21.2 (standalone components, sin NgModules) |
| Change Detection | **Zoneless** (`provideZonelessChangeDetection()`) |
| CSS | Tailwind CSS v4 + PostCSS |
| Font | Montserrat (variable font, cargada como `@font-face`) |
| Package Manager | pnpm |
| HTTP | `provideHttpClient(withFetch(), withInterceptors(...))` |
| Real-time | `ngx-socket-io` (WebSocket) |
| PWA | `@angular/service-worker` |
| Testing | Karma + Jasmine (configurado, tests pendientes de escribir) |

## Architecture

```
src/app/
├── core/                    # Cross-cutting concerns
│   ├── constants/           # localStorage keys, app constants
│   ├── guards/              # auth, admin, committee, redirect (funcionales)
│   ├── interceptors/        # auth-token, refresh-token, error (funcionales)
│   └── services/            # AuthService, SocketService (singletons)
├── features/                # Domain-driven feature modules
│   ├── admin/               # Auditoría, sesiones, users dashboard
│   ├── alert-signals/       # Carga masiva + señales de alerta
│   ├── auth/                # Login, change-password
│   ├── children/            # CRUD de niños
│   ├── committees/          # Comités (user + admin views)
│   ├── community-halls/     # Locales comunales
│   ├── dashboard/           # Resumen (admin y user)
│   ├── persons/             # Registro de personas
│   ├── shared/              # UI components (button, input, modal, toast, loading, snackbar, checkbox-group)
│   ├── unauthorized/        # Página 403
│   └── users/               # Gestión de usuarios (admin)
├── layouts/                 # UI shells
│   ├── admin-layout/        # Shell admin (sidebar + header + router-outlet)
│   ├── user-layout/         # Shell usuario regular
│   ├── auth-layout/         # Shell login/change-password
│   ├── empty-layout/        # Redirect vacío
│   └── shared/              # Header, Sidebar, interfaces compartidas
└── routes/                   # Route definitions per layout
    ├── layout.routes.ts     # Top-level: auth | admin | user | empty
    ├── admin.routes.ts
    ├── user.routes.ts
    └── auth.routes.ts
```

### Routing pattern
- Layout component + `loadChildren` para rutas hijas
- `canActivateChild: [authGuard, adminGuard]` en layout admin
- `canActivateChild: [authGuard]` en layout user
- `loadComponent` con lazy loading en TODAS las rutas hoja

## State Management Pattern

**Service + Signals** — NO usa NgRx ni librería externa.

### Convention
```typescript
@Injectable({ providedIn: 'root' })
export class FeatureState {
  private readonly service = inject(FeatureService);

  data = signal<T[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadData() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.service.getData().pipe(
      tap({
        next: (res) => { this.data.set(res); this.isLoading.set(false); },
        error: (err) => { this.error.set(err?.message ?? 'Error al cargar...'); this.isLoading.set(false); },
      })
    );
  }

  clear() {
    this.data.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
```

### State files (7 states)
| Estado | Feature | Rol |
|---|---|---|
| `ChildrenState` | children | User — niños del comité seleccionado |
| `AdminChildrenState` | children | Admin — niños agrupados por usuario |
| `CommitteeState` | committees | Ambos — comité actual + localStorage |
| `AdminCommitteeState` | committees | Admin — catálogo de comités + membresías |
| `CommunityHallState` | community-halls | User — locales del comité seleccionado |
| `AdminCommunityHallState` | community-halls | Admin — todos los locales |
| `UserState` | users | Ambos — lista de usuarios + usuario actual |

### State dependencies
- `ChildrenState` → inyecta `CommitteeState` (lee `committee().id` para filtrar)
- `CommunityHallState` → inyecta `CommitteeState` (lee `committee().id` para filtrar)
- Ambos tienen null-safety: si no hay comité seleccionado, no llaman al HTTP

### Cross-session persistence
`CommitteeState` persiste el comité seleccionado en `localStorage`:
- `COMMITTEE_ID_KEY`, `COMMITTEE_NAME_KEY`, `COMMITTEE_CODE_KEY`
- Consumido por `committee.guard.ts`, layouts, header, alert-signals

## Code Conventions

- **Path alias**: `@/` → `src/app/*` (definido en `tsconfig.json`)
- **TypeScript**: `strict: true`, `noImplicitOverride`, `strictTemplates`
- **Quotes**: single quotes (`.editorconfig`)
- **Indent**: 2 spaces
- **Change Detection**: `OnPush` en todos los componentes
- **Components**: `standalone: true`, `default export`
- **Guards/Interceptors**: funcionales (`CanActivateFn`, `HttpInterceptorFn`)
- **Formularios**: Angular Signals Forms (`form()`, `required()`, `email()`, `minLength()`)
- **HTTP calls**: siempre desde servicios dedicados (`providedIn: 'root'`), nunca en componentes
- **Mensajes de error**: en español
- **Commits**: conventional commits (`feat:`, `fix:`, `refactor:`)

## Loading Pattern (Layouts)

Los layouts (`user-layout`, `admin-layout`) manejan la carga inicial con:
1. `loadInitialData()` → `forkJoin` de estados según rol
2. `loadCommitteeDetailsFromStorage()` → carga el comité desde localStorage, luego hijos y locales
3. `finalize(() => this.isLoading.set(false))` para el loader global
4. `setUser()` desde el token JWT decodificado

## Auth Flow

1. Login → `AuthorizationService.login()` → tokens en `localStorage`
2. `AuthTokenInterceptor` agrega `Authorization: Bearer` a todas las requests (excepto `/auth/login`)
3. `RefreshTokenInterceptor` renueva automáticamente si recibe 401
4. `AuthService.getDecodedToken()` decodifica el JWT (sin verificar firma — el backend valida)
5. Roles en el payload: `{ email, roles: string[], exp, mustChangePassword? }`
6. `AuthGuard` verifica `isLoggedIn()` y `!isTokenExpired()`

## WebSocket

- `WebsocketService` se conecta con el access token después del login
- Los layouts llaman `connectWebSocket()` en `ngOnInit` y `disconnect()` en `ngOnDestroy`
- Escucha eventos `reconnect_attempt` y `reconnect_failed`

## Backend API

- NestJS + MongoDB (proyecto hermano: `fichas-esdi-backend`)
- Swagger spec en `swagger-spec.json`
- Base URL configurada en `src/environments/environment.ts`
- Endpoints principales bajo `/api/v1/`
- Migración completada: `ManagementCommittee` → `Committee` + `CommitteeMembership`
