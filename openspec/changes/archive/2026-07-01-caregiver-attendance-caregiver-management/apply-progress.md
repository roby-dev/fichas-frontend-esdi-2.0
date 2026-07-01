# Apply Progress: Caregiver Attendance Caregiver Management

**Change**: `caregiver-attendance-caregiver-management`
**Mode**: Strict TDD
**Artifact store**: OpenSpec + Engram progress mirror
**Delivery**: single apply / single PR default, work-unit boundaries, no commits created

## Summary

Implemented Part 2 caregiver mother management in the Angular frontend. The Part 1 hero/slate placeholder was replaced by a shared catalog-style management component with self-loading admin/user state selection, Spanish table/search/create/edit UI, `app-modal`, and Signals Forms. Backend role/scope remains authoritative; no assignment, transfer, schedule, mark, exception, justification, or report actions were added.

## Completed Tasks

- [x] 1.1 Replace placeholder-copy assertions with admin/user wrapper tests for shared management wrappers.
- [x] 1.2 Add route self-load tests for `AdminCaregiverAttendanceState.loadCaregivers()` and `CaregiverAttendanceState.loadCaregivers()` selected by `mode`.
- [x] 1.3 Add table/search/empty/deferred-action tests.
- [x] 2.1 Create shared `CaregiverManagementComponent` selecting existing admin/user states by `mode`.
- [x] 2.2 Create management template using toolbar, search, gray/blue table, modal, and no hero/slate/`rounded-2xl` placeholder.
- [x] 2.3 Keep admin/user route wrappers as thin `<app-caregiver-management mode="admin|user" />` adapters.
- [x] 3.1 Add create/edit save-flow behavior tests.
- [x] 3.2 Add form date-string binding tests.
- [x] 3.3 Create `CaregiverMotherFormComponent` with Signals Forms, Spanish labels/errors, `app-input`, `app-button`, and styled native selects.
- [x] 3.4 Wire create/update save flow through `CaregiverAttendanceService`, reload selected state, close modal on success, and show Spanish save errors.
- [x] 4.1 Existing service/state/DTO contract specs pass unchanged.
- [x] 4.2 Full test command was run; caregiver-related tests pass, with one pre-existing unrelated `AppComponent should render title` failure still present.
- [x] 4.3 `pnpm build` passes strict template/build checks.

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/app/features/caregiver-attendance/pages/components/caregiver-management/caregiver-management.component.ts` | Created | Shared self-loading management component selecting admin/user state by `mode`, filtering caregivers, opening create/edit modal, and saving via existing service seams. |
| `src/app/features/caregiver-attendance/pages/components/caregiver-management/caregiver-management.component.html` | Created | Spanish toolbar/search/table/modal UI matching existing catalog conventions and omitting deferred workflow actions. |
| `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.ts` | Created | Signals Form for caregiver create/edit with string date handling and Spanish validation messages. |
| `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.html` | Created | `app-input`, native select, date inputs, and `app-button` form markup. |
| `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.spec.ts` | Created | Form behavior tests for date inputs and emitted string DTOs. |
| `src/app/features/caregiver-attendance/pages/components/admin-caregiver-attendance/admin-caregiver-attendance.component.{ts,html}` | Modified | Replaced placeholder with thin shared management wrapper using `mode="admin"`. |
| `src/app/features/caregiver-attendance/pages/components/user-caregiver-attendance/user-caregiver-attendance.component.{ts,html}` | Modified | Replaced placeholder with thin shared management wrapper using `mode="user"`. |
| `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Modified | Replaced placeholder tests with behavior tests for wrappers, state self-load, search/table/empty, deferred actions absence, and save flow. |
| `openspec/changes/caregiver-attendance-caregiver-management/tasks.md` | Modified | Marked all apply tasks complete. |
| `openspec/changes/caregiver-attendance-caregiver-management/apply-progress.md` | Created | Recorded cumulative apply progress and TDD evidence. |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ Wrapper tests written before component changes | ✅ Targeted caregiver specs 10/10 passing | ✅ Admin and user wrapper cases | ✅ Placeholder assertions removed |
| 1.2 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ Self-load mode tests written before management component | ✅ Targeted caregiver specs 10/10 passing | ✅ Admin mode and user mode separate state calls | ✅ Shared state-selection helper kept local |
| 1.3 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ Table/search/empty/deferred-action tests written first | ✅ Targeted caregiver specs 10/10 passing | ✅ Matching and no-match search paths | ✅ Filtering kept in computed signal |
| 2.1 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ Tests referenced missing `CaregiverManagementComponent` first | ✅ Targeted caregiver specs 10/10 passing | ✅ Admin and user modes | ✅ Existing state classes preserved |
| 2.2 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ UI behavior tests failed before template existed | ✅ Targeted caregiver specs 10/10 passing | ✅ Populated and empty table states | ✅ Catalog markup aligned with existing modules |
| 2.3 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ Wrapper tests failed before wrapper imports changed | ✅ Targeted caregiver specs 10/10 passing | ✅ Admin wrapper and user wrapper | ✅ Wrappers remain thin adapters |
| 3.1 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ Save-flow tests written before save wiring | ✅ Targeted caregiver specs 10/10 passing | ✅ Create and edit paths | ✅ Save error surfaced as Spanish alert |
| 3.2 | `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.spec.ts` | Component/Form | N/A (new file) | ✅ Form tests referenced missing component first | ✅ Targeted caregiver specs 10/10 passing | ✅ Create and edit date-string cases | ✅ Date normalization uses string slicing only |
| 3.3 | `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.spec.ts` | Component/Form | N/A (new file) | ✅ Form tests failed before form implementation | ✅ Targeted caregiver specs 10/10 passing | ✅ Required fields and optional endDate omission | ✅ Signals Forms pattern matched existing modules |
| 3.4 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component | ✅ Existing placeholder spec 4/4 passing | ✅ Save-flow tests written before modal save implementation | ✅ Targeted caregiver specs 10/10 passing | ✅ Create and update service seams | ✅ Reload/close flow follows catalog modules |
| 4.1 | Existing caregiver service/state/DTO specs | Unit/Contract | ✅ Existing contract specs preserved | ✅ No service contract expansion added | ✅ Targeted contract set 20/20 passing | ✅ Service, state, DTO contracts included | ➖ None needed |
| 4.2 | Full suite | Integration | ✅ Targeted caregiver specs green before full run | ✅ Full command run after implementation | ⚠️ 27/28 passing; unrelated pre-existing app title spec fails | ✅ Caregiver tests pass in full run | ➖ Not fixed per instruction |
| 4.3 | Build | Build | ✅ Targeted tests green | ✅ Build run after implementation | ✅ `pnpm build` passed | ➖ Single build path | ➖ None needed |

