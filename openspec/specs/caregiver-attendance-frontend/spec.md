# Delta for Caregiver Attendance Frontend

## ADDED Requirements

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

### Requirement: Authenticated Route and Menu Seams

The system MUST expose authenticated admin and user/AT caregiver-attendance route seams using lazy standalone pages and matching sidebar menu entries. The route MUST self-load caregiver data on entry because layouts do not preload caregiver attendance state, and admin and AT/user behavior SHOULD share the same management pattern while the backend remains authoritative for role scope and authorization.
(Previously: authenticated routes rendered placeholder pages inside the admin and user layouts.)

#### Scenario: Admin reaches management from authenticated layout

- GIVEN an authenticated admin uses the admin layout
- WHEN they navigate to the caregiver-attendance menu entry
- THEN caregiver data is requested for the route
- AND the admin management table is rendered inside the admin layout

#### Scenario: User or AT reaches scoped management from authenticated layout

- GIVEN an authenticated user or AT uses the user layout
- WHEN they navigate to the caregiver-attendance menu entry
- THEN caregiver data is requested through the user/AT seam
- AND the UI does not invent client-side scope beyond backend responses

### Requirement: Public Self-Service Route

The system MUST expose caregiver attendance self-service as a public route outside authenticated admin and user layouts. The route MUST NOT require auth guards, committee guards, or authenticated layout chrome.

#### Scenario: Anonymous user opens self-service mark form

- GIVEN no access token is stored
- WHEN the browser navigates to the self-service caregiver-attendance route
- THEN the self-service mark form is rendered
- AND no admin or user authenticated layout is used

### Requirement: JSON-Safe DTO Contracts

Frontend DTO interfaces MUST represent backend date and timestamp fields as JSON-safe strings. Interfaces MUST NOT type HTTP date fields as native `Date` values.

#### Scenario: Date fields stay serializable

- GIVEN caregiver attendance DTO interfaces are consumed by service methods
- WHEN a response includes birth dates, attendance dates, schedule dates, or timestamps
- THEN those fields are typed as `string`
- AND the service returns the DTO without client-side `Date` conversion

### Requirement: Thin Backend Service Methods

The caregiver attendance service MUST provide thin HTTP methods for the backend `/api/v1/caregiver-attendance` contract, including the public self-service mark endpoint and authenticated admin/AT endpoint seams. Service methods MUST delegate authorization and scope enforcement to the backend.

#### Scenario: Service delegates scope and authorization

- GIVEN a component or state calls a caregiver-attendance service method
- WHEN the HTTP request is sent
- THEN the request targets the caregiver-attendance API contract
- AND no client-side rule claims authority over backend scope restrictions

### Requirement: Signal State Shells

The system MUST provide separate admin and user/AT signal state shells with loading, error, data, and clear behavior. State shells SHOULD expose minimal load seams only and MUST avoid full workflow orchestration.

#### Scenario: State shell handles minimal load result

- GIVEN a state shell starts a load operation
- WHEN the service returns data or an error
- THEN loading, data, and error signals reflect the result
- AND workflow-specific transitions are not implemented

### Requirement: AT Role Helper Seam

The authentication service MUST provide a minimal role helper seam that can identify `AT` from decoded JWT roles without redesigning authentication or changing backend authorization.

#### Scenario: AT helper reads existing roles payload

- GIVEN the decoded token contains roles including `AT`
- WHEN the role helper is evaluated
- THEN it returns true for AT access checks
- AND no new token payload shape is required

### Requirement: Caregiver List and Form Management

The system MUST provide a Spanish caregiver list with toolbar, search/filter, table, empty state, and create/edit modal form. The table MUST include document, full name, **"Local comunal" (current hall name from the DTO `currentHallName` field, with `-` fallback when null)**, phone, start date, end date when present, and status. The empty-state row MUST use `colspan` matching the new total column count. The form MUST support only registration fields: document type/number, names, phone, and `startDate`; `status` and `endDate` MUST NOT be registration inputs. Retirement MUST be a separate `Retirar` action for active caregivers that updates `status` to `retired` and sets `endDate` with a local `yyyy-MM-dd` string. Date controls MUST use `input type="date"` with string DTO values and no client-side `Date` conversion. The `CaregiverMotherResponse` interface MUST add `currentHallId: string | null` and `currentHallName: string | null` nullable fields.
(Previously: the table did not expose the caregiver's current Community Hall; the management interface had no `currentHallId` / `currentHallName` fields and no Local comunal column.)

#### Scenario: Search filters caregivers

- GIVEN caregivers are loaded
- WHEN the user types a name or document value in search
- THEN the table shows only matching caregivers
- AND an empty Spanish row appears when no caregivers match

#### Scenario: Create or edit caregiver through modal

- GIVEN the user opens create or edit
- WHEN they submit valid caregiver registration data including the start date string
- THEN the service create or update seam is called
- AND the emitted save DTO does not include registration-unrelated `status` or `endDate` user input
- AND the list reloads after a successful save

#### Scenario: Retire active caregiver through lifecycle action

- GIVEN an active caregiver appears in the management table
- WHEN the user clicks `Retirar`
- THEN the update seam is called with `status: 'retired'` and `endDate` as today's local `yyyy-MM-dd` string
- AND the list reloads after a successful retirement

#### Scenario: Retired caregiver does not expose active retirement action

- GIVEN a retired caregiver appears in the management table
- WHEN the user reviews available row actions
- THEN no active `Retirar` action is shown for that caregiver

#### Scenario: Local comunal column shows hall name

- GIVEN a caregiver row has `currentHallName` set to a non-null value
- WHEN the management table renders that row
- THEN the "Local comunal" cell SHALL display the hall name
- AND no client-side `Date` conversion or transformation SHALL be applied to DTO fields

#### Scenario: Caregiver without hall shows fallback dash

- GIVEN a caregiver row has `currentHallName` set to `null` (no active assignment)
- WHEN the management table renders that row
- THEN the "Local comunal" cell SHALL display `-`
- AND the row SHALL render without an error

#### Scenario: Empty state colspan matches total columns

- GIVEN the caregivers list returns no results
- WHEN the empty state row renders
- THEN its `colspan` attribute SHALL equal the total number of `<th>` headers in the table
- AND the empty row SHALL be visually aligned with all columns including "Local comunal"

### Requirement: Minimal Behavior Tests

The change MUST replace placeholder rendering tests with behavior-focused Karma/Jasmine tests for route self-load, shared admin and AT/user management behavior, table/search/empty rendering, create/edit modal save flow, date-string form binding, backend-authoritative scope, and absence of deferred workflows. Tests SHOULD verify observable behavior through public interfaces.
(Previously: bootstrap tests protected placeholder route visibility and shell behavior only.)

#### Scenario: Behavior tests protect management UI

- GIVEN the configured headless Karma test command runs
- WHEN caregiver-attendance tests execute
- THEN they pass against list/search/create/edit behavior
- AND they do not assert implementation internals or deferred workflows

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
