# Design: Caregiver Attendance Schedules and Marking

## Technical Approach

Extend the authenticated `caregiver-attendance` feature surface with three internal sections (caregiver management, schedule versions, assisted marking) plus a real public self-service mark form. Reuse the catalog-table pattern (`p-0 sm:p-4`, gray/blue table, toolbar, `app-modal`, Signals Forms, Spanish copy) from `caregiver-management`, `community-halls`, and `committees`. Add Service+Signals state shells for schedules and marks that delegate to the already-complete `CaregiverAttendanceService` seams — the service contract is NOT expanded. Split the schedule builder into focused editor sub-components to control review size. Dates/times stay strings end-to-end via `input type="date"` / `input type="time"`. The backend stays authoritative for scope, schedule resolution, and marking-window enforcement.

## Architecture Decisions

| Option | Tradeoff | Decision |
|---|---|---|
| Embed schedules/marking into `caregiver-management` | Fewer top-level files, but conflates caregiver CRUD with hall schedule workflows; poor reviewability. | Add internal sections inside the `caregiver-attendance` feature; keep `caregiver-management` as one section. |
| Tabs vs. feature-internal child routing for sections | Child routing adds route config complexity; tabs are lighter and match a single feature entry. | Local section tabs (`caregivers` / `horarios` / `asistencias`) in a shared `caregiver-attendance-sections` component; no new lazy routes. |
| One big schedule form component | Simplest file count, but threatens the 800-line budget and mixes concerns. | Split into `schedule-version-form` + 3 editor sub-components (`schedule-blocks-editor`, `schedule-day-rules-editor`, `schedule-special-days-editor`). |
| Block ids from backend | Backend assigns ids on create, but the form needs stable refs before save for day-rule/special-day selection. | Generate stable client-side ids (`crypto.randomUUID()` or a counter) for unsaved blocks; reference them in `blockIds`. Backend accepts `id?` and reassigns. |
| Marks table for AT | Would need a list endpoint; none exists. | Assisted mark = create form only; no marks list. Correction deferred. |
| Client-side marking-window validation | Feels helpful, but contradicts backend authority. | No client-side window/scope rules; surface backend success/rejection verbatim in Spanish. |
| `Date` parsing for formatting | Convenient, but violates the string DTO invariant. | Bind `input type="date"`/`type="time"` to strings; no `Date` conversion. |
| New service methods | Would expand contract; seams already exist. | Reuse `createSchedule`, `listSchedulesByHall`, `copySchedule`, `selfServiceMark`, `assistedMark` as-is. |

## Data Flow

