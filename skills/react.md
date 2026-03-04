# React Skill (2026)

Versions: React 19.2.x; React DOM 19.2.x. For RN, React Native 0.84.1 (Expo SDK 55).

## Rules
- Functional components only; hooks over classes.
- State: TanStack Query for server state; Zustand for client state; avoid prop drilling with contexts unless shared across many nodes.
- Avoid `any`; type props and state precisely.
- Effects: prefer derived data over stored; guard dependencies; avoid unnecessary rerenders.
- UI constraints: map starts dark; only hex center shown; history last-3 default with “see all”.
- Bundle care for TMA/web: code-split heavy features (maps, QR, charts). Avoid giant UI libs.

## Testing
- @testing-library/react 16.3.2 for DOM; Vitest as runner. Prefer behavior tests, not implementation details.

## Performance
- Memoize expensive derived values; avoid premature useMemo/useCallback everywhere. React 19’s concurrent features are available; ensure suspense boundaries are placed intentionally.

## Accessibility
- For web: label inputs/buttons; provide focus management on dialogs; keyboard paths for QR fallback uploads.

## TBD
- Component library choice (if any). Keep minimal until decided.