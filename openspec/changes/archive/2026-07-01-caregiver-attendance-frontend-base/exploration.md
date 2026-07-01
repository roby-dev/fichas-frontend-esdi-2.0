# Exploration: Caregiver Attendance Frontend Base (Part 1)

## Current State

The frontend is an Angular 21.2 standalone, zoneless SPA following a `core/ + features/ + layouts/ + routes/` architecture. Each domain feature (e.g. `community-halls`, `children`, `committees`) is a self-contained folder under `src/app/features/` with four sub-folders: `interfaces/` (TS DTOs), `services/` (thin HTTP services), `states/` (signal-based injectable state shells), and `pages/` (standalone OnPush components, default export).

State uses injectable services with signals (no NgRx). User state splits into admin vs user variants when scoping differs (e.g. `AdminCommunityHallState` vs `CommunityHallState`). `CommitteeState` is the shared pivot persisted to localStorage; other states inject it to filter by the selected committee.

Routing is split by role: `routes/admin.routes.ts` (guarded by `authGuard + adminGuard`) and `routes/user.routes.ts` (guarded by `authGuard`, with `committeeGuard` on committee-scoped routes). Layout shells (`admin-layout`, `user-layout`) own a `menuItems` signal array feeding the shared `SidebarComponent` via `input.required<MenuItem[]>` — this is the menu integration seam.

The backend `caregiver-attendance` feature is fully implemented and archived in `fichas-esdi-backend`. Its controller (`CaregiverAttendanceController`) exposes all endpoints under `/caregiver-attendance` (i.e. `${apiUrl}/api/v1/caregiver-attendance`). Caregiver mothers are business actors, NOT system users. The backend role vocabulary includes a new `AT` (Technical Companion / Acompañante Técnico) role alongside `admin`; the frontend's `AuthService.isAdmin()` only checks for `roles.includes('admin')`.

## Affected Areas

- `src/app/features/caregiver-attendance/` — new feature module to create (interfaces, services, states, pages).
- `src/app/routes/admin.routes.ts` — add lazy admin route(s) for caregiver attendance.
- `src/app/routes/user.routes.ts` — add lazy user/AT route(s) for caregiver attendance.
- `src/app/layouts/admin-layout/pages/admin-layout/admin-layout.component.ts` — add `MenuItem` entries for caregiver attendance admin views.
- `src/app/layouts/user-layout/pages/user-layout/user-layout.component.ts` — add `MenuItem` entries for caregiver attendance user/AT views.
- `src/app/core/services/auth.service.ts` — may need a role helper beyond `isAdmin()` (e.g. `isTechnicalCompanion()` or generic `hasRole('AT')`) since the backend introduces the `AT` role.
- `src/app/core/guards/` — a scope guard may be needed for AT-restricted routes (future slice; seam only in Part 1).
- `openspec/config.yaml` — no changes needed for Part 1; conventions already documented.

## Backend API Contract (Part 1 seams)

Base path: `${environment.apiUrl}/api/v1/caregiver-attendance`

