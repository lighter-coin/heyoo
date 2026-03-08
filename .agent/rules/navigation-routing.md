---
trigger: always_on
---

# Navigation & Routing (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## Core Principle
Keep navigation predictable and light. Locale/i18n strategy is TBD; avoid hardcoding locale-specific routing until decided. Use platform-appropriate navigation (Expo Router or Next/React Navigation) and centralize route helpers.

## Guidance
- Centralize route builders (e.g., `routes.ts`) so links/forms use the same paths.
- Preserve query params when relevant (filters, pagination) on web.
- Protect sensitive flows (wallet linking, history views) with guards; redirect unauthenticated users gracefully.
- Use link/navigation components for internal navigation; avoid full-page reloads.
- Do not expose raw coordinates in URLs—use hex IDs if location is part of routing.

## TMA/Web Considerations
- Keep routes shallow for bundle/perf; code-split heavy screens.
- Ensure camera/map routes request permissions only when entering those screens.

## Route Groups (apps/web — Next.js)
Use route groups for layout separation:
```
app/
├── (public)/          # No auth required
│   ├── page.tsx       # /
│   └── layout.tsx
└── (app)/            # Auth-gated
    ├── map/
    │   └── page.tsx   # /map
    ├── history/
    │   └── page.tsx   # /history
    └── layout.tsx
```

## Navigation Patterns
- **Prefetch critical routes:** Use `router.prefetch()` for routes the user is likely to visit.
- **Preserve scroll position:** Use `scroll={false}` on `<Link>` when navigating within a filtered view.
- **External links:** Always use `<a>` with `target="_blank"` and `rel="noopener noreferrer"`.
- **Conditional navigation with return URL:**

```typescript
const handleAction = async (targetId: string) => {
  if (!user) {
    router.push(`/login?redirect=/map/${targetId}`)
    return
  }
  await performAction(targetId)
}
```

## Cross-reference
- Components: `react-components.md`
- Standards: `coding-standards.md`