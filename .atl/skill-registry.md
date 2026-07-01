# Skill Registry — fichas-frontend-esdi-2.0

Index of non-SDD skills available for this session. Skills are runtime instruction
contracts; subagents receive exact paths and read the full `SKILL.md` source.

Legend:
- scope `project` = bundled with the opencode agent installation, available repo-wide
- scope `user` = installed in the user's home config

| Name | Trigger | Path | Scope |
|---|---|---|---|
| branch-pr | Create/open PRs for review; issue-first checks | C:\Users\rzunigas_dev\.agents\skills\branch-pr\SKILL.md | user |
| caveman | Ultra-compressed comms; "caveman mode", "less tokens" | C:\Users\rzunigas_dev\.claude\skills\caveman\SKILL.md | user |
| chained-pr | PRs over 400 lines, stacked PRs, review slices | C:\Users\rzunigas_dev\.agents\skills\chained-pr\SKILL.md | user |
| cognitive-doc-design | Writing guides/READMEs/RFCs/onboarding/architecture docs | C:\Users\rzunigas_dev\.config\opencode\skills\cognitive-doc-design\SKILL.md | user |
| comment-writer | PR feedback, issue replies, reviews, comments | C:\Users\rzunigas_dev\.claude\skills\comment-writer\SKILL.md | user |
| customize-opencode | Editing opencode config, agents, skills, MCP servers | <built-in> | project |
| diagnose | Hard bugs, perf regressions; "diagnose this", "broken" | C:\Users\rzunigas_dev\.agents\skills\diagnose\SKILL.md | user |
| find-skills | "how do I do X", "find a skill for X" | C:\Users\rzunigas_dev\.claude\skills\find-skills\SKILL.md | user |
| go-testing | Go tests, teatest, golden files (N/A: Angular repo) | C:\Users\rzunigas_dev\.config\opencode\skills\go-testing\SKILL.md | user |
| grill-me | Stress-test a plan; "grill me" | C:\Users\rzunigas_dev\.agents\skills\grill-me\SKILL.md | user |
| grill-with-docs | Grill a plan against CONTEXT.md / ADRs | C:\Users\rzunigas_dev\.claude\skills\grill-with-docs\SKILL.md | user |
| improve-codebase-architecture | Find refactoring/deepening opportunities | C:\Users\rzunigas_dev\.claude\skills\improve-codebase-architecture\SKILL.md | user |
| issue-creation | Create GitHub issues, bug reports, feature requests | C:\Users\rzunigas_dev\.agents\skills\issue-creation\SKILL.md | user |
| judgment-day | "judgment day", blind dual review, adversarial review | C:\Users\rzunigas_dev\.config\opencode\skills\judgment-day\SKILL.md | user |
| skill-creator | New skills, agent instructions | C:\Users\rzunigas_dev\.agents\skills\skill-creator\SKILL.md | user |
| skill-improver | Audit/upgrade existing skills | C:\Users\rzunigas_dev\.config\opencode\skills\skill-improver\SKILL.md | user |
| tdd | Red-green-refactor; integration tests; test-first | C:\Users\rzunigas_dev\.agents\skills\tdd\SKILL.md | user |
| to-issues | Break a plan/spec/PRD into grabbable issues | C:\Users\rzunigas_dev\.agents\skills\to-issues\SKILL.md | user |
| to-prd | Turn conversation context into a PRD | C:\Users\rzunigas_dev\.agents\skills\to-prd\SKILL.md | user |
| triage | Triage issues via state machine | C:\Users\rzunigas_dev\.agents\skills\triage\SKILL.md | user |
| work-unit-commits | Plan commits as reviewable work units | C:\Users\rzunigas_dev\.agents\skills\work-unit-commits\SKILL.md | user |
| write-a-skill | Create new agent skills | C:\Users\rzunigas_dev\.claude\skills\write-a-skill\SKILL.md | user |
| zoom-out | Broader context/higher-level perspective | C:\Users\rzunigas_dev\.agents\skills\zoom-out\SKILL.md | user |

Notes:
- SDD skills (`sdd-*`) and `_shared` are intentionally excluded from this index; they
  are invoked by the orchestrator, not listed as standalone skills.
- `go-testing` is listed for completeness but does not apply to this Angular repo.
- Project-specific `.atl/skills/` was empty; all entries are user/install scoped.