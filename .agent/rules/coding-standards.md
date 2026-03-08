---
trigger: always_on
---

# Coding Standards (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## Core Principles
- Strict TypeScript, no `any`, no implicit `any`.
- Small, focused functions (<40 lines); early returns over nesting.
- Self-documenting names; avoid abbreviations. Booleans prefixed (`is/has/should/can`).
- Arrow functions for components; props typed via interfaces/types, not inline shapes.
- DRY: extract repeated logic into custom hooks or utility functions after 2+ occurrences.

## Naming Conventions
- **Variables/functions:** `camelCase`. Descriptive — no `usr`, `msg`, `btn`.
- **Components:** `PascalCase`. Filename matches export: `UserProfile.tsx` → `UserProfile`.
- **Types/Interfaces:** `PascalCase`. Suffix props interfaces with `Props` (e.g., `ButtonProps`, `MapViewProps`).
- **Booleans:** `is`, `has`, `should`, `can` prefix.
- **Constants:** True compile-time constants: `SCREAMING_SNAKE_CASE` (`MAX_RETRIES`). Config objects and runtime values: `camelCase`.
- **Hooks:** `use` prefix + descriptive name: `useWalletConnection`, `useHexOwnership`.

## Syntax
- Single quotes for strings.
- No semicolons when authoring. If Prettier inserts them, don't fight it — stay consistent with project config.
- ALWAYS add empty lines around control statements (`if`, `for`, `while`, `switch`) for readability.
- No empty lines between consecutive simple statements.

## Import Ordering (Strict)
Group imports in this order, separated by blank lines:
1. React / framework (`react`, `next/*`, `expo-*`)
2. Third-party libraries
3. Internal packages (`@heyoo/ui`, `@heyoo/core`)
4. Relative internal modules (components, hooks, utils)
5. Types (if separate `import type`)
6. Styles / CSS

## Error Handling
- Always handle async errors. No silent catches. Log or surface actionable messages.
- Use try/catch/finally for async flows:

```typescript
try {
  await apiCall()
} catch (error) {
  console.error('Context: what failed', error)
  setError(error)
} finally {
  setIsLoading(false)
}
```

## Data Contracts
- Define types near usage. Prefer discriminated unions to avoid illegal states.
- Never expose raw GPS coordinates; use H3 hex IDs and hex centers only.

## UI Text
- Avoid hardcoded user-facing strings; centralize in a strings/i18n helper. If i18n system is not set yet, keep strings in a constants module for easy migration.

## Accessibility
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<section>`).
- Add ARIA labels to interactive elements without visible text.
- Ensure keyboard navigability for all interactive components.

## Testing and Linting
- Write/extend tests when logic changes. Lint must pass (`pnpm lint`).
- See `testing.md` for framework and pattern details.

## Cross-reference
- Components: see `react-components.md`
- Styling: see `styling-architecture.md`
- State: see `state-management.md`
- Project layout: see `project-structure.md`