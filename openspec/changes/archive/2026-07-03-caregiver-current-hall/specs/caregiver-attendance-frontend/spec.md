# Delta for Caregiver Attendance Frontend

## MODIFIED Requirements

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
