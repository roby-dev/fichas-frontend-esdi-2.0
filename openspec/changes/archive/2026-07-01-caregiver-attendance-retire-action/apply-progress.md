# Apply Progress: Caregiver Attendance Retire Action Correction

**Change**: `caregiver-attendance-retire-action`  
**Mode**: Strict TDD  
**Artifact store**: OpenSpec + Engram progress mirror  
**Status**: Implementation complete; verification found no code blockers.

## Summary

Implemented the user's corrective business rule: caregiver registration no longer asks for `status` or `endDate`. Retirement is now a separate lifecycle action exposed as a Spanish `Retirar` button for active caregivers only. The action uses the existing `updateCaregiver` seam with `{ status: 'retired', endDate: yyyy-MM-dd }`, then reloads the selected state.

## Completed Tasks

- [x] 1.1 Update form tests to require no `status` or `endDate` controls.
- [x] 1.2 Update form tests to require emitted create/edit DTOs to exclude `status` and `endDate`.
- [x] 1.3 Update management tests to show `Retirar` only for active caregivers.
- [x] 1.4 Update management tests to require retirement update payload and reload behavior.
- [x] 1.5 Remove `status` and `endDate` controls and emissions from the form implementation.
- [x] 1.6 Add active-caregiver `Retirar` table action using the existing update seam.
- [x] 1.7 Update the main OpenSpec requirement to separate registration from retirement.
- [x] 1.8 Run targeted tests and build.

## TDD Cycle Evidence

| Task | Test File | Layer | RED | GREEN | Notes |
|------|-----------|-------|-----|-------|-------|
| 1.1-1.2 | `src/app/features/caregiver-attendance/pages/components/caregiver-mother-form/caregiver-mother-form.component.spec.ts` | Component/Form | Tests expected no `status`/`endDate` controls and DTOs excluding those fields before form correction. | Form emits only registration fields and keeps date strings. | Registration captures active caregiver data only. |
| 1.3-1.4 | `src/app/features/caregiver-attendance/pages/caregiver-attendance-placeholders.spec.ts` | Component/Integration | Tests expected `Retirar` active-only behavior and retirement update payload before action wiring. | Active caregivers show `Retirar`; retired caregivers do not; update payload and reload are asserted. | Retirement is a lifecycle command, not a form field. |
| 1.5-1.6 | Same specs above | Component/Integration | Existing implementation rendered/emitted lifecycle fields from the form and had no retire action. | Form was simplified; table action added with existing `updateCaregiver` seam. | No transfer/schedule/mark/exception/report UI added. |
| 1.7 | `openspec/specs/caregiver-attendance-frontend/spec.md` | Specification | Main spec allowed status/endDate in the management form. | Main spec now separates registration fields from retirement action. | Mirrors user clarification. |
| 1.8 | Targeted caregiver specs + build | Verification | N/A | Targeted caregiver tests pass; `pnpm build` passes. | Full suite still has pre-existing unrelated AppComponent title failure. |

## Verification Commands

| Command | Result |
|---------|--------|
| Targeted caregiver safety net specs | ✅ 10 passing before corrective production changes. |
| RED run for corrective tests | ✅ 5 expected failures before implementation. |
| Corrective caregiver specs | ✅ 13 passing after implementation. |
| Caregiver targeted suite | ✅ 23 passing. |
| `pnpm build` | ✅ Passed. |
| `pnpm test -- --watch=false --browsers=ChromeHeadless` | ⚠️ 30 passed / 1 failed due pre-existing unrelated `AppComponent should render title`. |

## Issues Found

- Full suite still has the known unrelated `src/app/app.component.spec.ts` title expectation failure.
- `pnpm 11` warns that `package.json` field `pnpm.onlyBuiltDependencies` is ignored; no settings migration was performed.

## Remaining Tasks

None for this correction.
