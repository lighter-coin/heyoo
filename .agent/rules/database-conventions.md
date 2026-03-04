---
trigger: always_on
---

# Database Conventions (Drizzle ORM)

## 🎯 Core Principle

**Type-safe queries, explicit migrations, and consistent naming. PostgreSQL-first design.**

## Technology Stack

| Tool | Purpose |
|------|---------|
| **PostgreSQL 18** | Primary database |
| **Drizzle ORM 0.45.1** | Type-safe queries |
| **Drizzle Kit 0.31.8** | Migrations |
| **Redis 8** | Caching, seat locks, sessions |

## Schema Location

All schema definitions live in `apps/api/src/db/schema/`:

```
apps/api/src/db/
├── schema/
│   ├── index.ts          # Re-exports all tables
│   ├── users.ts
│   ├── theaters.ts
│   ├── venues.ts
│   ├── events.ts
│   ├── seats.ts
│   ├── orders.ts
│   └── tickets.ts
├── migrations/           # Generated SQL migrations
├── seed/
│   └── index.ts          # Development seed data
└── index.ts              # Database connection
```

## Table Naming

- **Tables:** `snake_case`, plural (e.g., `theater_companies`)
- **Columns:** `snake_case` (e.g., `created_at`)
- **Foreign keys:** `{referenced_table_singular}_id` (e.g., `theater_company_id`)
- **Indexes:** `idx_{table}_{columns}` (e.g., `idx_events_date`)
- **Enums:** `{table}_{column}_enum` (e.g., `event_status_enum`)

## Schema Definition Pattern

```typescript
// db/schema/events.ts
import { pgTable, uuid, varchar, timestamp, jsonb, decimal, boolean, index } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { theaterCompanies } from './theaters'
import { venues } from './venues'

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  # Database Conventions (Heyoo)

  ## ⚠️ META-RULE
  Before DB work: confirm `.agent/rules` exists; list applicable files (coding-standards, code-quality-workflow, backend-architecture, database-conventions) and state them. After changes: run `pnpm lint`, fix errors, and verify against the request.

  ## Tables & columns
  - Tables: plural snake_case. Junctions: alphabetical `{a}_{b}`.
  - Columns: snake_case; FKs as `{table}_id`.
  - Timestamps: `created_at`, `updated_at` (trigger or app-managed). Use `deleted_at` for soft delete when needed.

  ## Types
  - Prefer `uuid` PKs; consider ULID if ordering is needed.
  - Monetary: `numeric(12,2)`; avoid floats.
  - Time: `timestamptz` only.
  - JSON: `jsonb` for localized or flexible fields.

  ## Geo
  - Store H3 hex IDs; do not store raw lat/lng. Include hex resolution field when helpful. Derive centers at the edge, not persisted.

  ## Constraints & indexing
  - Not null by default; unique where business needs. Use check constraints for domain limits (counts, ranges).
  - Index FKs and frequent filters; avoid over-indexing.

  ## Migrations
  - Drizzle migrations versioned in repo; never rewrite history. New migration per change; reversible when feasible.

  ## Query patterns
  - Use Drizzle query builder; parameterize raw SQL when unavoidable. Wrap multi-step writes in transactions.

  ## Auditing
  - For critical actions (balances, token ops), add audit rows with who/what/when and before/after snapshots when feasible.
```typescript
// Select with filters
const publishedEvents = await db
  .select()
  .from(events)
  .where(eq(events.status, 'published'))
  .orderBy(desc(events.eventDate))
  .limit(20)

// Insert and return
const [newEvent] = await db
  .insert(events)
  .values({ ...eventData })
  .returning()

// Update
await db
  .update(events)
  .set({ status: 'cancelled', updatedAt: new Date() })
  .where(eq(events.id, eventId))

// Delete
await db
  .delete(events)
  .where(eq(events.id, eventId))
```

### Joins

```typescript
// Join with relations
const eventsWithTheater = await db
  .select({
    event: events,
    theater: theaterCompanies
  })
  .from(events)
  .innerJoin(theaterCompanies, eq(events.theaterCompanyId, theaterCompanies.id))
  .where(eq(events.status, 'published'))
```

### Transactions

```typescript
// Use transactions for multi-table operations
await db.transaction(async (tx) => {
  // Lock seats
  await tx
    .update(seats)
    .set({ status: 'reserved', reservedBy: userId })
    .where(inArray(seats.id, seatIds))
  
  // Create order
  const [order] = await tx
    .insert(orders)
    .values({ userId, eventId, totalAmount })
    .returning()
  
  return order
})
```

## Migrations

### Generate Migration

```bash
# After modifying schema
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema (dev only - no migration file)
pnpm db:push
```

### Migration Naming

Migration files are auto-named by Drizzle Kit:
- `0001_initial_schema.sql`
- `0002_add_events_table.sql`

### Manual Migrations

For complex changes, create manual SQL:

```sql
-- migrations/0003_add_search_index.sql
CREATE INDEX CONCURRENTLY idx_events_search 
ON events USING GIN (to_tsvector('simple', title::text || ' ' || description::text));
```

## Seeding

```typescript
// db/seed/index.ts
import { db } from '../index'
import { theaterCompanies, venues, events } from '../schema'

async function seed() {
  console.log('🌱 Seeding database...')
  
  // Clear existing data (dev only!)
  await db.delete(events)
  await db.delete(venues)
  await db.delete(theaterCompanies)
  
  // Insert theaters
  const [theater] = await db
    .insert(theaterCompanies)
    .values({
      slug: 'diyarbakir-sehir-tiyatrosu',
      name: {
        ku: 'Şanoya Bajêr a Amedê',
        tr: 'Diyarbakır Şehir Tiyatrosu',
        en: 'Diyarbakır City Theater'
      }
    })
    .returning()
  
  // ... more seed data
  
  console.log('✅ Seeding complete')
}

seed()
  .catch(console.error)
  .finally(() => process.exit())
```

## Redis Usage

### Seat Locking

```typescript
// lib/seat-lock.ts
import { redis } from '@/config/redis'

const LOCK_TTL = 600 // 10 minutes

export async function lockSeats(eventId: string, seatIds: string[], userId: string) {
  const lockKey = `lock:${eventId}`
  const reservationId = crypto.randomUUID()
  
  // Use Redis transactions
  const pipeline = redis.multi()
  
  for (const seatId of seatIds) {
    pipeline.hset(lockKey, seatId, JSON.stringify({ userId, reservationId }))
  }
  
  pipeline.expire(lockKey, LOCK_TTL)
  await pipeline.exec()
  
  return { reservationId, expiresAt: Date.now() + LOCK_TTL * 1000 }
}

export async function isSeatsAvailable(eventId: string, seatIds: string[]) {
  const lockKey = `lock:${eventId}`
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
