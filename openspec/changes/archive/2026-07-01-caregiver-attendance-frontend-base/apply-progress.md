# Apply Progress: Caregiver Attendance Frontend Base

**Change**: `caregiver-attendance-frontend-base`  
**Mode**: Strict TDD  
**Artifact store**: OpenSpec  
**Delivery**: single PR with maintainer-approved `size:exception` for Part 1  
**Status**: Implementation complete; ready for `sdd-verify` with one pre-existing non-shell test failure documented.

## Completed Tasks

- [x] 1.1 RED: AuthService role-helper spec.
- [x] 1.2 GREEN: `hasRole(role)`, `isTechnicalCompanion()`, and delegated `isAdmin()`.
- [x] 1.3 RED: compile/runtime DTO string-date contract spec.
- [x] 1.4 GREEN: grouped caregiver attendance DTO interfaces.
- [x] 2.1 RED: 17-endpoint thin service spec.
- [x] 2.2 GREEN: `CaregiverAttendanceService` with 17 HTTP methods.
- [x] 2.3 RED: admin/user state shell specs.
- [x] 2.4 GREEN: `AdminCaregiverAttendanceState` and `CaregiverAttendanceState` shells.
- [x] 3.1 RED: placeholder page specs.
- [x] 3.2 GREEN: authenticated wrapper plus admin/user placeholder components.
- [x] 3.3 GREEN: public self-service placeholder component.
- [x] 3.4 RED: admin/user/public route seam specs.
- [x] 3.5 GREEN: authenticated admin/user route seams; user keeps `committeeGuard`.
- [x] 3.6 GREEN: public self-service route before wildcard, outside authenticated layouts.
- [x] 3.7 GREEN: admin/user menu entries with `Asistencia MC` immediately after `Locales`.
- [x] 4.1 Verification command executed; shell specs pass, unrelated `app.component.spec.ts` failure documented.
- [x] 4.2 Build executed and passed.

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1-1.2 | `src/app/core/services/auth.service.spec.ts` | Unit | N/A (no existing spec) | ✅ Missing `hasRole`/`isTechnicalCompanion` failed compile | ✅ 2/2 passed | ✅ AT + admin role cases | ✅ `isAdmin()` delegates to `hasRole('admin')` |
| 1.3-1.4 | `src/app/features/caregiver-attendance/interfaces/caregiver-attendance-dto-contracts.spec.ts` | Unit/compile contract | N/A (new files) | ✅ Missing interface modules failed compile | ✅ 2/2 passed | ✅ caregiver + schedule/mark date fields | ✅ Replaced invalid `instanceof` string checks with `typeof` |
| 2.1-2.2 | `src/app/features/caregiver-attendance/services/caregiver-attendance.service.spec.ts` | Unit HTTP | N/A (new service) | ✅ Missing service module failed compile | ✅ 4/4 passed | ✅ caregiver, schedule, mark/exception, report endpoint groups | ✅ Shared `toParams()` helper only for query serialization |
| 2.3-2.4 | `src/app/features/caregiver-attendance/states/caregiver-attendance.state.spec.ts` | Unit state | N/A (new states) | ✅ Missing state modules failed compile | ✅ 4/4 passed | ✅ success, error, fallback error, clear | ✅ Kept shells minimal: data/loading/error/load/clear only |
| 3.1-3.3 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | N/A (new pages) | ✅ Missing component modules failed compile | ✅ 4/4 passed | ✅ admin, user/AT, public, wrapper branch | ✅ Removed test DOM cleanup that broke Jasmine reporter |
| 3.4-3.7 | `src/app/routes/caregiver-attendance.routes.spec.ts` | Route config | N/A (route specs new) | ✅ Routes missing; 3/3 failed | ✅ 3/3 passed | ✅ admin, guarded user, public no-guard route | ✅ Public route inserted before wildcard; menu entries placed after `Locales` |
| 4.1 | Full shell verification | Karma | N/A | ✅ Full run exposed unrelated stale app spec | ✅ 19/19 new shell tests pass individually; full suite 21/22 due pre-existing failure | ✅ Targeted + full run evidence | ➖ None needed |
| 4.2 | Build | Angular production build | N/A | ➖ Build verification task | ✅ `ng build` passed | ➖ Single compile outcome | ➖ None needed |

## Test Summary

- **Total tests written**: 19
- **New shell tests passing**: 19/19 through targeted Karma runs
- **Full suite result**: 21/22 passing; only failure is pre-existing `src/app/app.component.spec.ts` expecting `Hello, fichas-frontend-2.0` in an app template that no longer renders that text
- **Layers used**: Unit (12), Component (4), Route config (3)
- **Approval tests**: None — no refactoring task required approval coverage
- **Pure helpers created**: 1 (`toParams()` query serialization helper)

