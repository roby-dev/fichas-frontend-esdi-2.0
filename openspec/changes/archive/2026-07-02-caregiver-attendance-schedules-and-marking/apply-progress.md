# Apply Progress: Caregiver Attendance Schedules and Marking

## Status

All Phase 1-8 tasks are implemented in OpenSpec mode. `tasks.md` checkboxes were updated to `[x]`.

## Completed Tasks

- [x] Phase 1: RED state shell and section-switcher tests.
- [x] Phase 2: Authenticated internal section switcher and admin/user wrapper integration.
- [x] Phase 3: Schedule version list with admin/user hall selector and row actions.
- [x] Phase 4: Schedule builder form with blocks, day rules, and special days editors.
- [x] Phase 5: Copy-to-hall modal and `Copiar` row action.
- [x] Phase 6: Public self-service attendance mark form.
- [x] Phase 7: Authenticated assisted mark create form.
- [x] Phase 8: Behavior tests, deferred-scope assertions, build/test verification.

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1 | `src/app/features/caregiver-attendance/states/caregiver-schedule.state.spec.ts` | Unit | N/A (new) | ✅ Written first for missing state | ✅ State delegates to service seams | ✅ Load/create/copy/error/clear cases | ✅ Shell matches existing signal-state pattern |
| 1.2 | `src/app/features/caregiver-attendance/states/caregiver-mark.state.spec.ts` | Unit | N/A (new) | ✅ Written first for missing state | ✅ Self-service and assisted mark seams pass | ✅ Success/error/clear cases | ✅ Shared loading/error shape |
| 1.3, 2.x | `src/app/features/caregiver-attendance/pages/caregiver-attendance-schedules-and-marking.spec.ts` | Component unit | Existing caregiver placeholder specs run later | ✅ Section behavior asserted before component existed | ✅ Switcher renders active section only | ✅ Caregivers → horarios transition | ✅ Wrappers now delegate to shared switcher |
| 3.x | `src/app/features/caregiver-attendance/pages/caregiver-attendance-schedules-and-marking.spec.ts` | Component unit | Existing wrapper specs run later | ✅ Hall load/list behavior test added | ✅ List loads by selected hall | ✅ Actions present; deferred actions absent | ✅ Hall selector uses existing hall states |
| 4.x | `src/app/features/caregiver-attendance/pages/caregiver-attendance-schedules-and-marking.spec.ts` | Component unit | N/A (new components) | ✅ Builder request test added | ✅ Form builds `CreateScheduleVersionRequest` | ✅ String dates/times + matching block refs | ✅ Editors split by concern |
| 5.x | `src/app/features/caregiver-attendance/pages/caregiver-attendance-schedules-and-marking.spec.ts` | Component unit | N/A (new component) | ✅ Copy request test added | ✅ Modal emits copy request | ✅ Target hall/date/name asserted | ✅ List owns close/reload orchestration |
| 6.x | `src/app/features/caregiver-attendance/pages/caregiver-attendance-schedules-and-marking.spec.ts`; `caregiver-attendance-placeholders.spec.ts` | Component unit | ✅ Placeholder spec exposed changed behavior | ✅ Self-service submit/error test added | ✅ Form submits through mark state | ✅ Success/rejection/auth-chrome absence covered | ✅ Placeholder assertions updated to real-form behavior |
| 7.x | `src/app/features/caregiver-attendance/pages/caregiver-attendance-schedules-and-marking.spec.ts` | Component unit | N/A (new component) | ✅ Assisted submit test added | ✅ Assisted form delegates to mark state | ✅ Assignment schedule load + no table/correction | ✅ Uses existing assignment/schedule seams |
| 8.x | Existing and new caregiver-attendance specs | Unit/component | ✅ Full caregiver suite run | ✅ Deferred-scope assertions updated | ✅ Caregiver attendance specs pass | ✅ 42/43 full-suite specs pass; only unrelated AppComponent title fails | ✅ Build is green |

## Test Summary

- **Total tests written/updated**: 11 caregiver-attendance tests added/updated.
- **Layers used**: Unit/component tests with Karma + Jasmine.
- **Build**: `pnpm build` ✅ passed after implementation.
- **Test command**: `pnpm test -- --watch=false --browsers=ChromeHeadless` executed. Result: 42 passed / 43 executed; the only failure is the pre-existing unrelated `AppComponent should render title` expectation (`Expected undefined to contain 'Hello, fichas-frontend-2.0'`). Caregiver-attendance schedule/marking tests pass.

## Files Changed

- Created schedule/mark states and state specs.
- Created section switcher, schedule list, schedule builder/editor, copy modal, assisted mark form components.
- Replaced public self-service placeholder with real form.
- Updated admin/user wrappers to render internal sections.
- Updated caregiver-attendance placeholder/deferred-scope tests.
- Updated `tasks.md` completion markers.

## Deviations / Notes

- The assisted mark form uses the existing `getCaregiverAssignments` service seam to resolve the selected caregiver's hall before loading schedule blocks, because `CaregiverMotherResponse` does not include a hall id.
- No service methods or backend DTO interfaces were changed.
- Dates and times stay as string values bound to `input type="date"` / `input type="time"`.
- Deferred workflows remain absent: transfer editing, corrections, exceptions, reports, and backend/auth changes were not implemented.
