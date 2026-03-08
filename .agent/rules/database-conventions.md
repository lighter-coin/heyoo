---
trigger: always_on
---

# Database Conventions (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## Technology Stack

| Tool | Purpose |
|------|---------|
| **PostgreSQL 18** | Primary database |
| **Drizzle ORM 0.45.1** | Type-safe queries & schema definition |
| **Drizzle Kit 0.31.8** | Migration generation |
| **Redis 8** | Caching, sessions, rate limiting |

## Schema Location

```
apps/api/src/db/
├── schema/
│   ├── index.ts          # Re-exports all tables
│   ├── users.ts
│   ├── lighters.ts       # Lighter drops, ownership
│   ├── hex-ownership.ts  # H3 hex claim records
│   └── history.ts        # Action/event audit log
├── migrations/           # Generated SQL (never hand-edit existing)
├── seed/
│   └── index.ts          # Dev seed data
└── index.ts              # DB connection & client
```

## Tables & Columns
- Tables: plural `snake_case`. Junction tables: alphabetical `{a}_{b}`.
- Columns: `snake_case`. Foreign keys: `{referenced_table_singular}_id`.
- Timestamps: `created_at`, `updated_at` (trigger or app-managed). Use `deleted_at` for soft delete when needed.
- Indexes: `idx_{table}_{columns}`. Enums: `{table}_{column}_enum`.

## Column Types
- Primary keys: `uuid` (default random). Consider ULID if ordering matters.
- Monetary / token amounts: `numeric(12,2)`. Never use floats.
- Time: `timestamptz` only. Never `timestamp` without timezone.
- JSON: `jsonb` for localized fields or flexible metadata.

## Geospatial (Critical)
- **Store H3 hex IDs only.** Never store raw lat/lng coordinates.
- Include `hex_resolution` column when multiple resolutions coexist.
- Derive hex center coordinates at the application edge (API response layer), never persist them.

## Constraints & Indexing
- Columns `NOT NULL` by default; add `UNIQUE` where business logic requires.
- Use `CHECK` constraints for domain invariants (e.g., `CHECK (hex_resolution BETWEEN 5 AND 12)`).
- Index all foreign keys and frequent filter columns. Avoid over-indexing — measure before adding.

## Query Patterns

```typescript
// Select with filters
const recentLighters = await db
  .select()
  .from(lighters)
  .where(eq(lighters.status, 'active'))
  .orderBy(desc(lighters.createdAt))
  .limit(20)

// Insert and return
const [newLighter] = await db
  .insert(lighters)
  .values({ ownerId: userId, hexId, resolution: 12 })
  .returning()

// Transaction for multi-step writes
await db.transaction(async (tx) => {
  const [lighter] = await tx
    .insert(lighters)
    .values({ ownerId: userId, hexId, resolution: 12 })
    .returning()

  await tx.insert(history).values({
    lighterId: lighter.id,
    action: 'created',
    actorId: userId,
  })

  return lighter
})
```

- Always use the Drizzle query builder. Parameterize raw SQL when unavoidable.
- Wrap multi-step writes in transactions.

## Migrations
- Drizzle migrations versioned in repo. Never rewrite migration history.
- One migration per schema change. Make reversible when feasible.
- Commands: `pnpm db:generate` → `pnpm db:migrate` (or `pnpm db:push` for dev-only).

## Zod Integration
- Use `drizzle-zod` (`createInsertSchema`, `createSelectSchema`) to derive validation schemas from table definitions.
- Export these from the schema file for use in API route validation.

## Auditing
- For critical actions (token burns, ownership transfers, balance changes), insert audit rows with `actor_id`, `action`, `before_snapshot`, `after_snapshot`, and `timestamp`.

## Redis Usage
- Session storage and rate limiting.
- Short-lived caches for computed hex aggregations.
- Always set TTLs on cache keys. Never use Redis as a primary data store.

## Cross-references
- Backend: see `backend-architecture.md`
- Standards: see `coding-standards.md`
  const locked = await redis.hmget(lockKey, ...seatIds)
  
  return locked.every(v => v === null)
}
```

### Session Storage

```typescript
// Refresh tokens in Redis
await redis.set(`refresh:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7) // 7 days
```

## Best Practices

1. **Always use transactions** for operations spanning multiple tables
2. **Index foreign keys** and frequently filtered columns
3. **Use JSONB** for multilingual content, not separate tables
4. **Soft delete** for user data (KVKK compliance)
5. **Timestamps** on every table (`created_at`, `updated_at`)
6. **UUID primary keys** for security (no guessable IDs)
7. **Explicit NOT NULL** — avoid null unless truly optional
8. **Cascade deletes** only where logically appropriate

## Cross-References

- **Backend Architecture:** See `rules/backend-architecture.md`
- **Project Structure:** See `rules/project-structure.md`
