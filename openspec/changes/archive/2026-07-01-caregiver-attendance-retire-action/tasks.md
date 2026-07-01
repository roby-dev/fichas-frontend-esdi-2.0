# Tasks: Caregiver Attendance Retire Action Correction

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 120-220 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single focused corrective PR |
| Delivery strategy | auto |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Strict TDD Correction

- [x] 1.1 Update form tests to require no `status` or `endDate` controls.
- [x] 1.2 Update form tests to require emitted create/edit DTOs to exclude `status` and `endDate`.
- [x] 1.3 Update management tests to show `Retirar` only for active caregivers.
- [x] 1.4 Update management tests to require retirement update payload and reload behavior.
- [x] 1.5 Remove `status` and `endDate` controls and emissions from the form implementation.
- [x] 1.6 Add active-caregiver `Retirar` table action using the existing update seam.
- [x] 1.7 Update the main OpenSpec requirement to separate registration from retirement.
- [x] 1.8 Run targeted tests and build.
