# Tasks: Caregiver Attendance Schedules and Marking

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 700-900 |
| 800-line budget risk | Medium |
| Chained PRs recommended | No (fallback: Yes if apply forecast overshoots ~850) |
| Suggested split | Single PR with work-unit commits |
| Delivery strategy | single-pr-default |
| Chain strategy | fallback-chained |

Decision needed before apply: No. If the apply-phase line forecast exceeds ~850, split at the schedule/marking boundary into chained PRs.

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Schedule + mark state shells; section switcher | PR 1 | RED tests for state delegation + section tab render. |
| 2 | Schedule version list + hall selector | PR 1 | Self-load by hall; Spanish empty state. |
| 3 | Schedule builder form + 3 editor sub-components | PR 1 | Largest unit; stable client-side block ids. |
| 4 | Copy-to-hall modal + row action | PR 1 | Reuses schedule state. |
| 5 | Public self-service mark form (replace placeholder) | PR 1 | Public route; Spanish success/rejection. |
| 6 | Assisted mark create form | PR 1 | Caregiver + block selects; no marks list. |
| 7 | Behavior tests + placeholder/deferred-scope cleanup | PR 1 | Assert correction/exceptions/reports/transfer absent. |

## Implementation note (resolves design open question)

The current `caregiver-management` loads caregivers backend-scoped via state and does NOT bind a hall. The schedule section requires a `communityHallId`, so the schedule section MUST include a hall selector dropdown sourcing from `AdminCommunityHallState` (admin) / `CommunityHallState` (user/AT), with a Spanish prompt when no hall is selected. Block ids for unsaved blocks use `crypto.randomUUID()`; day-rule/special-day `blockIds` reference these.

## Phase 1: RED — State Shells and Section Switcher

- [x] 1.1 Add failing tests for `CaregiverScheduleState` (`loadByHall`/`create`/`copy`/`clear` delegating to `CaregiverAttendanceService` seams; no new service method).
- [x] 1.2 Add failing tests for `CaregiverMarkState` (`selfService`/`assisted`/`clear` delegating to service seams; no new service method).
- [x] 1.3 Add failing tests for `caregiver-attendance-sections` rendering only the active section child (`caregivers` / `horarios` / `asistencias`) by signal.

## Phase 2: GREEN — Section Switcher and Wrappers

- [x] 2.1 Create `src/app/features/caregiver-attendance/pages/components/caregiver-attendance-sections/caregiver-attendance-sections.component.{ts,html}` with `mode` input and `activeSection` signal; renders `caregiver-management`, `schedule-version-list`, or `assisted-mark-form`.
- [x] 2.2 Modify `admin-caregiver-attendance.component.{ts,html}` and `user-caregiver-attendance.component.{ts,html}` to render `<app-caregiver-attendance-sections mode="admin|user" />` instead of `<app-caregiver-management>` directly.

## Phase 3: RED/GREEN — Schedule List and Hall Selector

- [x] 3.1 Add failing tests for `schedule-version-list`: self-load via `CaregiverScheduleState.loadByHall(hallId)` on hall change; Spanish empty row when no versions; `Copiar` and `Nuevo` actions present; no correction/exception/report/transfer actions.
- [x] 3.2 Create `schedule-version-list.component.{ts,html}` with gray/blue table + toolbar, hall selector dropdown (admin: `AdminCommunityHallState`; user: `CommunityHallState`), Spanish prompt when no hall selected, columns (name, `validFrom`, `validTo`, actions).

## Phase 4: RED/GREEN — Schedule Builder Form

- [x] 4.1 Add failing tests for `schedule-version-form`: submit emits `CreateScheduleVersionRequest` with string `validFrom`/`validTo` and `entryTime`/`exitTime` strings; `blockIds` in day rules/special days reference existing block ids; no `Date` objects in emitted request.
- [x] 4.2 Create `schedule-blocks-editor.component.{ts,html}`: repeatable block rows with stable `crypto.randomUUID()` ids; fields name, entryTime (`input type="time"`), exitTime?, exitRequired, toleranceMinutes, markingWindowMinutes.
- [x] 4.3 Create `schedule-day-rules-editor.component.{ts,html}`: seven fixed day-of-week rows (0-6) with `isWorkingDay` toggle and block multi-select bound to the blocks list.
- [x] 4.4 Create `schedule-special-days-editor.component.{ts,html}`: repeatable rows with `localDate` (`input type="date"`), `isWorkingDay`, block multi-select.
- [x] 4.5 Create `schedule-version-form.component.{ts,html}`: modal header (communityHallId bound to selected hall, name, validFrom, validTo?) composing the 3 editors; submit calls `CaregiverScheduleState.create()` then closes and triggers list reload.

## Phase 5: RED/GREEN — Copy to Hall

- [x] 5.1 Add failing tests for `schedule-copy-modal`: submit emits `CopyScheduleVersionRequest` with `targetHallId`, string `validFrom`, `name`; modal closes on success.
- [x] 5.2 Create `schedule-copy-modal.component.{ts,html}` (target hall select + validFrom + name) and wire `Copiar` row action in `schedule-version-list` to open it, calling `CaregiverScheduleState.copy()`.

## Phase 6: RED/GREEN — Public Self-Service Mark

- [x] 6.1 Add failing tests for `self-service-caregiver-attendance`: submit calls `CaregiverMarkState.selfService()` with `SelfServiceMarkRequest`; success shows Spanish confirmation; rejection shows Spanish message; no auth guard/layout chrome.
- [x] 6.2 Modify `self-service-caregiver-attendance.component.{ts,html}` to replace placeholder with real form (documentType default `DNI`, documentNumber), using `CaregiverMarkState`; surface `MarkResponse`/error in Spanish.

## Phase 7: RED/GREEN — Assisted Mark Form

- [x] 7.1 Add failing tests for `assisted-mark-form`: submit calls `CaregiverMarkState.assisted()` with `AssistedMarkRequest` carrying string `localDate`/`entryTime`; block select populated from active schedule blocks for the caregiver's hall; no marks table; no correction action.
- [x] 7.2 Create `assisted-mark-form.component.{ts,html}`: caregiver select (from existing caregiver state), date (`input type="date"`), block select (derived from `CaregiverScheduleState` for the selected caregiver's hall), optional entryTime (`input type="time"`), reason; submit via `CaregiverMarkState.assisted()`.

## Phase 8: Verification / Refactor

- [x] 8.1 Update `caregiver-attendance-placeholders.spec.ts` to assert deferred workflows (correction, exceptions, reports, transfer) stay absent across all new sections; keep service/state/DTO contract specs passing.
- [x] 8.2 Run `pnpm test -- --watch=false --browsers=ChromeHeadless`; fix only schedule/marking regressions plus the pre-existing unrelated `AppComponent should render title` failure only if it blocks the run.
- [x] 8.3 Run `pnpm build`; ensure strict templates pass and all new UI copy is Spanish.
