---
trigger: always_on
---

# Code Quality Workflow (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

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

## Verification Checklist
- `pnpm lint` passes.
- Types clean; no `any` introduced.
- Tests updated/added where logic changes.
- Imports consistent with configured aliases (`@heyoo/*` for packages).
- No hardcoded user-facing strings; keep them centralized for future i18n.
- Styles use tokens/theme variables; no magic color/spacing values.

## Root Cause Rule
**NEVER PATCH.** Fix the root cause, not the symptom.
- ❌ `try { ... } catch { return null }` — hides the real error
- ✅ Fix the logic so it doesn’t throw unexpectedly

If a `catch` exists, it must log, transform, or surface the error. Never return a silent fallback.

## Error Handling
- No swallowed errors. Handle and surface actionable messages.
