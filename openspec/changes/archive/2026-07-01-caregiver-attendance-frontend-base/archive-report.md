# Archive Report: Caregiver Attendance Frontend Base

**Change**: `caregiver-attendance-frontend-base`
**Archived on**: 2026-07-01
**Archived to**: `openspec/changes/archive/2026-07-01-caregiver-attendance-frontend-base/`
**Mode**: OpenSpec (filesystem source of truth) + Engram observation `fichas-esdi-backend`
**Verify verdict**: PASS WITH WARNINGS — zero critical findings.

## Outcome

The Angular Part 1 shell for caregiver attendance is now the source of truth in the
frontend repo. All 20 tasks are complete, all 19 new shell tests pass, the build
compiles under strict TypeScript, and the delta spec has been promoted to a main
spec at `openspec/specs/caregiver-attendance-frontend/spec.md`.

## Quick Path

1. Source of truth: `openspec/specs/caregiver-attendance-frontend/spec.md` ✅
2. Audit trail: `openspec/changes/archive/2026-07-01-caregiver-attendance-frontend-base/` ✅
3. Active changes folder no longer contains this change ✅

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| `caregiver-attendance-frontend` | Created (full copy from delta) | 8 ADDED requirements, 0 MODIFIED, 0 REMOVED, 0 RENAMED. No prior main spec existed. |

The delta spec was a pure `ADDED Requirements` block. Since no main spec existed at
`openspec/specs/caregiver-attendance-frontend/spec.md`, the delta was copied verbatim
as the initial main spec. No merge against prior content was required, so the
archive rules about destructive deltas and persisted `localStorage` keys
(CommitteeState) do not apply — no existing requirement was modified or removed.

## Spec Compliance (carried from `verify-report.md`)

| Requirement | Scenario | Status |
|-------------|----------|--------|
| REQ-01 Frontend Feature Shell | Shell compiles without workflow behavior | COMPLIANT |
| REQ-02 Authenticated Route and Menu Seams | Admin reaches placeholder | COMPLIANT |
| REQ-02 Authenticated Route and Menu Seams | User/AT reaches placeholder | COMPLIANT |
| REQ-03 Public Self-Service Route | Anonymous user opens self-service | COMPLIANT |
| REQ-04 JSON-Safe DTO Contracts | Date fields stay serializable | COMPLIANT |
| REQ-05 Thin Backend Service Methods | Service delegates scope and authorization | COMPLIANT |
| REQ-06 Signal State Shells | State shell handles minimal load result | COMPLIANT |
| REQ-07 AT Role Helper Seam | AT helper reads existing roles payload | COMPLIANT |
| REQ-08 Minimal Behavior Tests | Bootstrap tests protect the shell | COMPLIANT |

Compliance summary: 9/9 scenarios COMPLIANT.

## Task Completion Gate

`tasks.md` state at archive time: **20/20 checked**. No stale checkboxes. No
exceptional reconciliation was required.

## Verify Report Carryover

- 18 implementation tasks + 2 verification tasks = 20 total; 20/20 complete.
- Build: `corepack pnpm exec ng build` ✅ Passed.
- Tests: 21/22 passed in full suite. The single failure is a pre-existing
  `AppComponent should render title` assertion unrelated to caregiver attendance.
- TDD compliance: 6/6 checks passed; 19 new tests across 6 spec files.
- Spec coverage: 9/9 scenarios COMPLIANT with covering passing tests.
- Coherence vs. design: 9/9 decisions followed; 1 acceptable, beneficial design
  deviation (user layout now exposes `Locales` immediately before `Asistencia MC`
  to satisfy the "immediately after Locales" menu order).

## Warnings Recorded (non-blocking, intentional archive)

1. **Pre-existing AppComponent title test** — `src/app/app.component.spec.ts`
   expects `Hello, fichas-frontend-2.0`; template no longer renders that text.
   Pre-existing, unrelated to caregiver attendance. **Not blocking.**
2. **User layout `Locales` menu entry** — newly added so the new
   `Asistencia MC` menu item can sit immediately after it, matching the design
   decision and admin layout. Beneficial; `community-halls` was already a valid
   guarded user route. **Not blocking.**
3. **Cosmetic Karma 404 for `/base/media/Montserrat-VariableFont_wght.ttf`** —
   non-blocking, pre-existing test runner noise. **Not blocking.**

These warnings are recorded here as the deliberate rationale for proceeding with
the archive despite non-critical issues, per the Strict-vs-OpenSpec archive
policy. No CRITICAL findings exist, and the orchestrator has not authorised a
destructive delta or stale-checkbox reconciliation — none were needed.

## Archive Contents

- `proposal.md` ✅
- `exploration.md` ✅
- `design.md` ✅
- `specs/caregiver-attendance-frontend/spec.md` ✅
- `tasks.md` ✅ (20/20 tasks complete)
- `apply-progress.md` ✅ (full TDD cycle evidence)
- `verify-report.md` ✅ (PASS WITH WARNINGS)
- `archive-report.md` ✅ (this file)

## Source of Truth Updated

- `openspec/specs/caregiver-attendance-frontend/spec.md` — created from the delta
  since no main spec previously existed. Contains 8 requirements (REQ-01..REQ-08)
  covering the feature shell, route and menu seams, public self-service route,
  JSON-safe DTOs, thin service methods, signal state shells, AT role helper
  seam, and minimal behavior tests.

## PR Strategy

Single PR with maintainer-approved `size:exception` for Part 1. PR creation is
out of scope for this archive phase — no commits, pushes, or PRs were made.
Apply and verify evidence is committed inside this audit trail.

## Next Step

- The change cycle is closed. The next SDD change can build on the
  `caregiver-attendance-frontend` capability for Part 2 (full caregiver CRUD,
  assignments/transfers, schedule editor, attendance marking, exceptions,
  monthly reports) — all of which were explicitly OUT of scope for Part 1.
- No follow-up tasks are required for `caregiver-attendance-frontend-base`.