## Verification Commands

Direct `pnpm` was unavailable in PATH, so verification used Corepack-provided pnpm without creating `package-lock.json`.

| Command | Result |
|---------|--------|
| `corepack pnpm install --frozen-lockfile` | ✅ Dependencies installed from existing `pnpm-lock.yaml`; no package-manager file mutation observed. |
| `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless --include=src/app/core/services/auth.service.spec.ts` | ✅ 2/2 passed |
| `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless --include=src/app/features/caregiver-attendance/interfaces/caregiver-attendance-dto-contracts.spec.ts` | ✅ 2/2 passed |
| `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless --include=src/app/features/caregiver-attendance/services/caregiver-attendance.service.spec.ts` | ✅ 4/4 passed |
| `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless --include=src/app/features/caregiver-attendance/states/caregiver-attendance.state.spec.ts` | ✅ 4/4 passed |
| `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless --include=src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | ✅ 4/4 passed |
| `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless --include=src/app/routes/caregiver-attendance.routes.spec.ts` | ✅ 3/3 passed |
| `corepack pnpm exec ng test --watch=false --browsers=ChromeHeadless` | ⚠️ 21/22 passed; unrelated stale `app.component.spec.ts` failed. No caregiver-attendance shell failures. |
| `corepack pnpm exec ng build` | ✅ Passed |

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/app/core/services/auth.service.ts` | Modified | Added generic role helper seam and AT helper. |
| `src/app/core/services/auth.service.spec.ts` | Created | Tests role-helper behavior from JWT roles payload. |
| `src/app/features/caregiver-attendance/interfaces/*.ts` | Created | JSON-safe DTO contracts with string date/timestamp fields. |
| `src/app/features/caregiver-attendance/interfaces/caregiver-attendance-dto-contracts.spec.ts` | Created | Protects string-date contracts from native `Date` typing. |
| `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` | Created | Thin 17-method HTTP service for backend endpoints. |
| `src/app/features/caregiver-attendance/services/caregiver-attendance.service.spec.ts` | Created | Verifies URLs, verbs, params, bodies, and no date conversion. |
| `src/app/features/caregiver-attendance/states/*.ts` | Created | Admin and user/AT signal state shells. |
| `src/app/features/caregiver-attendance/states/caregiver-attendance.state.spec.ts` | Created | Verifies load success, errors, fallback Spanish error, and clear. |
| `src/app/features/caregiver-attendance/pages/**` | Created | Authenticated admin/user placeholders and public self-service placeholder. |
| `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Created | Verifies placeholder copy and absence of workflow UI. |
| `src/app/routes/admin.routes.ts` | Modified | Added admin lazy route seam. |
| `src/app/routes/user.routes.ts` | Modified | Added user/AT lazy route seam with `committeeGuard`. |
| `src/app/routes/layout.routes.ts` | Modified | Added public self-service route before wildcard, no auth layout/guards. |
| `src/app/routes/caregiver-attendance.routes.spec.ts` | Created | Verifies route seams and public route guard/layout absence. |
| `src/app/layouts/admin-layout/pages/admin-layout/admin-layout.component.ts` | Modified | Added `Asistencia MC` after `Locales`. |
| `src/app/layouts/user-layout/pages/user-layout/user-layout.component.ts` | Modified | Added `Locales` then `Asistencia MC` so the new item is immediately after `Locales`. |
| `openspec/changes/caregiver-attendance-frontend-base/tasks.md` | Modified | Marked all apply tasks complete. |
| `openspec/changes/caregiver-attendance-frontend-base/apply-progress.md` | Created | Captured cumulative apply progress and TDD evidence. |

## Deviations from Design

- None for route/service/state scope. The implementation remains a Part 1 shell and does not add CRUD, assignment, schedule editing, attendance marking, exceptions UI, or reports UI.
- User layout did not previously expose `Locales` in the sidebar menu; it was added before `Asistencia MC` to satisfy the explicit “immediately after Locales” menu-order requirement.

## Issues Found

- Direct `pnpm` is not available in PATH, but `corepack pnpm` works.
- Full Karma suite has a pre-existing stale `src/app/app.component.spec.ts` failure unrelated to caregiver attendance.
- Karma logs a non-blocking 404 for `/base/media/Montserrat-VariableFont_wght.ttf` during tests.

## Remaining Tasks

- None for `caregiver-attendance-frontend-base` Part 1 apply.
