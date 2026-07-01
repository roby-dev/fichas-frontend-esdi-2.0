# Proposal: Caregiver Attendance Retire Action Correction

## Summary

Correct the caregiver management UI so caregiver registration only captures active caregiver data, while retirement is handled by a dedicated lifecycle action.

## Problem

The current create/edit form exposes `status` and `endDate`, but those fields are not part of registering a caregiver. They make the registration flow confusing and mix lifecycle retirement with data entry.

## Scope

- Remove `status` and `endDate` controls from the caregiver form.
- Keep create/edit form submissions limited to registration fields.
- Add `Retirar` for active caregivers in the table.
- Use the existing update seam to set `status: 'retired'` and local `endDate`.

## Out of Scope

Transfer, schedule, attendance, exceptions, reports, assignment UI, backend changes, and auth changes remain out of scope.

## Rollback

Revert the form/template, management component, tests, and spec edits in this change.
