## Exploration: Caregiver Mother Management UI (Part 2)

### Current State

Caregiver attendance backend is fully implemented and archived (`POST/GET /caregiver-attendance/caregivers`, `PATCH /caregivers/:id`, `GET /caregivers/:id/assignments`, `POST /caregivers/:id/transfers`, schedules, marks, exceptions, reports). Roles `admin` and `AT` are authorized for caregiver management; `selfServiceMark` is `@Public()`. DTO shape:

- `CreateCaregiverMotherDto`: `documentType?`, `documentNumber`, `firstName`, `lastName`, `phone?`, `startDate` (ISO date string), `endDate?`, `status?: 'active'|'retired'`.
- `UpdateCaregiverMotherDto`: all fields optional with the same types.
- `CaregiverMotherResponseDto`: `id, documentType, documentNumber, firstName, lastName, fullName, phone|null, startDate(Date), endDate|Date|null, status`.
- `CaregiverHallAssignmentPrimitives`: `caregiverId, communityHallId, validFrom, validTo?|null` (id optional). Returned by `GET /caregivers/:id/assignments`.

Part 1 (`caregiver-attendance-frontend-base`, archived) shipped an Angular shell that mirrors `community-halls` structurally: one feature folder, one thin `CaregiverAttendanceService` (17 endpoints), `AdminCaregiverAttendanceState` and `CaregiverAttendanceState` signal shells (identical `loadCaregivers`), an authenticated role-branching page, admin/user placeholder components, a public self-service route, menu items, and an `AuthService` role seam (`hasRole`, `isTechnicalCompanion`, `isAdmin`). All Part 1 placeholders render a hero "section" card and a "próxima iteración" message.

**What Part 1 did NOT do** is render real management UI — and the placeholder styling it used deviates from the actual frontend module conventions. That is the focus of this exploration.

### Real Frontend Module UI Conventions (verified against source)

Folder structure (consistent across `committees`, `community-halls`, `children`):

```
features/{domain}/
├── interfaces/            # DTO + entity interfaces
├── services/              # providedIn:'root' HttpClient service(s)
├── states/                # {Feature}State (user) + Admin{Feature}State (admin)
├── pages/
│   ├── {domain}/{domain}.component.{ts,html}   # default export, role branches
│   └── components/
│       ├── admin-{domain}/   # admin CRUD view (table + modal)
│       ├── user-{domain}/    # user-side view
│       └── {domain}-form/    # standalone form (signals form, input/button)
```

UI/layout conventions (the "design" the user is correcting toward):

