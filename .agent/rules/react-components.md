---
trigger: always_on
---

# React Component Standards (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## Core Principles
- Components are small, focused, and composable. Single responsibility.
- Default to Server Components (RSC). Add `'use client'` boundary at the **smallest component** that needs state, effects, handlers, or browser/platform APIs.
- Minimize re-renders: subscribe to the smallest state slice; memoize leaf components if they receive stable props.

## Canonical Component File Structure

Every component file follows this order:

```tsx
'use client' // Only if needed — never on layouts/pages unless required

// 1. React / framework imports
import { useState, useMemo } from 'react'

// 2. External libraries
import { clsx } from 'clsx'

// 3. Internal packages
import { Button } from '@heyoo/ui'
import { formatHexId } from '@heyoo/core'

// 4. Relative imports (sibling components, hooks, utils)
import { useHexOwnership } from './use-hex-ownership'

// 5. Types
import type { LighterProps } from './types'

// --- Types/Interfaces (defined above component) ---
interface MapMarkerProps {
  hexId: string
  isActive: boolean
  onSelect: (hexId: string) => void
}

// --- Helper functions (pure, component-specific) ---
const formatLabel = (hexId: string): string =>
  hexId.slice(0, 8) + '…'

// --- Component ---
export const MapMarker = ({ hexId, isActive, onSelect }: MapMarkerProps) => {
  const label = useMemo(() => formatLabel(hexId), [hexId])

  return (
    <button
      onClick={() => onSelect(hexId)}
      className={clsx('marker', isActive && 'marker--active')}>
      {label}
    </button>
  )
}
```

## Component Design Rules

- **Props typed via interfaces** defined above the component. Never inline prop shapes. Suffix with `Props` (e.g., `LighterCardProps`).
- **Use `PropsWithChildren`** when children are accepted. Make it explicit.
- **Do not duplicate props into state.** Derive values directly.
- **Keys from stable IDs**, never array indices.
- **Named exports only.** Exception: `default export` for Next.js page/layout components where the framework requires it.
- **Arrow function components** with named exports: `export const MyComponent = (...)`.

## Server vs Client Component Boundaries (React 19 / Next.js)

- **Default to Server Components.** They have zero client-side JS cost.
- **Add `'use client'` at the leaf level** — the smallest component that needs interactivity, not the parent.
- **Never make a layout or page a client component** unless it genuinely requires client-side state/effects. Move interactive parts into child client components.
- **Data fetching belongs in Server Components** (via async component or server action). Client components fetch only when they need real-time/polling/mutation via TanStack Query.

## React 19 Patterns

- **`use()` hook**: Read promises and context directly. Use for suspense-compatible data loading.
- **Server Actions**: For form submissions and mutations that run server-side. Define with `'use server'`.
- **`useOptimistic`**: For immediate UI feedback while a server action is pending.
- **`useFormStatus`**: For submit button loading states within `<form>` using server actions.
- **`useActionState`**: For form actions with return values (replaces `useFormState`).

## Custom Hook Design

- **Prefix with `use`**: `useWalletConnection`, `useHexOwnership`, `useLighterHistory`.
- **Extract when**: logic is reused across components, or a single component's logic exceeds ~15 lines of hooks/effects.
- **Return shape**:
  - Simple state: return a tuple `[value, setter]` matching `useState` convention.
  - Complex state: return a named object `{ data, isLoading, error, refetch }`.
- **Keep hooks focused.** One hook = one concern. Don't create `useEverything()`.
- **Hooks must not contain JSX.** If a hook needs to return UI, it should return data that a component renders.

## Suspense & Error Boundaries

- **Suspense boundaries**: Place per-route at minimum. Add per-data-source for independent loading states (e.g., map loads independently from history list).
- **Wrap all lazy-loaded components** in `<Suspense fallback={...}>`.
- **Error boundaries**: Use Next.js `error.tsx` per route segment. For React Native / TMA, wrap feature screens in custom `<ErrorBoundary>` components.
- **Granularity**: Critical features (wallet, map, scanner) each get their own error boundary — one crash shouldn't take down the whole screen.

## Zustand Usage
- Parents render layout/IDs; children select their own slice to avoid whole-tree rerenders.
- Never select entire store objects. Use selectors: `useStore(state => state.activeHexId)`.
- Avoid selecting derived data from stores — compute it in the component or a `useMemo`.

## Loading and Error States
- **Always handle explicitly.** Every data-fetching component must render loading, error, and empty states.
- Use early returns for guard clauses:

```tsx
if (isLoading) return <Spinner />
if (error) return <ErrorMessage error={error} />
if (!data || data.length === 0) return <EmptyState />
```

## Form Handling
- **Controlled components** by default. Use `useState` for form values.
- **Validate on submit** with Zod schemas. Display errors inline next to the relevant field.
- **Use local state** for form values unless they need to survive navigation (then URL params or Zustand).
- For server-side forms in Next.js, prefer Server Actions with `useActionState`.

## Formatting
- Props multiline when more than two. **Closing tag (`/>`) goes on the last prop line, NOT on a new line.**
- **Sort props by length** (shortest first) for visual consistency.
- For complex ternaries, wrap branches in parentheses. Simple one-liners are fine inline.

```tsx
// ✅ GOOD — sorted by length, closing tag on last prop line
<Component
  id={id}
  title={title}
  onSelect={handleSelect}
  description={longDescription} />

// ❌ BAD — unsorted, closing tag on its own line
<Component
  description={longDescription}
  id={id}
  onSelect={handleSelect}
  title={title}
/>
```

## Performance
- `useMemo` for expensive derived values (filtering large lists, heavy computations).
- `useCallback` for handlers passed to memoized children — not for every function.
- `React.memo` for leaf components with primitive/stable props that receive frequent parent re-renders.
- **Code-split heavy features** (maps, QR, charts) on web/TMA surfaces using `React.lazy` or Next.js dynamic imports.
- Avoid creating new objects/arrays in JSX: `style={{ color: 'red' }}` creates a new reference every render.

## UX Constraints (Domain)
- Map is dark by default. Never show raw coordinates — display hex center only.
- History view defaults to last 3 items; provide a full-history path.

## Cross-reference
- Styling: `styling-architecture.md`
- State: `state-management.md`
- Standards: `coding-standards.md`
- Error boundaries: `error-boundaries.md`
- Testing: `testing.md`