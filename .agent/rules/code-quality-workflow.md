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

## Ripple audit (after EVERY code change — non-negotiable)
After modifying any value, signature, behavior, file name, or dependency, you MUST sweep the rest of the codebase for anything that depends on what you changed. Stale comments and dead code are bugs. The audit is part of the change, not an optional follow-up.

For every change, sweep for at least:
- **Stale comments / docstrings**: any comment in any file that quotes the old value, old timing, old behavior, old file path, or old name. Doc blocks at the top of sibling files often go stale silently.
- **Stale string/number literals**: hardcoded copies of the value you just changed (timings, sizes, URLs, env keys).
- **Dead imports**: symbols that nothing imports anymore after a refactor — and the transitive components those dead files dragged in.
- **Dead files**: components, hooks, utils, assets, fixtures left orphaned by a refactor. If `git grep` returns zero usages from the app entry points, the file is dead.
- **Removed dependencies**: after removing a package from `package.json`, grep the source for any leftover imports of that package — those are now broken builds.
- **Renamed exports**: if you renamed something, check every consumer; do not rely on the type checker to catch string-typed references (templates, dynamic imports, CSS module class names, test snapshots).
- **Config / docs / READMEs**: stale references in `CLAUDE.md`, `.agent/rules/*`, `skills/*`, READMEs, env example files.

Report findings to the user as a checklist BEFORE asking what to do with them. Never silently delete files the user didn’t ask you to delete — list them and ask. Never leave a stale comment "for later" — fix it as part of the same change.

This applies whether or not the user mentions it. If you ship a change without doing this sweep, you have shipped broken code.

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
