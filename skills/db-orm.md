# DB/ORM Skill (Draft)

We need a server-side store for history, holders, and geo ledgers. Recommended stack (2026):
- Database: PostgreSQL (managed: Supabase/Neon/RDS). Keep schemas small; index by h3_r12, holder_id, timestamps.
- ORM: Drizzle ORM (PostgreSQL). Reasons: type-safe, light footprint, works with ESM/Edge, solid migrations via drizzle-kit. Avoid Prisma for now to keep bundle/tooling light.
- Migrations: drizzle-kit, checked into repo; one schema package in the monorepo to share types.

Guidelines
- Keep DB access server-side only (no direct from TMA/web). Expose via API/edge functions.
- Model history as append-only commits (parent, holder, timestamp, h3_r12, payload, validity flags). Soft-holder state derived from latest commit.
- Store only hex IDs (no raw coords). Add plausibility metadata for GPS checks.
- Rate limit and audit log at the API layer; log failed plausibility checks.

TBD
- Hosting choice and region.
- AuthN/Z model for write APIs (anonymous session vs. wallet-linked later).
- Connection pooling strategy (pgBouncer/serverless adapter) depending on host.
- If offline cache is needed on client, decide later (e.g., expo-sqlite for ephemeral cache only).
