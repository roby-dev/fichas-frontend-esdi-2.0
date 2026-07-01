# Design: Caregiver Attendance Retire Action Correction

## Technical Approach

Keep the existing shared `caregiver-management` component and `caregiver-mother-form` component. The form emits only registration fields. Retirement stays in the table as a row action and calls `CaregiverAttendanceService.updateCaregiver(id, { status: 'retired', endDate: todayString })`, then reloads the selected state.

## Decisions

| Decision | Rationale |
|---|---|
| Remove retirement fields from the form instead of hiding them conditionally | Registration and retirement are separate business commands. |
| Reuse `updateCaregiver` | Existing backend seam already accepts status/end date updates. |
| Derive local `yyyy-MM-dd` manually | Avoid native `Date` conversion in DTO payloads while still deriving today's local date. |
| Show `Retirar` only for active caregivers | Prevent duplicate retirement actions for already retired caregivers. |

## Testing

Strict TDD component tests cover missing controls, emitted DTO shape, active/retired row actions, and retirement update/reload behavior.