| Endpoint | Method | Roles | Request DTO | Response |
|---|---|---|---|---|
| `/caregivers` | GET | admin, AT | `?limit&offset` | `CaregiverMotherResponseDto[]` |
| `/caregivers` | POST | admin, AT | `CreateCaregiverMotherDto` | `CaregiverMotherResponseDto` |
| `/caregivers/:id` | GET | admin, AT | — | `CaregiverMotherResponseDto` |
| `/caregivers/:id` | PATCH | admin, AT | `UpdateCaregiverMotherDto` | `CaregiverMotherResponseDto` |
| `/caregivers/:id/transfers` | POST | admin, AT | `TransferCaregiverMotherDto` | 204 |
| `/caregivers/:id/assignments` | GET | admin, AT | — | `CaregiverHallAssignmentPrimitives[]` |
| `/schedules` | POST | admin, AT | `CreateScheduleVersionDto` | `ScheduleVersionResponseDto` |
| `/schedules/:id` | GET | admin, AT | — | `ScheduleVersionResponseDto` |
| `/schedules/hall/:hallId` | GET | admin, AT | — | `ScheduleVersionResponseDto[]` |
| `/schedules/:id/copy` | POST | admin, AT | `CopyScheduleVersionDto` | `ScheduleVersionResponseDto` |
| `/marks/self-service` | POST | **PUBLIC** | `SelfServiceMarkDto` | `MarkResponseDto` |
| `/marks/assisted` | POST | admin, AT | `AssistedMarkDto` | `MarkResponseDto` |
| `/marks/:id/correction` | PATCH | admin, AT | `CorrectMarkDto` | `MarkResponseDto` |
| `/exceptions` | POST | admin, AT | `CreateExceptionDto` | `ExceptionResponseDto` |
| `/exceptions/hall/:hallId?localDate` | GET | admin, AT | `?localDate` | `ExceptionResponseDto[]` |
| `/reports/halls/:hallId/monthly` | GET | admin, AT | `?year&month&includeExpectedWithoutMarks` | `MonthlyHallReportResponseDto` |
| `/reports/committees/:committeeId/monthly` | GET | admin, AT | `?year&month&includeExpectedWithoutMarks` | `MonthlyCommitteeReportResponseDto` |

### Key DTO field shapes

- **CaregiverMotherResponseDto**: `id, documentType, documentNumber, firstName, lastName, fullName, phone|null, startDate(Date), endDate|null, status`
- **CreateCaregiverMotherDto**: `documentType?, documentNumber, firstName, lastName, phone?, startDate(string), endDate?, status?('active'|'retired')`
- **TransferCaregiverMotherDto**: `communityHallId, validFrom(string)`
- **CaregiverHallAssignmentPrimitives**: `id?, caregiverId, communityHallId, validFrom(Date), validTo?|null`
- **ScheduleVersionResponseDto**: `id, communityHallId, name, validFrom(Date), validTo|null, blocks[], dayRules[], specialDays[]`
  - **ScheduleBlock**: `id, name, entryTime, exitTime|null, exitRequired, toleranceMinutes, markingWindowMinutes`
  - **DayRule**: `dayOfWeek(0-6), isWorkingDay, blockIds[]`
  - **SpecialDay**: `localDate, isWorkingDay, blockIds[]`
- **SelfServiceMarkDto**: `documentType?, documentNumber, localDate?, entryTime?`
- **AssistedMarkDto**: `caregiverId, localDate, blockId, entryTime?, reason`
- **CorrectMarkDto**: correction fields (verify exact shape in design)
- **MarkResponseDto**: `id, caregiverId, communityHallId, localDate, blockId, markKind, entryTime|null, source, reason|null, isVoided`
- **CreateExceptionDto**: `scope('hall'|'caregiver'), communityHallId?, caregiverId?, localDate, blockId?, kind('holiday'|'day_off'|'permission'|'justification'), status?('accepted'|'pending'), reason`
- **ExceptionResponseDto**: `id, scope, communityHallId|null, caregiverId|null, localDate, blockId|null, kind, status, reason`
- **MonthlyReportQuery**: `year(number), month(number), includeExpectedWithoutMarks?`

## Approaches

1. **Single feature module with admin/user state split (mirrors `community-halls`)**
   - Create `features/caregiver-attendance/` with `interfaces/`, `services/`, `states/`, `pages/`.
   - Define all backend-contract interfaces in `interfaces/` (CaregiverMother, ScheduleVersion, AttendanceMark, AttendanceException, report responses, request shapes).
   - One HTTP service `CaregiverAttendanceService` covering caregivers + schedules + marks + exceptions + reports (matching the single backend controller).
   - Split state into `CaregiverAttendanceState` (user/AT-scoped, committee-filtered) and `AdminCaregiverAttendanceState` (admin, all data) following the `CommunityHallState`/`AdminCommunityHallState` precedent.
   - Entries in both `admin.routes.ts` and `user.routes.ts` + menu items in both layouts.
   - Pros: Consistent with existing pattern; familiar to maintainers; single service matches single controller.
   - Cons: Service covers a large surface; may grow unwieldy over time.
   - Effort: Low (Part 1 is shells/stubs only).

