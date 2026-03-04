# Turborepo & Monorepo Architecture

## Core Philosophy
- Use **Turborepo** + **pnpm workspaces** for minimal configuration and fastest builds.
- Favor standard package.json `exports` fields with the `workspace:*` protocol over complex TypeScript project references.

## Project Structure
- `apps/mobile/`: Expo app (iOS + Android)
- `apps/web/`: Next.js / Vite responsive web
- `apps/tma/`: Telegram Mini App (Vite + `@telegram-apps/sdk`)
- `packages/core/`: Business logic, hooks, stores
- `packages/ui/`: Cross-platform UI components
- `packages/types/`: Shared TypeScript types / Zod
- `packages/api/`: tRPC definitions, TanStack Query setup

## TypeScript Configuration
- Run in **strict mode** with all strict flags enabled (`strict: true`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`).
- Avoid TypeScript project references for Turborepo internal package sharing; let Turborepo handle caching.