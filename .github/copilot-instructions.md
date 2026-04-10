# GitHub Copilot — project directive

This file is the entry point for GitHub Copilot (and any other agent that reads `.github/copilot-instructions.md`) operating in this repository. The cross-agent counterpart lives at `AGENTS.md`; Claude Code reads `CLAUDE.md`. All three are thin entry points that defer to the same source of truth.

---

## 1. Source of truth

**`.agent/rules/*.md` is the authoritative rule set for this project.** Always read it before doing anything. Your training defaults are secondary.

Required reading at the start of every task:
- `.agent/rules/code-quality-workflow.md` — including the **Ripple audit** section (mandatory after every change)
- `.agent/rules/coding-standards.md` — including the **Language** section (English-only in code)
- `.agent/rules/project-structure.md`
- `.agent/rules/react-components.md`
- `.agent/rules/state-management.md`
- `.agent/rules/styling-architecture.md`
- `.agent/rules/testing.md`
- Plus any rule file relevant to the task surface (TMA, web3, geospatial, camera, backend, db, security, ci-cd, etc.)

Skill files in `skills/*.md` cover stack-specific best practices (turborepo, telegram-mini-app, expo, react, node, db-orm, ton-web3, maps-geospatial, state-and-fetching-trpc, typescript, tech-stack). Read the ones relevant to your task.

If you cannot read `.agent/rules/`, **STOP** and tell the user — do not proceed on training defaults alone.

---

## 2. Non-negotiable rules (inlined for resilience)

These are the rules that get violated most often. Even if you skip everything else, do these:

### 2.1 — Ripple audit after every change
After modifying any value, signature, behavior, file name, or dependency, you MUST sweep the rest of the codebase for anything that depends on what you changed. Stale comments and dead code are bugs. The audit is part of the change, not an optional follow-up.

Sweep for at least:
- Stale comments / docstrings quoting old values, timings, behaviors, paths, or names
- Stale string/number literals (timings, sizes, URLs, env keys hardcoded elsewhere)
- Dead imports and the transitive files they dragged in
- Dead files (components, hooks, utils, assets, fixtures left orphaned by a refactor)
- Removed dependencies — grep source for any leftover imports of the removed package
- Renamed exports — check every consumer including templates, dynamic imports, CSS module class names, test snapshots
- Stale references in `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`, `.agent/rules/*`, `skills/*`, READMEs, env example files

Report findings as a checklist BEFORE asking what to do with them. Never silently delete files the user didn't ask to delete. Never leave a stale comment "for later".

If you ship a change without this sweep, you have shipped broken code.

### 2.2 — English only in code
All identifiers, comments, string literals, CSS comments, commit messages, and documentation must be written in English. No other language inside any source file, ever — not even throwaway comments. Conversation with the user can be in any language; code artifacts cannot.

### 2.3 — Pre-action protocol
Before any code modification: state which `.agent/rules/` and `skills/` files apply, list the top constraints, and list the files you plan to modify. If a relevant rule file is missing, STOP and ask.

### 2.4 — Post-action verification
Run `pnpm lint` and `pnpm typecheck` (or the project's equivalent). Run/update tests. Show output. Fix errors before considering the task complete.

### 2.5 — Communication style
Direct and honest. Challenge weak reasoning. Don't validate, don't soften the truth. Call out shortcuts, excuses, and dead ends.

### 2.6 — Change minimalism
Smallest correct change. No drive-by refactors. No speculative abstractions. No unrequested "improvements". Match existing patterns even if you'd write them differently from scratch.

---

## 3. Rule hierarchy

1. `.agent/rules/*.md` files in this project (highest priority)
2. This file's inlined rules above
3. Your training defaults (lowest priority)

When conflict exists, defer to the higher priority source.
