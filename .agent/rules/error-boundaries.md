# Error Boundaries & Error Propagation

> Pre-action protocol: See CLAUDE.md §2.

trigger: `ErrorBoundary`, `error.tsx`, `onError`, error handling, crash recovery, fallback UI

---

## Error Propagation Flow

```
tRPC procedure throws
  → TanStack Query catches (error state)
    → Component reads error
      → Nearest ErrorBoundary renders fallback
        → User sees actionable message + retry
```

One failure must **never** cascade to the entire screen.

## Per-Platform Strategy

### Next.js (`apps/web`)

Use Next.js file conventions:

| File | Scope | Purpose |
|------|-------|---------|
| `error.tsx` | Per route segment | Catches render + data errors, auto-wrapped in ErrorBoundary |
| `global-error.tsx` | Root layout | Last resort — catches root layout failures |
| `not-found.tsx` | Per route segment | 404 UI |
| `loading.tsx` | Per route segment | Suspense fallback |

```tsx
// app/map/error.tsx
'use client'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MapError({ error, reset }: ErrorPageProps) {
  return (
    <div role="alert">
      <h2>Map failed to load</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### TMA (`apps/tma`)

No file-convention boundaries. Use a React ErrorBoundary component:

```tsx
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <TMAErrorFallback error={error} onRetry={resetErrorBoundary} />
  )}
  onError={(error) => {
    // Log to telemetry — TMA WebView swallows console errors
    reportError(error)
  }}>
  <MapView />
</ErrorBoundary>
```

**TMA-specific**: Telegram's WebView silently swallows unhandled errors. Always wrap critical features (map, wallet, scanner) in explicit boundaries.

### React Native / Expo (`apps/mobile`)

Use `react-error-boundary` or a custom class component. Expo's error overlay only works in dev.

```tsx
<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <CrashFallback error={error} onRetry={resetErrorBoundary} />
  )}
  onError={(error) => reportCrash(error)}>
  <NavigationContainer />
</ErrorBoundary>
```

## Boundary Placement Rules

1. **Per-route**: Every route segment has an `error.tsx` (Next.js) or wrapping `ErrorBoundary`.
2. **Per-critical-feature**: Map, Wallet/TON Connect, QR Scanner, Camera — each gets its own boundary.
3. **Never at leaf component level** — boundaries belong at feature/route boundaries, not around every button.
4. **Suspense pairs with ErrorBoundary**: Where you place `<Suspense>`, place an `<ErrorBoundary>` at the same level or above.

## TanStack Query Error Handling

```typescript
// Global error handler — set once in QueryClient config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      throwOnError: true, // Propagate to nearest ErrorBoundary
    },
    mutations: {
      throwOnError: false, // Handle inline for user feedback
      onError: (error) => {
        // Toast or inline error — mutations need immediate feedback
        showErrorToast(error.message)
      },
    },
  },
})
```

- **Queries**: `throwOnError: true` — let ErrorBoundary handle it.
- **Mutations**: `throwOnError: false` — handle inline with toast/form error.

## Error Message Rules

- User-facing: Use `getErrorMessage(error.data.code)` from `@heyoo/api` — maps `ApiErrorCode` to localized strings.
- **Never match on `message` strings** — always on `code`. Messages change; codes are contracts.
- Developer-facing (logs): Full error stack, request context, user ID, hex ID.
- Never expose: Stack traces, env variables, database errors, internal paths.

See `backend-architecture.md` → Named API Errors for the full `ApiErrorCode` registry and client-side `getErrorMessage()` usage.

## Logging & Telemetry

- Every `onError` callback must call `reportError(error)` — fire-and-forget to telemetry.
- Include context: `{ feature: 'map', action: 'loadHexes', userId }`.
- TMA: Use `window.onerror` and `window.onunhandledrejection` as safety nets.
