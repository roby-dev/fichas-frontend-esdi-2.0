# Design: Caregiver Attendance Caregiver Management

## Technical Approach

Replace the Part 1 hero/slate placeholder with the app's catalog-table management pattern: `p-0 sm:p-4`, `text-lg font-semibold`, gray/blue table, `app-modal`, Signals Forms, and Spanish UI copy. Keep the existing route wrapper and admin/user state seams, but move shared list/search/create/edit behavior into one reusable management component so admin and AT/user do not drift. The backend remains authoritative for scope and authorization; assignment information is deferred.

## Architecture Decisions

| Option | Tradeoff | Decision |
|---|---|---|
| Duplicate admin/user table markup | Matches current wrappers, but doubles search/table/modal/save maintenance. | Create one `caregiver-management` component; keep admin/user wrappers as thin role-state adapters. |
| Preload caregivers in layouts | Consistent with other catalogs, but adds cost to every layout load. | Self-load on route entry in the management component. |
| Client role/scope filtering | Feels safer in UI, but risks inventing policy. | Call the existing backend-scoped service/state seams only. |
| Parse dates with `Date` | Convenient formatting, but violates DTO string invariant. | Bind `input type="date"` to strings; at most use string slicing for ISO input values. |
| Assignment panel now | Could show context, but invites transfer workflow scope creep. | Defer assignment display/editing entirely in this change. |

## Data Flow

```text
Route wrapper -> admin/user wrapper -> caregiver-management(mode)
  -> selected state.loadCaregivers() -> CaregiverAttendanceService.listCaregivers()
  -> backend scoped response -> computed filteredCaregivers -> table/modal
  -> create/update service call -> selected state.loadCaregivers() -> close modal
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/app/features/caregiver-attendance/pages/components/caregiver-management/caregiver-management.component.{ts,html}` | Create | Shared self-loading table/search/modal/save component for admin and AT/user. |
| `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.{ts,html}` | Create | Signals form for caregiver create/edit using `app-input`, `app-button`, and native styled selects. |
| `src/app/features/caregiver-attendance/pages/components/admin-caregiver-attendance/*` | Modify | Replace placeholder with thin wrapper: `<app-caregiver-management mode="admin" />`. |
| `src/app/features/caregiver-attendance/pages/components/user-caregiver-attendance/*` | Modify | Replace placeholder with thin wrapper: `<app-caregiver-management mode="user" />`. |
| `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Replace | Convert placeholder assertions into management behavior tests. |
| `src/app/features/caregiver-attendance/states/*.ts` | Reuse | Keep `data`, `isLoading`, `error`, `loadCaregivers()`, `clear()` unchanged unless tests expose a naming need. |
| `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` | Reuse | Existing `listCaregivers`, `createCaregiver`, and `updateCaregiver` are sufficient. |

## Interfaces / Contracts

`CaregiverManagementComponent` exposes one public input: `mode: 'admin' | 'user'`. Internally it selects `AdminCaregiverAttendanceState` or `CaregiverAttendanceState`, injects `CaregiverAttendanceService`, and owns `searchTerm`, `isModalOpen`, `selectedCaregiver`, `isSaving`, and `filteredCaregivers` signals. Search matches `documentNumber`, `firstName`, `lastName`, and `fullName` case-insensitively.

`CaregiverMotherFormComponent` input/output contract: `caregiver: CaregiverMotherResponse | null`, `isLoading: boolean`, `saveCaregiverEvent: CreateCaregiverMotherRequest | UpdateCaregiverMotherRequest`. Required fields: `documentNumber`, `firstName`, `lastName`, `startDate`. Optional fields: `documentType`, `phone`, `endDate`, `status`. UI labels/errors remain Spanish.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Component | Route self-load and backend-authoritative scope | Mock admin/user states and assert only `loadCaregivers()`/service seams are called; no client scope filtering. |
| Component | Table/search/empty/deferred actions | Render caregivers, type search, assert Spanish empty row and absence of transfer/schedule/mark/report/assignment actions. |
| Component | Create/edit modal save flow | Open modal, submit valid data, assert create/update then reload and close. |
| Form | Date-string binding | Set `type="date"` controls with strings; assert emitted DTO keeps strings and no `Date` objects. |
| Existing | Service/state/DTO contracts | Keep existing specs passing. |

## Migration / Rollout

No migration required. Rollback restores the Part 1 placeholder components/spec and removes the new shared management/form components.

## Open Questions

- [ ] None.
