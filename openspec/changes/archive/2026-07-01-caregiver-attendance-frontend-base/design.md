# Design: Caregiver Attendance Frontend Base

## Technical Approach

Create a Part 1 Angular shell that mirrors `community-halls`: one feature folder, thin `HttpClient` service, signal state shells, standalone lazy pages, and route/menu seams. The shell only exposes typed contracts and placeholders for the backend `/api/v1/caregiver-attendance` capability; CRUD, attendance workflows, reports, and client-side scope policy remain out of scope.

## Architecture Decisions

| Option | Tradeoff | Decision |
|---|---|---|
| Single `caregiver-attendance` feature | One service becomes broad, but matches the single backend controller and existing feature convention. | Use one feature module with grouped interface files for locality. |
| Split admin/user state | Slight duplication, but follows `AdminCommunityHallState` vs `CommunityHallState`. | Create `AdminCaregiverAttendanceState` and `CaregiverAttendanceState`. |
| Generic role helper only | Does not redesign auth, but adds a stable seam for `AT`. | Add `hasRole(role)` and `isTechnicalCompanion()`; keep backend as authority. |
| Native `Date` in DTOs | Convenient in UI, wrong over JSON and creates hidden conversion rules. | Type HTTP date/timestamp fields as `string`; format later at UI seams. |
| Public route in authenticated layouts | Reuses chrome, but would accidentally guard self-service. | Add top-level public route outside admin/user layouts. |

## Data Flow

Authenticated:
`Admin/User layout menu -> lazy route -> placeholder page -> state.loadCaregivers() -> CaregiverAttendanceService -> /api/v1/caregiver-attendance -> backend scope rules`

Public:
`/caregiver-attendance/self-service -> self-service placeholder -> future selfServiceMark() -> public backend endpoint`

## File Changes

| File | Action | Description |
|---|---|---|
| `src/app/features/caregiver-attendance/interfaces/caregiver-mother.interface.ts` | Create | Caregiver request/response DTOs and assignment primitives. |
| `src/app/features/caregiver-attendance/interfaces/caregiver-schedule.interface.ts` | Create | Schedule version, block, day rule, special day, create/copy DTOs. |
| `src/app/features/caregiver-attendance/interfaces/caregiver-attendance-mark.interface.ts` | Create | Self-service, assisted, correction, and mark response DTOs. |
| `src/app/features/caregiver-attendance/interfaces/caregiver-attendance-exception.interface.ts` | Create | Exception request/response DTOs. |
| `src/app/features/caregiver-attendance/interfaces/caregiver-attendance-report.interface.ts` | Create | Monthly hall/committee report query and response DTOs. |
| `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` | Create | Thin methods for all backend endpoints using base URL. |
| `src/app/features/caregiver-attendance/states/admin-caregiver-attendance.state.ts` | Create | Admin signal shell: `data`, `isLoading`, `error`, `loadCaregivers()`, `clear()`. |
| `src/app/features/caregiver-attendance/states/caregiver-attendance.state.ts` | Create | User/AT signal shell with the same public interface; backend scopes results. |
| `src/app/features/caregiver-attendance/pages/caregiver-attendance/caregiver-attendance.component.{ts,html}` | Create | Authenticated wrapper placeholder branches admin vs user/AT. |
| `src/app/features/caregiver-attendance/pages/components/admin-caregiver-attendance/admin-caregiver-attendance.component.{ts,html}` | Create | Admin placeholder only. |
| `src/app/features/caregiver-attendance/pages/components/user-caregiver-attendance/user-caregiver-attendance.component.{ts,html}` | Create | User/AT placeholder only. |
| `src/app/features/caregiver-attendance/pages/self-service-caregiver-attendance/self-service-caregiver-attendance.component.{ts,html}` | Create | Public self-service placeholder only. |
| `src/app/routes/admin.routes.ts` | Modify | Add `path: 'caregiver-attendance'` lazy route. |
| `src/app/routes/user.routes.ts` | Modify | Add `path: 'caregiver-attendance'` lazy route with `committeeGuard`, matching committee-scoped user routes. |
| `src/app/routes/layout.routes.ts` | Modify | Add public `caregiver-attendance/self-service` route before wildcard; no guards/layout. |
| `src/app/layouts/admin-layout/pages/admin-layout/admin-layout.component.ts` | Modify | Add Spanish sidebar item `Asistencia MC` to admin menu. |
| `src/app/layouts/user-layout/pages/user-layout/user-layout.component.ts` | Modify | Add Spanish sidebar item `Asistencia MC` to user/AT menu. |
| `src/app/core/services/auth.service.ts` | Modify | Add role helper seam and reuse it from `isAdmin()`. |

## Interfaces / Contracts

Service base URL: `${environment.apiUrl}/api/v1/caregiver-attendance`.

Methods: `listCaregivers`, `createCaregiver`, `getCaregiver`, `updateCaregiver`, `transferCaregiver`, `getCaregiverAssignments`, `createSchedule`, `getSchedule`, `listSchedulesByHall`, `copySchedule`, `selfServiceMark`, `assistedMark`, `correctMark`, `createException`, `listHallExceptions`, `getHallMonthlyReport`, `getCommitteeMonthlyReport`.

DTO invariant: all `startDate`, `endDate`, `validFrom`, `validTo`, `localDate`, `createdAt`, `updatedAt`, and timestamp-like HTTP fields are `string | null` as appropriate. `CorrectMarkDto` is `{ entryTime: string; reason: string }`.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | `AuthService.hasRole('AT')`, `isTechnicalCompanion()`, `isAdmin()` | Construct JWT payloads in localStorage; assert public methods. |
| Unit | Service endpoints and date-string compile contracts | `provideHttpClientTesting`; assert URLs, methods, params, and request bodies. |
| Unit | State shells | Mock service observable success/error; assert `data`, `isLoading`, `error`, `clear()`. |
| Routing | Admin/user/public seams | `provideRouter`; assert configured route paths and no guards on public self-service. |
| Component | Placeholder rendering | Shallow render standalone pages and assert placeholder copy only. |

## Migration / Rollout

No migration required. Rollback is deleting the new feature folder, tests, route/menu entries, and auth helper.

## Open Questions

- [ ] None blocking for Part 1.
