# Archive Report: Caregiver Attendance Schedules and Marking

## Archived

Change `caregiver-attendance-schedules-and-marking` moved to `openspec/changes/archive/2026-07-02-caregiver-attendance-schedules-and-marking/`.

## Spec sync

Delta spec merged into canonical `openspec/specs/caregiver-attendance-frontend/spec.md`:
- MODIFIED `Frontend Feature Shell` — now mandates authenticated sections (caregiver management / schedule versions / assisted marking) + real public self-service mark form; deferred list updated (correction, exceptions, reports, transfer).
- Updated `Public Self-Service Route` scenario wording from "placeholder" to "mark form".
- ADDED: `Schedule Version List and Load`, `Schedule Version Builder Form`, `Schedule Copy to Hall`, `Public Self-Service Mark Form`, `Authenticated Assisted Mark Form`, `Schedule and Mark State Shells`, `Behavior Tests for Schedules and Marking`.

## Implementation

- New components: `caregiver-attendance-sections`, `schedule-version-list`, `schedule-version-form` (+ `schedule-blocks-editor`, `schedule-day-rules-editor`, `schedule-special-days-editor`), `schedule-copy-modal`, `assisted-mark-form`.
- New states: `caregiver-schedule.state.ts`, `caregiver-mark.state.ts` (+ specs).
- Modified: admin/user wrappers (render sections), `self-service-caregiver-attendance` (real form), `caregiver-attendance-placeholders.spec.ts` (deferred-scope assertions).
- Service + DTO interfaces: unchanged.

## Verification

- `pnpm build`: PASS.
- `pnpm test -- --watch=false --browsers=ChromeHeadless`: 42/43 pass; only pre-existing unrelated `AppComponent should render title` fails.
- Line budget: ~835 implementation lines — within the 800-line forecast (Medium risk), single PR.

## Deviations (acceptable, recorded)

- Assisted mark form resolves caregiver hall via existing `getCaregiverAssignments` seam (`CaregiverMotherResponse` has no hall id). No contract expansion.
- Unscheduled block ids use `crypto.randomUUID()`; backend DTO accepts optional `id`.

## Not committed

No commit, push, or PR created. Working tree contains the implementation + archived change + merged spec, ready for fresh-context review and commit.
