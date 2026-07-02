# Delta for Caregiver Attendance Frontend

## MODIFIED Requirements

### Requirement: Frontend Feature Shell

The system MUST provide an authenticated caregiver-attendance feature surface with internal sections for caregiver management, schedule version management, and assisted marking, plus a public self-service mark route. It MUST follow existing module conventions: gray/blue table, toolbar, `app-modal`, Spanish copy, and compact catalog styling; it MUST NOT use the Part 1 hero/slate/`rounded-2xl` placeholder design. The public self-service route MUST render a real mark form, not a placeholder. Transfer editing, exceptions, justifications, reports, mark correction, backend changes, and auth redesign are out of scope. Assignment information is deferred.
(Previously: the shell rendered caregiver management only and explicitly deferred schedules, attendance marking, and self-service form behavior.)

#### Scenario: Authenticated surface exposes schedule and marking sections

- GIVEN an authenticated admin or AT/user opens caregiver attendance
- WHEN the page renders
- THEN it exposes internal sections for caregiver management, schedule versions, and assisted marking
- AND the public self-service route renders a real mark form instead of placeholder copy

#### Scenario: Deferred workflow scope stays absent

- GIVEN the authenticated or public surface is rendered
- WHEN the user reviews available actions
- THEN transfer, exception, justification, report, and mark-correction actions are absent

## ADDED Requirements

### Requirement: Schedule Version List and Load

The system MUST provide a Spanish schedule version list per Community Hall for authenticated admin and AT/user roles, loaded through the existing `listSchedulesByHall` service seam. The list MUST self-load schedule versions for the selected hall on section entry and MUST display version name, `validFrom`, and `validTo` when present. The UI MUST delegate scope and authorization to the backend and MUST NOT invent client-side scope restrictions.
(Previously: no schedule list or schedule state existed.)

#### Scenario: Section entry loads schedule versions for the hall

- GIVEN an authenticated admin or AT/user opens the schedule versions section with a selected Community Hall
- WHEN the section renders
- THEN schedule versions are requested through the `listSchedulesByHall` seam for that hall
- AND loading, data, and error signals reflect the result

#### Scenario: Empty hall shows Spanish empty state

- GIVEN the selected hall has no schedule versions
- WHEN the list renders
- THEN a Spanish empty row is shown

### Requirement: Schedule Version Builder Form

The system MUST provide a Spanish schedule version builder modal form using the existing `createSchedule` service seam. The form MUST capture `communityHallId`, `name`, `validFrom`, optional `validTo`, a repeatable blocks list, seven fixed day-of-week rules, and an optional repeatable special-days list. Each block MUST capture `name`, `entryTime`, optional `exitTime`, `exitRequired`, `toleranceMinutes`, and `markingWindowMinutes`. Day rules and special days MUST reference block ids. Date controls MUST use `input type="date"` and time controls MUST use `input type="time"`, both bound to string DTO values with no client-side `Date` conversion. The emitted create request MUST match the `CreateScheduleVersionRequest` contract.
(Previously: no schedule form existed.)

#### Scenario: Valid schedule version is created

- GIVEN the user opens the schedule builder with a selected hall
- WHEN they submit a valid version with blocks, day rules, and string date/time values
- THEN the `createSchedule` seam is called with a `CreateScheduleVersionRequest`
- AND the emitted request contains no client-side `Date` objects
- AND the list reloads after a successful save

#### Scenario: Block ids are referenced by day rules and special days

- GIVEN the builder has one or more blocks
- WHEN day rules and special days select blocks
- THEN the selected `blockIds` reference block ids that exist in the blocks list

### Requirement: Schedule Copy to Hall

The system MUST provide a Spanish copy-to-hall action on each schedule version row using the existing `copySchedule` service seam. The action MUST open a modal capturing `targetHallId`, `validFrom`, and `name`, and MUST emit a `CopyScheduleVersionRequest`. After a successful copy, the target hall's schedule list MUST be reloadable.
(Previously: no copy action existed.)

