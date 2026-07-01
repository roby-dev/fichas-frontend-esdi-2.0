# Tasks: Caregiver Attendance Caregiver Management

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 450-650 |
| 800-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR with work-unit commits |
| Delivery strategy | single-pr-default |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
800-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Shared management list/search self-load | PR 1 | RED/GREEN behavior tests; wrappers kept valid. |
| 2 | Create/edit modal form flow | PR 1 | Tests stay with form/service seam implementation. |
| 3 | Cleanup placeholder scope | PR 1 | Remove placeholder assertions; verify deferred actions absent. |

## Phase 1: RED - Management Surface Tests

- [x] 1.1 Replace `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` placeholder-copy assertions with tests for admin/user wrapper rendering thin shared management wrappers.
- [x] 1.2 Add failing tests in that spec for route self-load via `AdminCaregiverAttendanceState.loadCaregivers()` and `CaregiverAttendanceState.loadCaregivers()` selected by `mode`.
- [x] 1.3 Add failing tests for table columns, Spanish empty row, search by name/document, and absence of assignment/transfer/schedule/mark/exception/report actions.

## Phase 2: GREEN - Shared List/Search Component

- [x] 2.1 Create `src/app/features/caregiver-attendance/pages/components/caregiver-management/caregiver-management.component.ts` selecting existing admin/user states by `mode` without collapsing DI seams.
- [x] 2.2 Create `caregiver-management.component.html` using committee-style table/modal structure and community-halls table styling; no hero/slate/`rounded-2xl` placeholder.
- [x] 2.3 Modify `admin-caregiver-attendance.component.{ts,html}` and `user-caregiver-attendance.component.{ts,html}` to remain thin wrappers importing/rendering `<app-caregiver-management mode="admin|user" />`.

## Phase 3: RED/GREEN - Form and Save Flow

- [x] 3.1 Add failing behavior tests for create/edit modal submit calling `createCaregiver`/`updateCaregiver`, then reloading the selected state and closing the modal.
- [x] 3.2 Add failing form tests for `input type="date"` string binding and emitted DTOs without `Date` objects.
- [x] 3.3 Create `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.{ts,html}` with Signals Forms, Spanish labels/errors, `app-input`, `app-button`, and styled native selects.
- [x] 3.4 Wire modal save in `caregiver-management.component.ts` with existing `CaregiverAttendanceService` create/update seams, `isSaving`, reload, and Spanish error handling.

## Phase 4: Verification / Refactor

- [x] 4.1 Keep `caregiver-attendance.service.spec.ts`, `caregiver-attendance.state.spec.ts`, and `caregiver-attendance-dto-contracts.spec.ts` passing without service contract expansion.
- [x] 4.2 Run `pnpm test -- --watch=false --browsers=ChromeHeadless`; fix only list/search/create/edit regressions.
- [x] 4.3 Run `pnpm build`; ensure strict templates pass and generated UI copy remains Spanish.
