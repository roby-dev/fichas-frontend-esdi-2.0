# Proposal: Caregiver Attendance Schedules and Marking

## Intent

Deliver the next deferred slice of the caregiver-attendance frontend: **schedule version management** and **attendance marking** (public self-service + authenticated assisted mark). This replaces the self-service placeholder with a real public mark form, adds an authenticated schedule management surface (list, builder form, copy-to-hall), and adds an authenticated assisted mark create form. It keeps the backend authoritative for scope, schedule resolution, and window enforcement.

## Scope

### In
- Schedule version list per Community Hall (admin + AT/user).
- Schedule version builder form: header (communityHallId, name, validFrom, validTo), repeatable blocks, seven fixed day-of-week rules, repeatable special days.
- Copy-to-hall action as a row action on a schedule version.
- Public self-service mark form (replaces placeholder): document type/number, submits to `POST /marks/self-service`.
- Authenticated assisted mark create form: caregiver, date, block, optional entry time, reason → `POST /marks/assisted`.
- Schedule + mark signal state shells with loading/error/data/clear.
- Behavior-focused Karma/Jasmine tests for list, builder save, copy, self-service submit, assisted submit, Spanish copy, and absence of deferred workflows.
- Internal section navigation inside the existing `caregiver-attendance` feature route (caregiver management / schedule versions / assisted marking).

### Out (deferred)
- **Correction** (`PATCH /marks/:id/correction`) — deferred: backend exposes no list-marks endpoint, so a correction UI cannot discover its target mark without manual mark-id entry. Revisit when a retrieval seam exists.
- Transfer / assignment editing.
- Exceptions / justifications.
- Monthly reports (hall + committee).
- Authentication redesign or client-side scope enforcement.
- Backend changes (contract is final and matches existing DTOs).

## Approach

**Approach 1 (from exploration): extend the existing `caregiver-attendance` feature route with internal sections**, not embed into `caregiver-management`. The authenticated `caregiver-attendance` page becomes a small section switcher (local tabs or feature-internal child views) over three sections: caregiver management (existing), schedule versions (new), assisted marking (new). The public self-service route stays a separate public page and is upgraded from placeholder to a real form.

**Schedule form = single builder with repeatable rows**, split into focused standalone components to control review size:
- `schedule-version-list` — gray/blue table + toolbar (canonical pattern: `community-halls` / `committees` / existing `caregiver-management`), row actions: `Copiar`.
- `schedule-version-form` — modal builder with sub-components:
  - `schedule-blocks-editor` — repeatable block rows (name, entryTime, exitTime, exitRequired, toleranceMinutes, markingWindowMinutes).
  - `schedule-day-rules-editor` — seven fixed day-of-week rows (isWorkingDay + blockIds multi-select).
  - `schedule-special-days-editor` — repeatable special-day rows (localDate, isWorkingDay, blockIds).
- `schedule-copy-modal` — target hall + validFrom + name.

**Copy-to-hall** = row action on `schedule-version-list` opening `schedule-copy-modal`.

**Self-service** = real public form on `self-service-caregiver-attendance` page: document type (default DNI) + document number, submit to `selfServiceMark`, show Spanish success/rejection message from the `MarkResponse`/error. No auth guards, no layout chrome (per current spec).

**Assisted mark** = create form (NOT a marks table — there is no list endpoint): caregiver select (loaded from caregivers), date (`input type="date"`), block select (loaded from the active schedule for the caregiver's hall), optional entry time, reason. Submit to `assistedMark`.

State: add `CaregiverScheduleState` (list-by-hall, create, copy) and `CaregiverMarkState` (self-service + assisted submit) following the Service+Signals convention. No new service methods — reuse existing seams.

Dates/times stay strings end-to-end (`input type="date"` for dates, `input type="time"` for HH:mm). No client-side `Date` conversion.

## Affected Areas

- `src/app/features/caregiver-attendance/pages/caregiver-attendance/caregiver-attendance.component.{ts,html}` — add section switching.
- `src/app/features/caregiver-attendance/pages/components/admin-caregiver-attendance` + `user-caregiver-attendance` — remain thin wrappers; section switch lives in the shared page or a new `caregiver-attendance-sections` component.
- New: `pages/components/schedule-version-list/`, `schedule-version-form/` (+ `schedule-blocks-editor`, `schedule-day-rules-editor`, `schedule-special-days-editor`), `schedule-copy-modal/`, `assisted-mark-form/`.
- `src/app/features/caregiver-attendance/pages/self-service-caregiver-attendance/` — replace placeholder with real form.
- New: `states/caregiver-schedule.state.ts`, `states/caregiver-mark.state.ts`.
- `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` — unchanged (seams exist).
- `src/app/features/caregiver-attendance/interfaces/` — unchanged (DTOs match).
- Tests: new `.spec.ts` for each new component + state; update `caregiver-attendance-placeholders.spec.ts` to assert deferred workflows stay absent (correction, exceptions, reports, transfer).

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 700-900 |
| 800-line budget risk | Medium |
| Chained PRs recommended | No (fallback: Yes if forecast overshoots) |
| Suggested split | Single PR with work-unit commits |
| Delivery strategy | single-pr-default |
| Chain strategy | fallback-chained |

Decision needed before apply: No. If apply-phase forecast exceeds ~850 lines, split into chained PRs at the schedule/marking boundary.

## Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Schedule state shell + list-by-hall + section switch | PR 1 | RED tests for list load + section nav. |
| 2 | Schedule builder form (blocks/day-rules/special-days) | PR 1 | Largest unit; split into sub-components. |
| 3 | Copy-to-hall modal + row action | PR 1 | Reuses schedule state. |
| 4 | Public self-service mark form (replace placeholder) | PR 1 | Public route; Spanish success/rejection. |
| 5 | Assisted mark create form | PR 1 | Caregiver + block selects from existing data. |
| 6 | Behavior tests + placeholder cleanup | PR 1 | Assert deferred workflows absent. |

## Risks

- Schedule builder is the highest-complexity part; blocks + 7 day rules + special days can sprawl — mitigated by splitting into 3 editor sub-components.
- No authenticated "list marks for hall/date" endpoint: assisted marking is create-only; correction is deferred for this reason.
- Combined schedule + marking may approach/exceed the 800-line review budget — fallback is chained PRs at the schedule/marking boundary.
- Zoneless change detection: all derived UI must stay signal-driven; no mutable form/list state assuming zone refreshes.
- Block multi-select in day rules / special days depends on block ids that only exist after the form is built — need stable local ids (generated client-side) referenced by day-rule/special-day `blockIds`.

## Ready for Spec

Yes.
