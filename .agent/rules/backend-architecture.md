---
trigger: always_on
---

# Backend Architecture (Heyoo)

## ⚠️ META-RULE
Before backend work: confirm `.agent/rules` exists; list applicable files (coding-standards, code-quality-workflow, project-structure, backend-architecture, database-conventions) and state them. After changes: run `pnpm lint`, fix errors, and verify against the request.

## Stack (when backend is added)
- Runtime: Node.js 22 LTS
- Framework: Fastify (ESM) or lightweight equivalent
- Language: TypeScript strict
- ORM: Drizzle ORM (PostgreSQL)
- Validation: Zod-based schemas in shared contracts
- Auth: TBD (wallet + anonymous session), avoid baking JWT until decided

## Principles
- Modular features: routes → handlers → services → db layer. Keep controllers thin; business logic in services.
- Type-safe everywhere: shared types in `packages/api-contracts`.
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

## Responses
Use a consistent envelope:
```
{ success: true, data, meta? }
{ success: false, error: { code, message, details? } }
```

## Error handling
- No swallowed errors; map to consistent codes. Use 4xx for client issues, 5xx for server.

## Testing
- Add Vitest tests for services/routes. Prefer inject tests over full e2e when possible.

## Observability
- Log request IDs and error codes. Avoid logging PII or raw coordinates.
      
      expect(response.statusCode).toBe(401)
      const body = response.json()
      expect(body.success).toBe(false)
      expect(body.error.code).toBe('AUTH_TOKEN_REQUIRED')
    })
  })
})
```

## Cross-References

- **Database:** See `rules/database-conventions.md`
- **Coding Standards:** See `rules/coding-standards.md`
- **Project Structure:** See `rules/project-structure.md`