---
trigger: always_on
---

# React Component Standards (Heyoo)

## ⚠️ META-RULE
Verify `.agent/rules` exists; list applicable files (coding-standards, code-quality-workflow, project-structure, react-components, styling-architecture, state-management) and state them before work. After changes: `pnpm lint`, fix errors, confirm request alignment.

## Core principles
- Components are small, focused, and composable.
- Prefer server/SSR where possible; use `'use client'` only when you need state/effects/handlers or platform APIs.
- Minimize re-renders: subscribe to the smallest state slice; memoize leaf components if they get stable props.

## Patterns
- Arrow function components with named exports. Props typed via interfaces/types defined above the component (no inline prop shapes). Use `PropsWithChildren` when children are needed.
- Do not duplicate props into state. Derive values.
- Keys from stable IDs, never array indices.
- Handle loading and error states explicitly.

## Zustand usage
- Parents render layout/IDs; children select their own slice to avoid whole-tree rerenders. Avoid selecting entire store objects.

## Formatting
- Keep props multiline when more than two; close tag on the last prop line.
- For complex ternaries, wrap branches in parentheses and format clearly; simple one-liners are fine inline.

## Performance
- Use `useMemo` for expensive derived values; `useCallback` for handlers passed to memoized children; `React.memo` for leaf components with primitive/stable props.
- Code-split heavy features (maps, QR) on web/TMA surfaces.

## UX constraints (domain)
- Map is dark by default; never show raw coords—show hex center only.
- History view defaults to last 3 items; provide a full-history path.

## Cross-reference
- Styling: `styling-architecture.md`
- State: `state-management.md`
- Standards: `coding-standards.md`