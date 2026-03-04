---
trigger: always_on
---

# Code Quality Workflow (Heyoo)

## ⚠️ META-RULE
1) Confirm `.agent/rules` exists. 2) List applicable files (at minimum: code-quality-workflow, coding-standards, project-structure; plus feature-specific). 3) State them before work. After changes: run `pnpm lint`, fix all errors, and confirm the change matches the request.

## Core principles
- Production-ready only: no broken builds, no regressions, no TODOs left untracked.
- Strict TS: no `any`, no unchecked promises.
- Minimal surface area: change only what is needed.

## Impact assessment (before coding)
- Identify dependents/usages of symbols you change.
- Check configs/migrations if data contracts move.
- Call out potential breaking changes and all files you’ll touch.

## Bug fix protocol
- Find the root pattern; search for similar occurrences and fix them too.
- Add/adjust tests covering the failure mode.

## Documentation
- Update existing docs if your change alters behavior or setup. Do not add new docs unless requested.

## Verification checklist
- `pnpm lint` passes.
- Types clean; no `any` introduced.
- Tests updated/added where logic changes.
- Imports consistent with configured aliases once they exist.
- No hardcoded user-facing strings; keep them centralized for future i18n.

## Error handling
- No swallowed errors. Handle and surface actionable messages.
