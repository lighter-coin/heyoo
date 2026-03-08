---
trigger: always_on
---

# Backend Architecture (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## Stack (when backend is added)
- Runtime: Node.js 22 LTS
- Framework: Fastify (ESM) or lightweight equivalent
- Language: TypeScript strict
- ORM: Drizzle ORM (PostgreSQL)
- Validation: Zod-based schemas in shared contracts
- Auth: TBD (wallet + anonymous session), avoid baking JWT until decided

## Principles
- Modular features: routes → handlers → services → db layer. Keep controllers thin; business logic in services.
- Type-safe everywhere: shared types in `packages/types/`.
- No raw coordinates stored or returned; use H3 hex IDs and centers only.

## Structure (apps/api/)
```
apps/api/
├── src/
│   ├── app.ts          # Fastify bootstrap
│   ├── plugins/        # auth, cors, rate-limit, logger
│   ├── modules/        # feature folders
│   │   └── history/
│   │       ├── history.routes.ts
│   │       ├── history.controller.ts
│   │       ├── history.service.ts
│   │       └── history.schema.ts
│   └── lib/            # response helpers, errors, h3 utils
├── test/
└── package.json
```

## Generic Response Payload

Every API response — success or failure — uses the same envelope. No exceptions.

```typescript
// packages/types/src/api.ts

/** Success envelope */
interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    page?: number
    pageSize?: number
    total?: number
    cursor?: string
  }
}

/** Error envelope */
interface ApiError {
  success: false
  error: {
    code: ApiErrorCode       // Machine-readable, e.g. 'HEX_ALREADY_CLAIMED'
    message: string          // Human-readable fallback
    details?: Record<string, unknown>  // Validation field errors, context, etc.
  }
}

type ApiResponse<T> = ApiSuccess<T> | ApiError
```

Rules:
- `data` is always the domain payload — never nest `{ data: { result: ... } }`.
- `meta` is reserved for pagination. Omit when not paginated.
- Clients discriminate on `success: true | false` — never on HTTP status alone.
- **Never return raw arrays** at the top level. Always wrap: `{ success: true, data: { items: [...], count: N } }`.

### Response Helper

```typescript
// apps/api/src/lib/response.ts
export function ok<T>(data: T, meta?: ApiSuccess<T>['meta']): ApiSuccess<T> {
  return { success: true, data, ...(meta && { meta }) }
}
// Error responses are handled by the error classes below — never construct manually.
```

---

## Named API Errors

**Every error thrown by the API must be an instance of `AppError` or its subclasses.** Generic `Error` or `throw new Error('...')` is forbidden in route handlers and services.

### Error Code Registry

```typescript
// packages/types/src/api-errors.ts

export const API_ERROR_CODES = {
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_INIT_DATA: 'INVALID_INIT_DATA',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Hex / Map
  HEX_ALREADY_CLAIMED: 'HEX_ALREADY_CLAIMED',
  HEX_NOT_FOUND: 'HEX_NOT_FOUND',
  INVALID_HEX_RESOLUTION: 'INVALID_HEX_RESOLUTION',

  // Wallet / Token
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',

  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES]
```

Rules:
- Codes are **UPPER_SNAKE_CASE** strings — not numbers.
- New domain features add codes here. This file is the single source of truth.
- Clients import `ApiErrorCode` and switch on it — never on `message` strings.

### Base Error Class

```typescript
// apps/api/src/lib/errors.ts
import type { ApiErrorCode } from '@heyoo/types'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: ApiErrorCode
  public readonly details?: Record<string, unknown>

  constructor(params: {
    code: ApiErrorCode
    message: string
    statusCode?: number
    details?: Record<string, unknown>
    cause?: unknown
  }) {
    super(params.message, { cause: params.cause })
    this.name = 'AppError'
    this.code = params.code
    this.statusCode = params.statusCode ?? 500
    this.details = params.details
  }

  toJSON(): ApiError {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    }
  }
}
```

### Domain Error Subclasses

Create named subclasses for common categories. These set the correct `statusCode` and `code` automatically:

```typescript
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super({
      code: 'NOT_FOUND',
      message: `${resource} '${id}' not found`,
      statusCode: 404,
    })
    this.name = 'NotFoundError'
  }
}

export class HexAlreadyClaimedError extends AppError {
  constructor(hexId: string) {
    super({
      code: 'HEX_ALREADY_CLAIMED',
      message: `Hex ${hexId} is already claimed`,
      statusCode: 409,
      details: { hexId },
    })
    this.name = 'HexAlreadyClaimedError'
  }
}

export class InsufficientBalanceError extends AppError {
  constructor(required: number, available: number) {
    super({
      code: 'INSUFFICIENT_BALANCE',
      message: `Insufficient balance: need ${required}, have ${available}`,
      statusCode: 422,
      details: { required, available },
    })
    this.name = 'InsufficientBalanceError'
  }
}

export class ValidationError extends AppError {
  constructor(fields: Record<string, string[]>) {
    super({
      code: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      statusCode: 400,
      details: { fields },
    })
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(reason = 'Authentication required') {
    super({
      code: 'UNAUTHORIZED',
      message: reason,
      statusCode: 401,
    })
    this.name = 'UnauthorizedError'
  }
}

export class RateLimitedError extends AppError {
  constructor(retryAfterSeconds: number) {
    super({
      code: 'RATE_LIMITED',
      message: 'Too many requests',
      statusCode: 429,
      details: { retryAfterSeconds },
    })
    this.name = 'RateLimitedError'
  }
}
```