| Concern | Actual convention |
|---|---|
| Page wrapper | `<div class="p-0 sm:p-4">` + `@if(!authService.isAdmin()){<app-user-x/>}@else{<app-admin-x/>}`. **No** hero `rounded-2xl border border-slate-200` section. |
| Heading | `<h2 class="text-lg font-semibold mb-4">{Título}</h2>` (e.g. "Comités", "Administración de locales comunales"). No `uppercase tracking-wide` eyebrow, no `text-2xl font-bold`. |
| Admin toolbar | `flex items-center justify-between mb-4` row: `<h2>` + `<app-button label="Crear" />` (or "Agregar"). |
| List layout | Table: `overflow-x-auto bg-white shadow-sm rounded` (committees) / `border rounded-lg` (halls), `min-w-full divide-y divide-gray-200`, `thead.bg-gray-50`, `th text-* text-sm font-medium text-gray-600`, rows `hover:bg-gray-50 transition-colors`. |
| Empty state | `@for(...) { ... } @empty { <tr><td colspan=N class="px-4 py-8 text-sm text-center text-gray-500">No hay X registrados.</td></tr> }` (Spanish copy). |
| Search | Children module uses an inline `<input type="text" placeholder="Buscar por nombre o documento..." class="... rounded-lg border border-gray-300 ...focus:border-blue-500">` + a `computed` filter over state. |
| Create/Edit modal | `<app-modal [title]="selected() ? 'Editar X' : 'Crear X'" size="lg" (closed)="closeModal()"><app-x-form [x]="selected()" (saveXEvent)="onSaved($event)" [isLoading]="isLoading()"/></app-modal>`. Modal wraps form via `ng-content`. |
| Form | Signals Forms: `form(model, (schemaPath) => required(schemaPath.field!, {message:'X requerido'}))`, `<app-input [control]=...>`, submit `<app-button [label]="isLoading() ? 'Guardando...' : 'Guardar'" [disabled]="isLoading()||form().invalid()" type="submit">`. `console.log` left in committee-form — minor existing noise. |
| Save flow | Component owns `isLoading` signal + `selected` signal; `onSaved` builds create vs update via `this.selected() ? service.update(...) : service.create(...)`, `switchMap(() => adminState.loadXx())`, set isLoading false on next, close modal on next, `console.error` on error. **No ToastService usage in admin catalog modules currently** (toast exists but unused here). |
| Buttons | `<app-button label outline disabled isLoading type>`; default filled blue. Inline "Agregar niño" button in children uses raw tailwind button (inconsistency in children only). |
| Loading/error states | Layouts own a global `<app-loading>` overlay via `isLoading` signal; admin catalog tables have no per-view loader today (they rely on layout preloaded state). |
| Spanish copy | All labels/empty/filter messages in Spanish (the app's UI language). Form/save vocabulary: "Crear"/"Editar"/"Guardar"/"Guardando..."/"No hay X registrados." |
| State-service shape | `@Injectable({providedIn:'root'})`, fields `data|groupedByUser`/`isLoading`/`error` signals, `loadX()` returning the service observable piped with `tap({next,error})` setting signals, plus `clear()`. Error message in Spanish. |

### Affected Areas

- `src/app/features/caregiver-attendance/pages/components/admin-caregiver-attendance/admin-caregiver-attendance.component.{ts,html}` — replace placeholder hero with real admin management UI (toolbar + search + table + create/edit modal). This is the core Part 2 surface.
- `src/app/features/caregiver-attendance/pages/components/user-caregiver-attendance/user-caregiver-attendance.component.{ts,html}` — user/AT management view. Keep minimal: same list/search (backend scopes by role), create/edit for `AT`/admin; defer attendance marking. Likely reuse admin component or a slimmed variant — see Recommendation.
- `src/app/features/caregiver-attendance/pages/caregiver-attendance/caregiver-attendance.component.html` — already role-branches; keep as-is (matches committee/hall pages).
- New `pages/components/caregiver-mother-form/caregiver-mother-form.component.{ts,html}` — standalone signals form covering documentType, documentNumber, firstName, lastName, phone, startDate, endDate, status. Mirrors `community-hall-form` + `committee-form`.
- `src/app/features/caregiver-attendance/states/admin-caregiver-attendance.state.ts` — keep; add filtered/selected signals if convenient, or do filtering in component (matches children). Existing `loadCaregivers()` is reusable.
- `src/app/features/caregiver-attendance/states/caregiver-attendance.state.ts` — user/AT state. Keep; user-side list also uses `listCaregivers` (backend scopes results).
- `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` — `listCaregivers`, `createCaregiver`, `updateCaregiver`, `getCaregiver`, `getCaregiverAssignments` already exist and match backend contracts. No service changes required for Part 2.
- `src/app/layouts/admin-layout/.../admin-layout.component.ts` — caregiver list is NOT preloaded in `loadInitialData` forkJoin (only committees/halls/children/users are). Manage listing must be triggered in-page (`ngOnInit`) — see Recommendation.
- New optional assignment view: a read-only "current/historical hall assignment" panel/modal using `getCaregiverAssignments(id)`. Keep minimal/read-only in Part 2 unless needed for the management screen — can defer a full assignment viewer.

### Part 1 Deviations From Module UI Convention (corrective call-outs)

1. **Hero placeholder styling.** Part 1 placeholders use `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`, an uppercase `tracking-wide` eyebrow ("Madres cuidadoras"), and a `text-2xl font-bold` H1. No real module uses this. Convention is plain `text-lg font-semibold` headings inside `p-0 sm:p-4`, no hero card, `rounded`/`rounded-lg` (not `2xl`) surfaces, gray utility palette (`text-gray-600/800`, `bg-gray-50`) not slate. → Replace when building the real UI.
2. **Tailwind color scale.** Part 1 used `slate-*`; every real module uses `gray-*` + `blue-500` accents. → Standardize on gray/blue.
3. **"próxima iteración" placeholder copy.** Only acceptable because placeholders were temporary; the real Part 2 UI must use Spanish management copy ("Madres cuidadoras", "Crear", "Editar madre cuidadora", "No hay madres cuidadoras registradas.").
4. **Admin/user state duplication.** Part 1 created two near-identical states (`AdminCaregiverAttendanceState`, `CaregiverAttendanceState`) — matches the `AdminCommunityHallState`/`CommunityHallState` split, so the convention is honored. But since the caregiver management screen is identical for admin and AT (backend scopes results), the user/AT view can reuse the admin component rather than maintain a parallel UI. Keep both states as seams; one shared component can consume the one matching the role (or both can be wired behind the same form).

### Approaches

1. **Admin-catalog-table pattern (committees/community-halls clone)** — toolbar + search + table + `app-modal` + new `caregiver-mother-form`.
   - Pros: Directly matches the two closest catalog modules (admin CRUD of a typed list). Table suits 7 flat columns; empty/`@empty` rows native. Form mirrors `community-hall-form` (signals form + `app-input` + `app-button`). Plugs into existing `AdminCaregiverAttendanceState.loadCaregivers()` + `create/update` service. AT/admin both reuse the same component since backend authorizes both roles.
   - Cons: Phone/status/endDate styling per row needs a small status badge cell. Assignments view is not part of this pattern (defer or add a read-only modal row action).
   - Effort: Low–Medium.

2. **Children-card pattern** — search + card grid + custom inline modal + `child-form`-style form.
   - Pros: Card UI friendlier for person entities; matches `children` (also first/lastName/documentNumber). Built-in search `computed`.
   - Cons: Children module uses a hand-rolled inline modal (not `app-modal`) and a raw tailwind "Agregar" button — inconsistent with committees/halls. More markup to maintain. Person-style cards for a 7-field catalog with status are heavier than a table.
   - Effort: Medium.

3. **Hybrid: table + row click opens a detail/assignment side-read** — table (approach 1) plus a "Ver asignaciones" row action that opens a read-only modal listing `getCaregiverAssignments(id)` history.
   - Pros: Delivers the "view basic current/historical hall assignment information if needed" scope seam without building the transfer workflow.
   - Cons: Slightly more surface; depends on whether assignments are required on the management screen vs. only when transfer is added later.
   - Effort: Medium.

### Recommendation

Use **Approach 1 (admin-catalog-table)**, with **Approach 3's assignment view included only if the management screen must show current hall**. Concretely for Part 2:

- `admin-caregiver-attendance.component.ts`: inject `AdminCaregiverAttendanceState` (and for user-path `CaregiverAttendanceState` — or wire a single component that picks the state by role). Inline a search `input` + `searchTerm` signal + `computed(filteredCaregivers)` like `children`. Trigger `loadCaregivers()` in `ngOnInit` (NOT a layout preload — caregiver is a dedicated route, preloading it adds cost to admin landing it does not need). Render the committees/community-halls-style table with `@for`/`@empty` ("No hay madres cuidadoras registradas."). Columns: Documento, Nombre completo, Teléfono, Inicio, Estado (badge: active green / retired gray), and a row click → open edit modal. Toolbar "Crear" → open create modal.
- New `caregiver-mother-form.component` (signals form, `app-input`, `app-button`, optional select for `documentType` and `status` using existing shared primitives or a small native `<select>` styled to match). Inputs map directly to `CreateCaregiverMotherRequest`/`UpdateCaregiverMotherRequest`. `startDate`/`endDate` as `type="date"` (string-typed DTO, no `Date` plumbing — per Part 1 design invariant).
- Save flow: `selected ? service.updateCaregiver(id) : service.createCaregiver`, `switchMap(() => adminState.loadCaregivers())`, `isLoading` signal, close modal on success, `ToastService.error(...)` on failure (improvement over current `console.error`-only in committees/halls — lightweight, optional, keep parity if minimizing churn).
- User/AT view: reuse the same component (or a thin wrapper) reading `CaregiverAttendanceState`; backend's `findAll` already scopes by roles. Defer attendance marking and transfer workflow.
- Assignment view: DO NOT build a full assignment editor. If the management screen must show current hall, add a read-only row detail/modal calling `getCaregiverAssignments(id)` (Approach 3 seam). Otherwise defer entirely and leave `getCaregiverAssignments` wired only in the service (already present).
- Status handling: supported by DTO (`status`, `endDate`); expose in the form as optional controls; do NOT build a separate "activate/retire" endpoint action — there is no dedicated backend endpoint, status is set via `PATCH /caregivers/:id` which the form already covers.

Failure/error/empty: follow modules — Spanish empty row copy, gray/blue palette, `app-loading` only where a per-view loader is warranted (optional, since on-route load is fast and layout already has a global loader).

### Risks

- **Loading timing divergence.** Catalog modules rely on layout-preloaded state; caregiver is not preloaded, so the component must self-load. If a later part preloads caregivers in `loadInitialData` forkJoin, the self-load should become a guarded reload to avoid double fetch. Document this in design.
- **Date typing.** Backend returns `Date`/`Date|null` JSON-serialized as ISO strings for `startDate`/`endDate`; Part 1 typed them as `string`. Keep `string` in DTOs and bind `<input type="date">` to `yyyy-MM-dd` strings directly — do NOT introduce `new Date(...)` parsing in components (creates the hidden conversion rules Part 1 explicitly avoided).
- **AT vs admin parity.** Both roles can manage caregivers per backend. If the user/AT surface must differ (e.g. AT cannot create), the UI split needs a guard — but backend currently allows both, so a single shared component is correct unless requirements change.
- **Assignment view scope creep.** "View basic current/historical hall assignment" can pull Part 3 (transfer workflow) in prematurely. Keep it strictly read-only or defer.
- **Part 1 spec/tests.** Part 1 added `caregiver-attendance.routes.spec.ts`, `caregiver-attendance-placesholders.spec.ts`, service/state/DTO-contracts specs. Part 2 must replace (not just extend) the placeholder rendering tests with real behavior tests, and must not break the routing/services/DTO-contract specs.

### Ready for Proposal

Yes. The orchestrator should tell the user: Part 1 shell (routes, service, states, interfaces, role seam, public self-service route) is reusable as-is; only the placeholder UI components will be replaced. The "design not matching other modules" concern is confirmed — Part 1's `slate`/`rounded-2xl`/hero-card placeholder styling deviates from the verified `gray`/`rounded`/`text-lg font-semibold` table+modal catalog pattern used by `committees` and `community-halls`. Proposal should scope Part 2 to: real admin/AT management table + search + create/edit form modal, self-load on init, optional read-only assignment view, Spanish copy, and replacement of placeholder component tests.