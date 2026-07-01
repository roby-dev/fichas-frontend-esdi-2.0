# Delta for Caregiver Attendance Frontend

## ADDED Requirements

### Requirement: Frontend Feature Shell

The system MUST replace the Part 1 caregiver-attendance placeholder shell with real caregiver mother management for list, search, create, and edit. It MUST follow existing module conventions: gray/blue table, toolbar, `app-modal`, Spanish copy, and compact catalog styling; it MUST NOT use the Part 1 hero/slate/`rounded-2xl` placeholder design. Transfer editing, schedules, attendance marking, exceptions, justifications, reports, backend changes, and auth redesign are out of scope. Assignment information is deferred.
(Previously: the shell compiled placeholder pages and explicitly omitted full workflow UI behavior.)

#### Scenario: Management surface replaces placeholder

- GIVEN an authenticated admin or AT/user opens caregiver attendance
- WHEN the page renders
- THEN it shows the caregiver management UI instead of placeholder copy
- AND no hero/slate/`rounded-2xl` placeholder section is present

#### Scenario: Deferred workflow scope stays absent

- GIVEN the management UI is rendered
- WHEN the user reviews available actions
- THEN transfer, schedule, attendance mark, exception, justification, report, and assignment-edit actions are absent

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

#### Scenario: Anonymous user opens self-service placeholder

- GIVEN no access token is stored
- WHEN the browser navigates to the self-service caregiver-attendance route
- THEN the self-service placeholder page is rendered
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

The system MUST provide a Spanish caregiver list with toolbar, search/filter, table, empty state, and create/edit modal form. The table MUST include document, full name, phone, start date, end date when present, and status. The form MUST support only registration fields: document type/number, names, phone, and `startDate`; `status` and `endDate` MUST NOT be registration inputs. Retirement MUST be a separate `Retirar` action for active caregivers that updates `status` to `retired` and sets `endDate` with a local `yyyy-MM-dd` string. Date controls MUST use `input type="date"` with string DTO values and no client-side `Date` conversion.
(Previously: no real caregiver list, filter, or form existed in the placeholder shell.)

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

### Requirement: Minimal Behavior Tests

The change MUST replace placeholder rendering tests with behavior-focused Karma/Jasmine tests for route self-load, shared admin and AT/user management behavior, table/search/empty rendering, create/edit modal save flow, date-string form binding, backend-authoritative scope, and absence of deferred workflows. Tests SHOULD verify observable behavior through public interfaces.
(Previously: bootstrap tests protected placeholder route visibility and shell behavior only.)

#### Scenario: Behavior tests protect management UI

- GIVEN the configured headless Karma test command runs
- WHEN caregiver-attendance tests execute
- THEN they pass against list/search/create/edit behavior
- AND they do not assert implementation internals or deferred workflows
