---
trigger: always_on
---

# Coding Standards (Heyoo)

## ⚠️ META-RULE (READ FIRST)

1) Verify `.agent/rules` exists. 2) List the relevant rule files for the task (coding-standards, code-quality-workflow, project-structure, plus feature-specific). 3) State them before work. After changes: run `pnpm lint`, fix all errors, and confirm alignment with the request.

## Core Principles
- Strict TypeScript, no `any`, no implicit `any`.
- Small, focused functions; early returns over nesting.
- Self-documenting names; avoid abbreviations. Booleans prefixed (`is/has/should/can`).
- Arrow functions for components; props typed via interfaces/types, not inline shapes.

## Syntax
- Single quotes; trailing semicolons allowed if formatter inserts them, but prefer none when authoring. Stay consistent with Prettier config.
- Control blocks separated by a blank line for readability.

## Error handling
- Always handle async errors; log or surface actionable messages. No silent catches.

## Data contracts
- Define types near usage. Prefer discriminated unions to avoid illegal states.
- Never expose raw GPS coordinates; use H3 hex IDs and hex centers only.

## UI text
- Avoid hardcoded user-facing strings; centralize in a strings/i18n helper. If i18n system is not set yet, keep strings in a constants module for easy migration.

## Imports
- Prefer ESM. Use absolute imports/aliases once configured; avoid deep relative chains.

## Testing and linting
- Write/extend tests when logic changes. Lint must pass (`pnpm lint`).

## Cross-reference
- Components: see `react-components.md`
- Styling: see `styling-architecture.md`
- State: see `state-management.md`
- Project layout: see `project-structure.md`