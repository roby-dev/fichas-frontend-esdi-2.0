# Delta for Caregiver Attendance Frontend

## MODIFIED Requirements

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

### Requirement: Caregiver List and Form Management

The system MUST provide a Spanish caregiver list with toolbar, search/filter, table, empty state, and create/edit modal form. The table MUST include document, full name, phone, start date, end date when present, and status. The form MUST support document type/number, names, phone, `status`, `startDate`, and `endDate`; date controls MUST use `input type="date"` with string DTO values and no client-side `Date` conversion.
(Previously: no real caregiver list, filter, or form existed in the placeholder shell.)

#### Scenario: Search filters caregivers

- GIVEN caregivers are loaded
- WHEN the user types a name or document value in search
- THEN the table shows only matching caregivers
- AND an empty Spanish row appears when no caregivers match

#### Scenario: Create or edit caregiver through modal

- GIVEN the user opens create or edit
- WHEN they submit valid caregiver data including date strings
- THEN the service create or update seam is called
- AND the list reloads after a successful save

### Requirement: Minimal Behavior Tests

The change MUST replace placeholder rendering tests with behavior-focused Karma/Jasmine tests for route self-load, shared admin and AT/user management behavior, table/search/empty rendering, create/edit modal save flow, date-string form binding, backend-authoritative scope, and absence of deferred workflows. Tests SHOULD verify observable behavior through public interfaces.
(Previously: bootstrap tests protected placeholder route visibility and shell behavior only.)

#### Scenario: Behavior tests protect management UI

- GIVEN the configured headless Karma test command runs
- WHEN caregiver-attendance tests execute
- THEN they pass against list/search/create/edit behavior
- AND they do not assert implementation internals or deferred workflows
