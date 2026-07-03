# Caregiver Assignment History Specification

## Purpose

Defines the read-only assignment history surface for the caregiver-attendance feature. Allows authenticated admin and AT/user roles to inspect every hall assignment (active and historical) for a selected caregiver, with the hall name resolved from the community-halls state. No mutation flows originate here; transfer, retire, and edit actions stay in their own surfaces.

## Requirements

### Requirement: Assignment History View

The system MUST provide a `Historial` section as a tab inside the caregiver-attendance feature. The section MUST include a Spanish caregiver selector populated with the active caregivers from the caregiver list, a history table with columns `Local comunal`, `Desde`, `Hasta`, and `Estado`, and MUST NOT expose transfer, edit, or retire actions in this surface. When a caregiver is selected, the system MUST load the history through `GET /api/v1/caregiver-attendance/caregivers/:id/assignments` and MUST resolve each row's `communityHallId` to a hall name using the community-halls state active for the current role: `AdminCommunityHallState` for admin layouts and `CommunityHallState` for AT/user layouts. When a `communityHallId` is not present in the loaded state map, the system MUST render the `communityHallId` as a fallback string. Date columns MUST display the date component only (`yyyy-MM-dd` or local equivalent) and MUST NOT perform client-side `Date` conversion on DTO strings. The `Estado` column MUST display a green `Activa` badge when `validTo` is `null` and a gray `Histórica` badge when `validTo` is set. The system MUST show a Spanish empty state when the history list is empty.

#### Scenario: Caregiver with active assignment shows green badge

- GIVEN the user selects a caregiver that has one assignment with `validTo: null`
- WHEN the history table renders
- THEN the row displays the resolved hall name, the `Desde` and `Hasta` dates as date-only strings, and a green `Activa` badge in `Estado`

#### Scenario: Historical assignment shows gray badge

- GIVEN the selected caregiver has one or more assignments with a non-null `validTo`
- WHEN the history table renders
- THEN each such row displays a gray `Histórica` badge in `Estado`

#### Scenario: Mixed active and historical rows render together

- GIVEN the selected caregiver has both an active assignment and one or more historical assignments
- WHEN the history table renders
- THEN each row's badge reflects its own `validTo` state (green `Activa` for the active row, gray `Histórica` for the historical ones)

#### Scenario: Caregiver with no assignments shows Spanish empty state

- GIVEN the selected caregiver has no assignments
- WHEN the history endpoint returns an empty list
- THEN the table displays a Spanish empty state
- AND no error is surfaced to the user

#### Scenario: Hall not found in state map falls back to id

- GIVEN a history row's `communityHallId` is not present in the loaded community-halls state map
- WHEN the row renders
- THEN the `Local comunal` cell displays the `communityHallId` string as a fallback
- AND the row does not throw or block rendering of the remaining rows

#### Scenario: Hall name is resolved from the active community-halls state

- GIVEN the user is authenticated as admin or AT/user with a loaded community-halls state
- WHEN the history table renders a row whose `communityHallId` matches a loaded hall
- THEN the `Local comunal` cell displays the resolved hall name
- AND the lookup uses `AdminCommunityHallState` for admin views and `CommunityHallState` for AT/user views

#### Scenario: Dates render without time component

- GIVEN a history row has `validFrom` and `validTo` DTO strings
- WHEN the `Desde` and `Hasta` cells render
- THEN the displayed value includes only the date component
- AND no client-side `Date` conversion is applied to the DTO strings
