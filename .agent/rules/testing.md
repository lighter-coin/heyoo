# Testing Standards

> Pre-action protocol: See CLAUDE.md §2.

trigger: test files, `describe`, `it`, `expect`, `vi.`, `jest.`, `mock`, `*.test.*`, `*.spec.*`

---

## Framework Assignment

| Surface | Framework | Runner |
|---------|-----------|--------|
| Web / TMA / shared packages | **Vitest 4** | `pnpm test` via Turborepo |
| React Native (Expo) | **Jest 30** + `jest-expo` | `pnpm test` in `apps/mobile` |
| E2E (future) | Playwright | Separate pipeline |

Never mix — a single test file imports from exactly one runner.

## File Naming & Location

- Colocate tests: `src/features/auth/hooks/use-auth.test.ts` next to `use-auth.ts`.
- Suffix: `.test.ts` / `.test.tsx`. Never `.spec.*` — pick one convention.
- Test utils/factories: `src/test/` at package root. Never `__tests__/`.

## What to Test

1. **Business logic** — validators, transformers, calculations. Always.
2. **Hooks** — via `@testing-library/react` `renderHook`. Assert return values and state transitions.
3. **Components** — interaction behaviour (click, submit), not snapshot or DOM structure.
4. **tRPC procedures** — integration test the router with a real caller, mocked DB layer.
5. **Edge cases** — null, empty arrays, network failures, race conditions, TON wallet rejection.

## What NOT to Test

- Implementation details (internal state variable names, call counts of private helpers).
- Pure framework wiring (Next.js layouts, Expo config).
- Styles / CSS class presence (unless accessibility-critical).

## Test Structure

```typescript
describe('calculateLighterDrop', () => {
  it('should return drop amount for valid hex at resolution 9', () => {
    const result = calculateLighterDrop({ hexId: '891f1d48177ffff', resolution: 9 })
    expect(result).toBe(100)
  })

  it('should throw InsufficientBalanceError when wallet is empty', () => {
    expect(() =>
      calculateLighterDrop({ hexId: '891f1d48177ffff', resolution: 9, balance: 0 }),
    ).toThrow(InsufficientBalanceError)
  })
})
```

Rules:
- **Descriptive names**: `it('should return 404 when user does not exist')`, never `it('test error')`.
- **One logical assertion per test**. Multiple `expect()` calls are fine if they assert one concept.
- **No test interdependency**. Each test is an island — no shared mutable state between `it()` blocks.
- **Arrange → Act → Assert** structure. Blank line between each section.

## Test Data Factories

Never inline object literals across tests. Use a factory:

```typescript
// src/test/factories.ts
export const makeUser = (overrides?: Partial<User>): User => ({
  id: 'usr_test_1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'member',
  createdAt: new Date('2025-01-01'),
  ...overrides,
})

export const makeHex = (overrides?: Partial<HexOwnership>): HexOwnership => ({
  hexId: '891f1d48177ffff',
  ownerId: 'usr_test_1',
  resolution: 9,
  claimedAt: new Date('2025-01-01'),
  ...overrides,
})
```

## Mocking

- **HTTP / tRPC**: Use MSW (`msw`) for network-level mocking. Never mock `fetch` directly.
- **Zustand stores**: Import and call `store.setState()` in test setup — no mocking needed.
- **TanStack Query**: Wrap in `QueryClientProvider` with a fresh `QueryClient` per test (set `retry: false`).
- **TON Connect**: Mock `useTonConnectUI` return — never hit real blockchain in unit tests.
- **Timers**: `vi.useFakeTimers()` / `jest.useFakeTimers()` for debounce/throttle tests. Always `vi.useRealTimers()` in cleanup.

## Coverage

- Minimum threshold: **80% line coverage** for `packages/*` business logic.
- No coverage requirement for UI-heavy `apps/` code — focus on interaction tests instead.
- Coverage tool: Vitest's built-in c8/istanbul. Configure in `vitest.config.ts`.

## Running Tests

```bash
pnpm test              # All packages via Turborepo
pnpm test --filter=@heyoo/core   # Single package
pnpm test -- --watch   # Watch mode during development
```