## Test Summary

- **Total tests written/updated**: 10 caregiver management/form tests in the changed specs.
- **Targeted caregiver tests**: `10/10` passing for new management/form behavior.
- **Caregiver contract regression set**: `20/20` passing including service/state/DTO contracts plus new management/form specs.
- **Full suite**: `27/28` passing; `src/app/app.component.spec.ts` still has the pre-existing `Expected undefined to contain 'Hello, fichas-frontend-2.0'` failure.
- **Build**: `pnpm build` passed.
- **Layers used**: Component/Form and service/state/DTO contract tests.
- **Approval tests**: Existing placeholder spec baseline was run before replacement (`4/4` passing).
- **Pure functions created**: None exported; filtering/date normalization are internal deterministic helpers.

## Verification Commands

| Command | Result |
|---------|--------|
| `pnpm test -- --watch=false --browsers=ChromeHeadless --include=src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | ✅ Baseline placeholder spec `4/4` passing before production changes. |
| `pnpm test -- --watch=false --browsers=ChromeHeadless --include=src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts --include=src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.spec.ts` | ✅ New caregiver management/form specs `10/10` passing after implementation. RED before implementation failed on missing `CaregiverManagementComponent` and `CaregiverMotherFormComponent`. |
| `pnpm test -- --watch=false --browsers=ChromeHeadless --include=src/app/features/caregiver-attendance/services/caregiver-attendance.service.spec.ts --include=src/app/features/caregiver-attendance/states/caregiver-attendance.state.spec.ts --include=src/app/features/caregiver-attendance/interfaces/caregiver-attendance-dto-contracts.spec.ts --include=src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts --include=src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.spec.ts` | ✅ `20/20` passing. |
| `pnpm test -- --watch=false --browsers=ChromeHeadless` | ⚠️ `27/28` passing; unrelated pre-existing `AppComponent should render title` failure remains. |
| `pnpm build` | ✅ Passed. |

## Deviations from Design

None — implementation matches design. Assignment information remains deferred as requested.

## Issues Found

- Direct `pnpm` works, but pnpm 11 warns that the `pnpm.onlyBuiltDependencies` field in `package.json` is ignored and should move to pnpm settings. No package-manager migration was performed.
- Full Karma run still has the known pre-existing unrelated failure in `src/app/app.component.spec.ts`: `Expected undefined to contain 'Hello, fichas-frontend-2.0'`.
- Karma logs a font 404 warning for `/base/media/Montserrat-VariableFont_wght.ttf`; tests still execute.

## Remaining Tasks

None for this apply change. Next recommended phase: `sdd-verify`.