Rules:
- One subclass per distinct failure mode that needs unique client handling.
- Constructor takes **domain-specific arguments**, not raw `code` / `statusCode`.
- Always set `this.name` — needed for `instanceof` checks and logging.

### Global Error Handler (Fastify)

```typescript
// apps/api/src/plugins/error-handler.ts
import { AppError } from '../lib/errors'

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    request.log.warn({ err: error, code: error.code }, error.message)
    return reply.status(error.statusCode).send(error.toJSON())
  }

  // Zod validation errors from tRPC/Fastify schema validation
  if (error.name === 'ZodError') {
    const fields = formatZodError(error)
    const appErr = new ValidationError(fields)
    return reply.status(400).send(appErr.toJSON())
  }

  // Unexpected errors — never leak internals
  request.log.error({ err: error }, 'Unhandled error')
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  })
})
```

Rules:
- Known errors → log at `warn`, return structured response.
- Unknown errors → log at `error` with full stack, return generic message. **Never expose stack traces, SQL errors, or internal paths to clients.**
- All error responses go through `toJSON()` — guarantees envelope consistency.

### Usage in Services

```typescript
// apps/api/src/modules/hex/hex.service.ts
export async function claimHex(userId: string, hexId: string) {
  const existing = await db.query.hexOwnership.findFirst({
    where: eq(hexOwnership.hexId, hexId),
  })

  if (existing) {
    throw new HexAlreadyClaimedError(hexId)
  }

  const balance = await getTokenBalance(userId)
  if (balance < CLAIM_COST) {
    throw new InsufficientBalanceError(CLAIM_COST, balance)
  }

  return db.insert(hexOwnership).values({ hexId, ownerId: userId }).returning()
}
```

No `try/catch` in services unless recovering — let errors propagate to the global handler.

---

## Client-Side Error Handling

Clients consume `ApiErrorCode` to show localized, user-friendly messages:

```typescript
// packages/api/src/error-messages.ts
import type { ApiErrorCode } from '@heyoo/types'

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  HEX_ALREADY_CLAIMED: 'This hex is already owned by someone else.',
  INSUFFICIENT_BALANCE: 'You don\'t have enough $LIGHTER tokens.',
  WALLET_NOT_CONNECTED: 'Connect your wallet to continue.',
  RATE_LIMITED: 'Slow down — try again in a moment.',
  UNAUTHORIZED: 'Please sign in to continue.',
  // ... exhaustive — TypeScript enforces every code has a message
}

export function getErrorMessage(code: ApiErrorCode): string {
  return ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.'
}
```

```typescript
// In a React component or hook
const mutation = api.hex.claim.useMutation({
  onError: (error) => {
    if (error.data?.code) {
      showToast(getErrorMessage(error.data.code))
    }
  },
})
```

Rules:
- **Never match on `message` strings** — they can change. Always match on `code`.
- The `ERROR_MESSAGES` map must be exhaustive — TypeScript will flag missing codes.
- Clients can add platform-specific overrides (TMA may show shorter messages).

---

## tRPC Integration

When using tRPC instead of raw Fastify routes, map `AppError` to `TRPCError`:

```typescript
// apps/api/src/lib/trpc-error-mapper.ts
import { TRPCError } from '@trpc/server'

const STATUS_TO_TRPC: Record<number, TRPCError['code']> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_CONTENT',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
}

export function toTRPCError(err: AppError): TRPCError {
  return new TRPCError({
    code: STATUS_TO_TRPC[err.statusCode] ?? 'INTERNAL_SERVER_ERROR',
    message: err.message,
    cause: err,
  })
}
```

The `AppError` travels in `cause` — the tRPC error handler on the client extracts `code` from it.

---

## Testing

- Add Vitest tests for services/routes. Prefer `app.inject()` tests over full e2e when possible.
- Assert on `error.code`, not `error.message` — messages are for humans, codes are for tests.

```typescript
it('should return HEX_ALREADY_CLAIMED when hex is taken', async () => {
  const res = await app.inject({
    method: 'POST',
    url: '/hex/claim',
    payload: { hexId: '891f1d48177ffff' },
    headers: { authorization: `Bearer ${token}` },
  })

  expect(res.statusCode).toBe(409)
  expect(res.json()).toMatchObject({
    success: false,
    error: { code: 'HEX_ALREADY_CLAIMED' },
  })
})
```

## Observability

- Log request IDs and error codes. Avoid logging PII or raw coordinates.
- Every error log includes: `{ code, statusCode, requestId, userId (hashed), path }`.

## Cross-References

- **Error Boundaries (client):** See `error-boundaries.md`
- **Database:** See `database-conventions.md`
- **Security:** See `security.md`
- **Coding Standards:** See `coding-standards.md`
- **Project Structure:** See `project-structure.md`