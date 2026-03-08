# Security Standards

> Pre-action protocol: See CLAUDE.md §2.

trigger: authentication, authorization, secrets, CORS, CSP, rate limiting, injection, XSS, `JWT`, `token`, `sanitize`

---

## Input Validation

**Never trust client input.** Validate at every API boundary with Zod:

```typescript
// Every tRPC procedure starts with input validation
export const claimHex = protectedProcedure
  .input(z.object({
    hexId: z.string().regex(/^[0-9a-f]{15}$/), // Valid H3 index
    resolution: z.number().int().min(5).max(12),
  }))
  .mutation(async ({ input, ctx }) => { /* ... */ })
```

Rules:
- Zod schemas are the **single source of truth** — shared via `@heyoo/types`.
- Validate on the server even if the client already validated.
- Reject unknown fields: use `.strict()` on object schemas.
- Sanitize user-generated strings before storage (trim, escape HTML).

## Database Security

- **Parameterized queries only.** Drizzle ORM handles this — never use `sql.raw()` with user input.
- **Principle of least privilege.** DB user for the app should not have `DROP` or `CREATE` permissions in production.
- **No `SELECT *`** — explicitly list columns.

## Authentication & Authorization

- **Authenticate ≠ Authorize.** Knowing who someone is ≠ knowing what they can do.
- Use middleware to verify JWT/session before route handlers.
- tRPC: `protectedProcedure` for authenticated routes, `publicProcedure` only for truly public data.
- **Token storage**: HttpOnly cookies (web), secure storage (mobile), Telegram `initData` validation (TMA).

### TMA Authentication

```typescript
// Validate Telegram initData on every request
import { validate } from '@telegram-apps/init-data-node'

const validateTMAAuth = (initDataRaw: string) => {
  validate(initDataRaw, botToken, { expiresIn: 3600 })
  // Throws if invalid or expired
}
```

Never trust `initData` without server-side validation against the bot token.

## Secrets Management

- **Environment variables only.** Never in code, never in git, never in comments.
- `.env` files are `.gitignore`d. Committed `.env.example` has keys with empty values.
- Rotate secrets on any suspected compromise.
- Use `env` validated object (see `environment-config.md`) — never raw `process.env`.

## CORS

```typescript
// Fastify CORS config
app.register(cors, {
  origin: [
    'https://heyoo.app',
    'https://tma.heyoo.app',
    /\.vercel\.app$/,  // Preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})
```

- Allowlist specific origins. Never `origin: '*'` with credentials.
- TMA: The WebView origin may vary — validate via `initData`, not CORS alone.

## Content Security Policy (CSP)

For `apps/web` (Next.js), set CSP headers:

```typescript
// next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://telegram.org;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  connect-src 'self' https://api.heyoo.app https://toncenter.com wss:;
  frame-ancestors 'self' https://web.telegram.org;
`
```

- `frame-ancestors` must include `web.telegram.org` for TMA embedding.
- No `unsafe-eval` unless absolutely required (and documented why).

## Rate Limiting

- Apply rate limiting at the API gateway level (Fastify plugin or reverse proxy).
- Sensitive endpoints (auth, wallet operations, hex claiming): **10 req/min per user**.
- Public read endpoints: **60 req/min per IP**.
- Return `429 Too Many Requests` with `Retry-After` header.

## TON / Web3 Security

- **Never store or transmit private keys.** Wallet signing happens client-side via TON Connect.
- **Verify transaction results server-side** — never trust client-reported transaction status.
- **Contract addresses**: Hardcode or env-var — never accept contract addresses from client input.
- **Testnet vs Mainnet**: Controlled by `TON_NETWORK` env var. Fail-safe: default to testnet.

## Dependency Auditing

```bash
pnpm audit              # Run regularly, at minimum before releases
pnpm audit --fix         # Auto-fix where possible
```

- Critical/high vulnerabilities block deployment.
- Review new dependencies before adding: check size, maintenance status, known CVEs.
- Prefer well-maintained, widely-used packages over obscure alternatives.

## HTTPS

- **Everywhere. No exceptions.**
- Local dev: Use HTTPS proxy or accept self-signed certs for TON Connect testing.
- Reject mixed content — no HTTP resources loaded from HTTPS pages.
