# Proposal: Caregiver Attendance Caregiver Management

## Intent

Replace the Part 1 caregiver-attendance placeholder with real caregiver mother management. Part 1's hero/slate/`rounded-2xl` screen is not the app's module design; Part 2 corrects this by matching `committees`/`community-halls`: gray/blue table, toolbar, modal, signals form, `@for`/`@empty`, and Spanish copy.

## Scope

### In Scope
- List/search caregiver mothers; self-load on route entry because layout does not preload this state.
- Create caregivers and edit basic data, `status`, `startDate`, `endDate` via existing service methods.
- Use the same admin and AT/user management pattern unless role requirements prove different; backend remains authority.
- Optional read-only assignment view only if low-cost and clearly non-transfer.

### Out of Scope
- Transfer/assignment editing, schedule editor, attendance marking, exceptions, justifications, monthly reports.
- Backend changes or auth redesign.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `caregiver-attendance-frontend`: replace placeholder caregiver management with real list/search/create/edit UI and behavior tests.

## Approach

Use the verified admin-catalog-table pattern. The page loads caregivers in `ngOnInit`, filters with signals, renders the table, opens `app-modal` for create/edit, and delegates persistence to `CaregiverAttendanceService` plus state reload. Keep date DTO fields as strings for date inputs; do not add client-side `Date` conversion. User/AT reuses the same pattern through the user state seam.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/features/caregiver-attendance/pages/components/admin-caregiver-attendance/*` | Modified | Toolbar, search, table, modal, save flow. |
| `src/app/features/caregiver-attendance/pages/components/user-caregiver-attendance/*` | Modified | Matching AT/user management surface or wrapper. |
| `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/*` | New | Signals form for caregiver create/edit. |
| `src/app/features/caregiver-attendance/states/*` | Modified | Use existing load seams; support route self-load. |
| `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` | Reused | Existing list/create/update/assignments boundary. |
| `openspec/specs/caregiver-attendance-frontend/spec.md` | Modified | Supersede placeholder requirements with management UI requirements. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Admin/AT role divergence | Med | Share UI now; split only with proven requirements. |
| Assignment view scope creep | Med | Read-only only, otherwise defer. |
| Date format drift | Low | Keep string DTOs and direct date input binding. |
| Future layout preload causes double fetch | Low | Document self-load; later guard reload if preloaded. |

## Rollback Plan

Revert caregiver-attendance component, form, spec, and test changes to restore the Part 1 placeholder shell. No backend, auth, route, or migration rollback is needed.

## Dependencies

- Existing `/api/v1/caregiver-attendance/caregivers` list/create/update endpoints.
- Existing shared components, Signals Forms, service, and state seams.

## Success Criteria

- [ ] Admin and AT/user can list, search, create, and edit caregivers with Spanish copy.
- [ ] UI matches table + toolbar + modal conventions, not the Part 1 hero placeholder.
- [ ] Component loads caregivers on route entry.
- [ ] Placeholder tests are replaced with behavior-focused management tests.
