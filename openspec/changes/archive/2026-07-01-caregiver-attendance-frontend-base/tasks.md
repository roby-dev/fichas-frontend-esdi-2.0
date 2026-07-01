# Tasks: Caregiver Attendance Frontend Base

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 650-850 |
| 800-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR; use work-unit commits and monitor diff size |
| Delivery strategy | single-pr-default |
| Chain strategy | size-exception not required unless diff exceeds 800 |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
800-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Auth helper, DTO contracts, thin service/state seams | PR 1 | Keep tests with each seam; service methods must stay one-liners. |
| 2 | Placeholder pages, route seams, menu entries | PR 1 | Insert public route before `path: '**'`; menu after `Locales`. |

## Phase 1: Contract and Auth Seams

- [x] 1.1 RED: add `src/app/core/services/auth.service.spec.ts` for `hasRole('AT')`, `isTechnicalCompanion()`, and `isAdmin()` using existing JWT roles payload.
- [x] 1.2 GREEN: update `src/app/core/services/auth.service.ts` with generic `hasRole(role)`, `isTechnicalCompanion()`, and `isAdmin()` delegating to `hasRole('admin')`.
- [x] 1.3 RED: add compile-time DTO spec near `src/app/features/caregiver-attendance/interfaces/` proving date/timestamp fields are `string | null`, never `Date`.
- [x] 1.4 GREEN: create grouped interface files: caregiver mother, schedule, mark, exception, and report DTOs under `src/app/features/caregiver-attendance/interfaces/`.

## Phase 2: Service and State Shells

- [x] 2.1 RED: add `caregiver-attendance.service.spec.ts` covering the 17 backend endpoint URLs, HTTP verbs, params, bodies, and no date conversion.
- [x] 2.2 GREEN: create `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` with 17 minimal one-line `HttpClient` methods using `${environment.apiUrl}/api/v1/caregiver-attendance`.
- [x] 2.3 RED: add specs for `admin-caregiver-attendance.state.ts` and `caregiver-attendance.state.ts` covering load success, load error with Spanish error text, loading signals, and `clear()`.
- [x] 2.4 GREEN: create both state files with `data`, `isLoading`, `error`, `loadCaregivers()`, and `clear()` only; no workflow orchestration or client-side scope authority.

## Phase 3: Pages, Routes, and Menus

- [x] 3.1 RED: add shallow component specs for authenticated and self-service placeholder pages, asserting placeholder copy only and no workflow UI.
- [x] 3.2 GREEN: create authenticated wrapper plus admin/user placeholder components under `src/app/features/caregiver-attendance/pages/`.
- [x] 3.3 GREEN: create `self-service-caregiver-attendance.component.{ts,html}` as public placeholder only.
- [x] 3.4 RED: add routing specs for `admin.routes.ts`, `user.routes.ts`, and `layout.routes.ts`, including public self-service with no guards/layout chrome.
- [x] 3.5 GREEN: update `src/app/routes/admin.routes.ts` and `src/app/routes/user.routes.ts` with lazy `caregiver-attendance`; keep `committeeGuard` on user route.
- [x] 3.6 GREEN: update `src/app/routes/layout.routes.ts` with `caregiver-attendance/self-service` before `path: '**'`, outside authenticated layouts/guards.
- [x] 3.7 GREEN: update admin and user layout menu arrays with `Asistencia MC` immediately after `Locales`, route `caregiver-attendance`.

## Phase 4: Verification

- [x] 4.1 Run `pnpm test -- --watch=false --browsers=ChromeHeadless` and fix only shell-related failures.
- [x] 4.2 Run `pnpm build` and confirm strict TypeScript compiles without adding full workflow UI.
