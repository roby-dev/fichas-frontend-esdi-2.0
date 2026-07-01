# Delta for Caregiver Attendance Frontend

## ADDED Requirements

### Requirement: Frontend Feature Shell

The system MUST provide a caregiver-attendance frontend shell with typed contracts, service seams, signal state shells, routes, menus, placeholder pages, and minimal tests. It MUST NOT implement full caregiver CRUD, assignments, schedules, attendance marking, exceptions, or reports in this change.

#### Scenario: Shell compiles without workflow behavior

- GIVEN the frontend application is built under strict TypeScript
- WHEN the caregiver-attendance shell is included
- THEN routes, placeholder pages, contracts, services, states, and tests compile
- AND full workflow UI behavior is absent from the shell

### Requirement: Authenticated Route and Menu Seams

The system MUST expose authenticated admin and user/AT caregiver-attendance route seams using lazy standalone pages and matching sidebar menu entries.

#### Scenario: Admin reaches placeholder from authenticated layout

- GIVEN an authenticated admin user uses the admin layout
- WHEN they navigate to the caregiver-attendance menu entry
- THEN a caregiver-attendance placeholder page is rendered inside the admin layout

#### Scenario: User or AT reaches placeholder from authenticated layout

- GIVEN an authenticated user or AT uses the user layout
- WHEN they navigate to the caregiver-attendance menu entry
- THEN a caregiver-attendance placeholder page is rendered inside the user layout

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

### Requirement: Minimal Behavior Tests

The change MUST include minimal Karma/Jasmine tests for route visibility, public self-service routing, DTO date string typing, thin service endpoints, signal state shells, and the AT role helper seam. Tests SHOULD verify observable behavior through public interfaces.

#### Scenario: Bootstrap tests protect the shell

- GIVEN the configured headless Karma test command runs
- WHEN the caregiver-attendance bootstrap tests execute
- THEN they pass for the shell behavior
- AND they do not assert full workflow UI behavior