2. **Sub-feature folders per domain concern (caregivers, schedules, marks, exceptions, reports)**
   - Separate `features/caregiver-caregivers/`, `features/caregiver-schedules/`, etc., each with own service/state.
   - Pros: Granular separation; each slice independently testable and deliverable.
   - Cons: Diverges from existing single-folder-per-entity convention; more files/navigation for Part 1; risks over-engineering a shell.
   - Effort: Medium (more scaffolding, more route/routing decisions upfront).

## Recommendation

**Approach 1** — mirror the `community-halls` feature exactly. It matches the project's proven convention (single feature folder, admin/user state pair, thin service, layout menu items via `MenuItem` signal). Part 1 delivers shells/stubs; full UI slices are future work. The single HTTP service maps cleanly to the single backend controller.

For Part 1 specifically, implement:
- `interfaces/` — all contract interfaces (request + response shapes) from the table above.
- `services/caregiver-attendance.service.ts` — thin HttpClient methods for every endpoint in the table (stubs return Observables via `this.http.*`; no business logic).
- `states/caregiver-attendance.state.ts` + `admin-caregiver-attendance.state.ts` — signal shells (empty `signal<T[]>([])`, `isLoading`, `error`, empty `load*()`/`clear()` methods).
- `pages/caregiver-attendance/caregiver-attendance.component.ts` — role-branching shell page (like `community-halls.component`) that renders admin vs user sub-components, but Part 1 only needs the wrapper + empty placeholder sub-components.
- Route entries + menu items in both layouts pointing to the shell page.
- A self-service landing route is a **separate public concern** (no auth guard) — add only the route + shell page seam, not the marking UI.

## Risks

- **AT role is new to the frontend.** `AuthService` only has `isAdmin()` (checks `roles.includes('admin')`). The backend gates caregiver endpoints on `['admin', 'AT']`. Part 1 should add a `hasRole('AT')` helper (or `isTechnicalCompanion()`) and avoid hardcoding role strings in components. The JWT payload uses `roles: string[]` so no decode change is needed, but menu visibility and route guards must account for AT.
- **Self-service endpoint is PUBLIC** (`@Public()` decorator) — it must NOT go through `AuthTokenInterceptor` auth, and its route must not require auth. This is a distinct flow from the authenticated admin/AT admin pages. Part 1 must not accidentally guard the self-service seam.
- **Scope enforcement is backend-side.** The frontend cannot reliably enforce AT hall-scope; any client-side scope filter is convenience only. Part 1 should not implement client-side scope filtering logic.
- **DTO dates serialize as ISO strings.** Backend DTOs declare `Date` fields but over HTTP they arrive as strings. Frontend interfaces should type date fields as `string` (ISO) or `Date`-compatible strings — not native `Date` — to match JSON transport reality.
- **No existing test harness beyond app skeleton.** Strict TDD is configured (`strict_tdd: true`, test_command present) but only `app.component.spec.ts` exists. Part 1 shell code needs at least state/service spec stubs to satisfy TDD discipline, even if placeholders.

## Ready for Proposal

Yes — the orchestrator should tell the user:
- Part 1 scope is confirmed as a structural shell mirroring `community-halls` (interfaces, thin service, signal states, shell pages, routes, menu items).
- The new `AT` role requires a small `AuthService` helper addition (Part 1 seam, full guard in a later slice).
- Self-service is a public, unauthenticated flow treated as a separate seam.
- Full management/assignment/marking/report UIs are explicitly deferred to future slices.