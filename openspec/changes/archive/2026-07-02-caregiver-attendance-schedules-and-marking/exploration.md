## Exploration: caregiver-attendance-schedules-and-marking

### Current State
The caregiver-attendance frontend already has the backend HTTP seams and DTO contracts for schedules and marks in place: `CaregiverAttendanceService` exposes `createSchedule`, `getSchedule`, `listSchedulesByHall`, `copySchedule`, `selfServiceMark`, `assistedMark`, and `correctMark`, and the related interfaces keep date/time fields as strings. The authenticated route seam is a single `caregiver-attendance` page that switches between admin and user/AT wrappers, and those wrappers currently render only the caregiver management table/form. The public self-service route exists but is still a placeholder card with no form. Existing signal states only cover caregiver list loading; there are no schedule list/detail states, no mark form states, and no schedule or marking UI components yet.

Intent for this slice: deliver schedule version management plus attendance marking UI that depends on those schedules. Deferred items remain transfer/assignment, exceptions/justifications, reports, and any auth redesign. Correction is constrained by the missing list-marks backend seam and should be treated carefully.

### Affected Areas
- `src/app/features/caregiver-attendance/services/caregiver-attendance.service.ts` — confirms the required schedule and marking HTTP seams already exist and should stay unchanged.
- `src/app/features/caregiver-attendance/interfaces/caregiver-schedule.interface.ts` — defines schedule version DTOs the new schedule state/form must use.
- `src/app/features/caregiver-attendance/interfaces/caregiver-attendance-mark.interface.ts` — defines self-service, assisted, correction, and response DTOs for marking flows.
- `src/app/features/caregiver-attendance/states/caregiver-attendance.state.ts` — current user/AT state only loads caregivers; schedule/mark state shells do not exist.
- `src/app/features/caregiver-attendance/states/admin-caregiver-attendance.state.ts` — current admin state only loads caregivers; schedule/mark state shells do not exist.
- `src/app/features/caregiver-attendance/pages/caregiver-attendance/caregiver-attendance.component.html` — current authenticated seam is the right place to branch into new schedule/mark surfaces without moving the feature outside caregiver-attendance.
- `src/app/routes/admin.routes.ts` — admin caregiver-attendance is a single lazy route today; adding child sections under this feature fits the current seam.
- `src/app/routes/user.routes.ts` — user/AT caregiver-attendance is also a single lazy route and already protected by existing committee/auth guards.
- `src/app/routes/layout.routes.ts` — public self-service mark stays as the unauthenticated seam.
- `src/app/features/caregiver-attendance/pages/self-service-caregiver-attendance/self-service-caregiver-attendance.component.html` — placeholder to replace with the real public self-service mark form.
- `src/app/features/caregiver-attendance/pages/components/caregiver-management/caregiver-management.component.ts` — canonical feature-local reference for table + toolbar + modal behavior in this module.
- `src/app/features/community-halls/pages/components/admin-community-halls/admin-community-halls.component.html` — reference for the gray/blue catalog table + toolbar + `app-modal` pattern.
- `src/app/features/committees/pages/components/admin-committees/admin-committees.component.html` — another reference for compact admin table/modal interactions.

### Approaches
1. **Extend caregiver-attendance with child sections** — keep caregiver management as one section and add schedule management plus assisted marking as sibling sections inside the caregiver-attendance feature.
   - Pros: Matches the existing route/menu seam; keeps schedules and marking close to their domain; avoids overloading caregiver management with unrelated responsibilities; leaves transfer/assignment deferred cleanly.
   - Cons: Requires local navigation/tabs or feature-internal child routing; schedule builder + assisted mark form together may threaten the 800-line review budget if implemented in one PR.
   - Effort: Medium

2. **Embed schedules/marking inside caregiver-management** — add new actions and forms directly into the current caregiver list surface.
   - Pros: Reuses the existing component entry point; fewer top-level files at first.
   - Cons: Conflates caregiver CRUD with hall schedule/version workflows; weak fit for copy-to-hall and version listing; likely creates a large component with mixed concerns and poor reviewability.
   - Effort: High

### Recommendation
Use **Approach 1**. Keep the existing `caregiver-attendance` route as the feature entry and add internal sections/child views for: (a) caregiver management, (b) schedule versions, and (c) assisted marking. That aligns with the current authenticated routing seams better than moving schedule UI into `caregiver-management`, and it keeps future deferred slices (exceptions, reports, transfers) composable.

For the schedule form, prefer a **single builder form with repeatable rows**, not tabs: a top-level version header, a repeatable blocks list, seven fixed day-of-week rows, and a repeatable special-days list. That mirrors the project’s modal/table management style better than a complex tabbed workflow, but it should likely be split into focused components because the full builder plus list/copy flow has real 800-line budget risk.

Copy-to-hall should live as a **row action on the schedule version list**. Marking should be split by seam: the public self-service page becomes the real self-mark form, while authenticated AT/admin gets an **assisted mark create form**, not a marks table, because there is no hall/date marks listing endpoint.

Correction should **not be treated as a first-class UI workflow in this slice** unless product accepts a manual mark-id entry flow. The backend requires a mark id and the frontend cannot discover marks by hall/date today. The safer recommendation is to defer correction to a later slice that includes a retrieval seam, or at most expose a narrowly scoped manual correction form for pasted mark IDs if the business explicitly insists.

### Risks
- The schedule builder is the highest-complexity part: blocks + seven day rules + special days can easily sprawl unless broken into small standalone components.
- There is no authenticated “list marks for a hall/date” endpoint, so assisted marking can only be a create form and correction has no discoverable target record.
- Combining schedule management and marking in one implementation pass has medium/high risk of exceeding the 800-line review budget.
- Zoneless change detection raises the usual discipline requirement: derived UI should stay signal-driven and avoid ad hoc mutable form/list state that assumes zone-based refreshes.

### Ready for Proposal
Yes — with one explicit product note: proposal/design should treat correction as deferred by default unless the team accepts a manual mark-id entry UX despite the missing list endpoint.
