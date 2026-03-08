---
trigger: always_on
---

# State Management (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## Core Principle
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

## Error/Loading
- Always represent loading and error states; no silent failures.

## Form State
- Use controlled components by default.
- Use local state (`useState`) for form values unless they need to persist globally or survive navigation.
- Validate on submit with Zod; display errors inline.

## Optimistic Updates
- Update UI immediately on user action; revert on server error. Use TanStack Query’s `onMutate`/`onError`/`onSettled` for the rollback pattern.

## URL State
- Bookmarkable state (filters, pagination, search) belongs in URL search params.
- Use `useSearchParams` (Next.js) or equivalent to sync.

## Common Pitfalls
- **Stale closures:** Use functional updates `setState(prev => prev + 1)` when referencing previous state inside callbacks/effects.
- **Mutation:** Never mutate state directly. Zustand uses immer-style or spread patterns; React state is immutable.
- **Prop drilling:** If passing props down more than 2-3 levels, lift to Zustand or Context.
- **Over-fetching in stores:** Don’t replicate server data into Zustand; let TanStack Query own the cache.

## Cross-reference
- Components: `react-components.md`
- Standards: `coding-standards.md`
