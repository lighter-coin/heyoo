# Environment Configuration

> Pre-action protocol: See CLAUDE.md §2.

trigger: `.env`, `process.env`, `import.meta.env`, `NEXT_PUBLIC_`, `VITE_`, environment variables

---

## Env File Hierarchy

| File | Purpose | Committed? |
|------|---------|------------|
| `.env.example` | Template with all keys, no values | ✅ Yes |
| `.env` | Local development defaults | ❌ No |
| `.env.local` | Developer-specific overrides | ❌ No |
| `.env.development` | Dev environment values | ❌ No |
| `.env.production` | Production values (CI only) | ❌ No |
| `.env.test` | Test environment values | ❌ No |

Every new env variable MUST be added to `.env.example` with a descriptive comment.

## Naming Conventions

### Client-Exposed Variables (DANGER ZONE)

| Platform | Prefix | Example |
|----------|--------|---------|
| Next.js (web) | `NEXT_PUBLIC_` | `NEXT_PUBLIC_TON_NETWORK` |
| Vite (TMA) | `VITE_` | `VITE_TELEGRAM_BOT_USERNAME` |
| Expo (mobile) | Via `app.config.ts` `extra` | `expo.extra.API_URL` |

**Rule**: Only add the client prefix when the value is genuinely needed in the browser/app. Server-only secrets NEVER get a public prefix.

### Server Variables

No prefix. Descriptive UPPER_SNAKE_CASE:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
TON_API_KEY=...
JWT_SECRET=...
```

## Zod Validation at Startup

Never read `process.env` directly. Validate once at app boot:

```typescript
// packages/core/src/env.ts
import { z } from 'zod'

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  TON_API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = serverEnvSchema.parse(process.env)
// App crashes immediately on boot if env is misconfigured — this is intentional.
```

Client-side equivalent for Vite/TMA:
```typescript
const clientEnvSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_TON_NETWORK: z.enum(['mainnet', 'testnet']),
  VITE_TELEGRAM_BOT_USERNAME: z.string().min(1),
})

export const clientEnv = clientEnvSchema.parse(import.meta.env)
```

## Cross-Platform Env Access

| Platform | Access Pattern |
|----------|---------------|
| Next.js server | `process.env.VAR` (at request time or build time) |
| Next.js client | `process.env.NEXT_PUBLIC_VAR` (inlined at build) |
| Vite / TMA | `import.meta.env.VITE_VAR` |
| Expo | `Constants.expoConfig?.extra?.VAR` via `app.config.ts` |
| Node.js API | `process.env.VAR` via validated `env` object |

## Rules

1. **Never hardcode** URLs, keys, or feature flags. Always env variable.
2. **Never log** env values in production. Mask secrets in dev logs.
3. **Fail fast**: If a required env var is missing, crash at startup — not on first request.
4. **Type the env object**: Import the validated `env` object, not `process.env`.
5. **TON network switching**: `TON_NETWORK=testnet|mainnet` controls wallet endpoints and contract addresses. Never mix.
