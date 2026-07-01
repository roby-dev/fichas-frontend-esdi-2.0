# Delta for Caregiver Attendance Frontend

## MODIFIED Requirements

### Requirement: Caregiver List and Form Management

The system MUST provide a Spanish caregiver list with toolbar, search/filter, table, empty state, and create/edit modal form. The table MUST include document, full name, phone, start date, end date when present, and status. The form MUST support only registration fields: document type/number, names, phone, and `startDate`; `status` and `endDate` MUST NOT be registration inputs. Retirement MUST be a separate `Retirar` action for active caregivers that updates `status` to `retired` and sets `endDate` with a local `yyyy-MM-dd` string. Date controls MUST use `input type="date"` with string DTO values and no client-side `Date` conversion.

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