#### Scenario: Copy opens modal and submits request

- GIVEN a schedule version row is shown
- WHEN the user clicks `Copiar`
- THEN a modal opens capturing target hall, effective date, and name
- AND on submit the `copySchedule` seam is called with a `CopyScheduleVersionRequest`
- AND the modal closes after a successful copy

### Requirement: Public Self-Service Mark Form

The system MUST provide a public self-service attendance mark form on the unauthenticated self-service route, replacing the placeholder. The form MUST capture optional `documentType` (defaulting to DNI) and `documentNumber`, and MUST submit through the existing `selfServiceMark` service seam. The route MUST NOT require auth guards, committee guards, or authenticated layout chrome. The UI MUST surface Spanish success and rejection feedback from the `MarkResponse` or service error and MUST NOT invent client-side window/scope rules that contradict backend enforcement.
(Previously: the self-service route rendered a placeholder card.)

#### Scenario: Anonymous user submits a self-service mark

- GIVEN no access token is stored
- WHEN the user enters a document number and submits
- THEN the `selfServiceMark` seam is called with a `SelfServiceMarkRequest`
- AND no auth guard or authenticated layout is used

#### Scenario: Rejected attempt shows Spanish feedback

- GIVEN the backend rejects a self-service attempt
- WHEN the response returns an error
- THEN a Spanish rejection message is shown
- AND no client-side rule claims authority over backend window enforcement

### Requirement: Authenticated Assisted Mark Form

The system MUST provide a Spanish assisted attendance mark form for authenticated admin and AT/user roles using the existing `assistedMark` service seam. The form MUST capture `caregiverId` (selected from loaded caregivers), `localDate` (`input type="date"`), `blockId` (selected from the caregiver's hall schedule blocks), optional `entryTime` (`input type="time"`), and `reason`. The emitted request MUST match the `AssistedMarkRequest` contract with string date/time values and no client-side `Date` conversion. The UI MUST NOT present a marks list because no list endpoint exists; it is a create form only. Mark correction is out of scope.
(Previously: no assisted mark form existed.)

#### Scenario: AT submits an assisted mark

- GIVEN an authenticated AT/user or admin opens the assisted marking section
- WHEN they select a caregiver, date, block, and reason and submit
- THEN the `assistedMark` seam is called with an `AssistedMarkRequest`
- AND the emitted request contains string date/time values only

#### Scenario: No marks list is presented

- GIVEN the assisted marking section is rendered
- WHEN the user reviews the surface
- THEN no marks table or marks list is presented
- AND no mark-correction action is available

### Requirement: Schedule and Mark State Shells

The system MUST provide separate signal state shells for schedules and marks following the Service+Signals convention, with loading, error, data, and clear behavior. Schedule state MUST expose list-by-hall, create, and copy seams delegating to `CaregiverAttendanceService`. Mark state MUST expose self-service and assisted submit seams delegating to `CaregiverAttendanceService`. State shells MUST NOT expand the service contract or implement workflow orchestration beyond these seams.
(Previously: only caregiver list state existed.)

#### Scenario: State shell delegates to service without contract expansion

- GIVEN a component calls a schedule or mark state method
- WHEN the operation runs
- THEN the state delegates to the existing `CaregiverAttendanceService` seam
- AND no new service method is added

### Requirement: Behavior Tests for Schedules and Marking

The change MUST add behavior-focused Karma/Jasmine tests for schedule list self-load, builder save flow, copy-to-hall, self-service submit, assisted submit, string date/time binding, backend-authoritative scope, and absence of deferred workflows (correction, exceptions, reports, transfer). Tests SHOULD verify observable behavior through public interfaces and MUST NOT assert implementation internals.
(Previously: tests covered caregiver management only.)

#### Scenario: Behavior tests protect schedules and marking

- GIVEN the configured headless Karma test command runs
- WHEN caregiver-attendance schedule and mark tests execute
- THEN they pass against list/builder/copy/self-service/assisted behavior
- AND they do not assert deferred workflows or implementation internals
