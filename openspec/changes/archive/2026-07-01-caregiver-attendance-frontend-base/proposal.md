# Proposal: Caregiver Attendance Frontend Base

## Intent

Establish the Angular foundation for caregiver attendance without delivering full workflows. This gives later slices stable routes, contracts, service seams, state shells, and placeholders aligned with the completed backend capability.

## Scope

### In Scope
- Create `src/app/features/caregiver-attendance/` with interfaces, thin service, signal states, and shell pages.
- Add admin, user/AT, and public self-service route seams plus menu/sidebar integration points.
- Type backend DTO contracts with JSON-safe string dates and add minimal TDD bootstrap specs.

### Out of Scope
- Full caregiver, assignment/transfer, attendance marking, schedule, exception, and monthly report UIs.
- Backend changes or client-side authority over backend scope rules.
- Full authorization redesign beyond a minimal role helper seam for `AT`.

## Capabilities

### New Capabilities
- `caregiver-attendance-frontend`: Angular frontend shell for caregiver attendance routes, contracts, service methods, states, and placeholder pages.

### Modified Capabilities
- None.

## Approach

Mirror the existing `community-halls` pattern: one feature folder with `interfaces/`, `services/`, `states/`, and `pages/`; one `CaregiverAttendanceService` matching `/api/v1/caregiver-attendance`; split `AdminCaregiverAttendanceState` and `CaregiverAttendanceState`; add route/menu seams for authenticated admin and user/AT flows. Keep self-service as a separate public page outside authenticated layouts. Add a small `AuthService` role helper (`hasRole` or `isTechnicalCompanion`) without changing backend-driven authorization.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/features/caregiver-attendance/` | New | Contracts, HTTP service, signal states, shell pages, specs. |
| `src/app/routes/admin.routes.ts` | Modified | Admin lazy route seam. |
| `src/app/routes/user.routes.ts` | Modified | User/AT lazy route seam. |
| `src/app/routes/layout.routes.ts` | Modified | Public self-service route seam, if needed. |
| `src/app/layouts/*-layout/...component.ts` | Modified | Sidebar menu entries. |
| `src/app/core/services/auth.service.ts` | Modified | Minimal role helper for `AT`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Frontend only knows `admin`/`user`; backend adds `AT`. | High | Add a minimal role helper seam, not a full auth redesign. |
| Public self-service accidentally inherits auth layout/guards. | Medium | Place it outside authenticated layouts. |
| Client-side scope enforcement diverges from backend authority. | Medium | Treat frontend filters as convenience only. |
| Strict TDD with almost no frontend tests. | High | Add minimal service/state/route shell specs before implementation. |

## Rollback Plan

Remove the new feature folder, route entries, menu items, tests, and `AuthService` helper. No persistence or backend data changes are introduced.

## Dependencies

- Backend endpoints under `/api/v1/caregiver-attendance`, including public `POST /marks/self-service` and authenticated admin/AT caregiver, schedule, mark, exception, and report endpoints.

## Success Criteria

- [ ] Routes, menus, placeholder pages, service methods, interfaces, and state shells compile under strict TypeScript.
- [ ] Self-service route is public and not behind authenticated layout.
- [ ] Minimal TDD bootstrap specs exist and pass with the configured Karma command.