```text
Authenticated route -> admin/user wrapper -> caregiver-attendance-sections(section signal)
  -> 'horarios':  CaregiverScheduleState.loadByHall(hallId) -> listSchedulesByHall -> table
                  -> create: schedule-version-form -> createSchedule -> reload
                  -> copy:    schedule-copy-modal -> copySchedule -> reload target hall
  -> 'asistencias': CaregiverMarkState + caregiver list + hall schedule blocks
                  -> assistedMark -> Spanish success/error

Public route -> self-service-caregiver-attendance (real form)
  -> CaregiverMarkState.selfService(req) -> selfServiceMark -> Spanish success/rejection
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/app/features/caregiver-attendance/pages/components/caregiver-attendance-sections/caregiver-attendance-sections.component.{ts,html}` | Create | Section tab switcher rendering `caregiver-management`, `schedule-version-list`, or `assisted-mark-form` by signal. |
| `src/app/features/caregiver-attendance/pages/components/admin-caregiver-attendance/*` | Modify | Render `<app-caregiver-attendance-sections mode="admin" />` instead of just `caregiver-management`. |
| `src/app/features/caregiver-attendance/pages/components/user-caregiver-attendance/*` | Modify | Render `<app-caregiver-attendance-sections mode="user" />`. |
| `src/app/features/caregiver-attendance/pages/components/schedule-version-list/schedule-version-list.component.{ts,html}` | Create | Gray/blue table + toolbar listing schedule versions for selected hall; `Copiar` row action; `Nuevo` toolbar button. |
| `src/app/features/caregiver-attendance/pages/components/schedule-version-form/schedule-version-form.component.{ts,html}` | Create | Builder modal: header + 3 editor sub-components; emits `CreateScheduleVersionRequest`. |
| `src/app/features/caregiver-attendance/pages/components/schedule-blocks-editor/schedule-blocks-editor.component.{ts,html}` | Create | Repeatable block rows with stable client-side ids. |
| `src/app/features/caregiver-attendance/pages/components/schedule-day-rules-editor/schedule-day-rules-editor.component.{ts,html}` | Create | Seven fixed day-of-week rows with block multi-select. |
| `src/app/features/caregiver-attendance/pages/components/schedule-special-days-editor/schedule-special-days-editor.component.{ts,html}` | Create | Repeatable special-day rows with date + block multi-select. |
| `src/app/features/caregiver-attendance/pages/components/schedule-copy-modal/schedule-copy-modal.component.{ts,html}` | Create | Target hall + validFrom + name modal emitting `CopyScheduleVersionRequest`. |
| `src/app/features/caregiver-attendance/pages/components/assisted-mark-form/assisted-mark-form.component.{ts,html}` | Create | Caregiver select + date + block select + optional entry time + reason; emits `AssistedMarkRequest`. |
| `src/app/features/caregiver-attendance/pages/self-service-caregiver-attendance/self-service-caregiver-attendance.component.{ts,html}` | Modify | Replace placeholder with real public mark form using `selfServiceMark`. |
| `src/app/features/caregiver-attendance/states/caregiver-schedule.state.ts` | Create | Signal state: `versions`, `isLoading`, `error`, `loadByHall`, `create`, `copy`, `clear`. |
| `src/app/features/caregiver-attendance/states/caregiver-mark.state.ts` | Create | Signal state: `lastMark`, `isSubmitting`, `error`, `selfService`, `assisted`, `clear`. |
| `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` | Reuse | Unchanged. |
| `src/app/features/caregiver-attendance/interfaces/*.ts` | Reuse | Unchanged; DTOs match backend. |
| New `*.spec.ts` per new component + state | Create | Behavior-focused Karma/Jasmine tests. |
| `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Modify | Assert deferred workflows (correction, exceptions, reports, transfer) stay absent. |

## Interfaces / Contracts

`CaregiverAttendanceSectionsComponent` inputs: `mode: 'admin' | 'user'`. Owns `activeSection = signal<'caregivers' | 'horarios' | 'asistencias'>('caregivers')`. Renders the matching child component. Hall id comes from the existing `CommitteeState`/community-hall selection seam used by `caregiver-management` siblings; if no hall is selected, schedule list shows a Spanish empty/prompt state.

`ScheduleVersionListComponent`: inputs `hallId: string | null`, `mode`. Injects `CaregiverScheduleState`. Emits `create` and `copy(schedule)` events to the parent for modal orchestration, OR owns its own modal open state (recommended: own it, mirroring `caregiver-management`). Columns: name, `validFrom`, `validTo`, actions (`Copiar`).

`ScheduleVersionFormComponent`: input `hallId`; output `saved`. Signals Form with arrays for blocks/dayRules/specialDays. Uses `crypto.randomUUID()` for unsaved block ids. On submit emits `CreateScheduleVersionRequest` via state `create()`.

`AssistedMarkFormComponent`: injects `CaregiverAttendanceState`/`AdminCaregiverAttendanceState` (caregivers) and `CaregiverScheduleState` (blocks for the caregiver's hall). Emits `AssistedMarkRequest` via `CaregiverMarkState.assisted()`. Block list is derived from the active schedule version's blocks for the selected caregiver's hall.

`SelfServiceCaregiverAttendanceComponent`: injects `CaregiverMarkState`. Form fields: `documentType` (default `DNI`), `documentNumber`. Submit calls `selfService()`. Surfaces `MarkResponse` success or error in Spanish.

State shells follow the `ChildrenState`/`CommitteeState` pattern: `signal<T>(...)`, `isLoading`, `error`, `tap`-based load methods, `clear()`.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Sections | Tab switch renders the right child | Set `activeSection` signal; assert only the matching component is present. |
| Schedule list | Self-load by hall + empty state | Mock `CaregiverScheduleState.loadByHall`; assert `listSchedulesByHall` called and Spanish empty row when no versions. |
| Schedule form | Builder save + block id refs + string dates/times | Render form, add block/day-rule/special-day, submit; assert emitted `CreateScheduleVersionRequest` has string date/time and `blockIds` referencing existing block ids; no `Date` objects. |
| Copy modal | Submit emits `CopyScheduleVersionRequest` | Open copy, fill target hall/date/name; assert `copySchedule` called then modal closes. |
| Self-service | Public submit + Spanish rejection + no auth | Submit document number; assert `selfServiceMark` called; assert error path shows Spanish message; assert no auth guard used. |
| Assisted mark | Submit emits `AssistedMarkRequest` + no marks list | Select caregiver/date/block/reason; assert `assistedMark` called with strings; assert no marks table and no correction action. |
| State shells | Delegate to service without contract expansion | Assert state methods call existing service seams and no new method is added. |
| Deferred scope | Absence of correction/exceptions/reports/transfer | Assert these actions are absent from all new surfaces. |
| Existing | Service/state/DTO contracts | Keep existing specs passing unchanged. |

## Migration / Rollback

No migration. Rollback removes the new section/form/state components and restores the `caregiver-management`-only wrappers plus the self-service placeholder.

## Open Questions

- [ ] Block id generation strategy confirmed: client-side `crypto.randomUUID()` for unsaved blocks, sent as `id?`; backend reassigns. Verify backend tolerates client-sent ids (DTO has `id?` optional) — if backend ignores/overwrites, the approach is safe; if it persists client ids, still acceptable since they are unique.
- [ ] Hall selection source for schedule list: confirm whether `caregiver-management` already binds a selected hall or if we reuse `CommitteeState`/`AdminCommunityHallState`. Resolve in tasks phase by reading the existing wrappers.
