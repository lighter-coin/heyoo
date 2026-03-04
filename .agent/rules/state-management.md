---
trigger: always_on
---

# State Management (Heyoo)

## Core principle
Server/state minimalism. Server data stays server-fetched; client state only when necessary.

## Decision tree
- Is it server data? → fetch on the server (or React Query on client only if you need mutations/polling/real-time).
- Is it shared UI/client state? → Zustand.
- Is it purely local? → `useState`.
- Should it be bookmarkable? → URL/search params.

## Tools
- Server data: TanStack Query for client-side data fetching/mutations when needed; otherwise server fetch.
- Client state: Zustand stores under `lib/store`. Use selectors for minimal subscriptions. Persist only when justified.

## Patterns
- Do not duplicate server data into Zustand unless you need offline/optimistic UX.
- Children subscribe to their own slice; parents pass IDs.
- Keep store files small; export typed actions/selectors.

## Performance
- Avoid whole-store subscriptions. Memoize expensive derivations.
- Prefer code-splitting for heavy features (maps, QR) on the client side.

## Error/loading
- Always represent loading and error states; no silent failures.

## Cross-reference
- Components: `react-components.md`
- Standards: `coding-standards.md`
