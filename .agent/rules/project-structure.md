---
trigger: always_on
---

# Project Structure (Heyoo)

## Core principle
Keep the monorepo predictable and enforce boundaries. Apps live under `apps/`, shared code under `packages/`, and tooling at the root. Adjust names when we initialize, but follow this shape:

```
heyoo/
├── apps/
│   ├── web/            # Next.js web surface
│   ├── tma/            # Telegram Mini App (Vite + @telegram-apps/sdk-react)
│   ├── mobile/         # Expo React Native app
│   └── api/            # Backend API (Fastify/Node 22) — when added
├── packages/
│   ├── ui/             # Shared UI primitives (web/native-friendly)
│   ├── core/           # Shared logic (H3 utils, validators, storage, haptics)
│   ├── api/            # API client, shared request helpers
│   ├── types/          # Shared TypeScript types & Zod schemas
│   ├── maps/           # Map abstractions and geo utilities
│   ├── scanner/        # QR scanner abstractions
│   ├── blockchain/     # TON Connect, $LIGHTER token helpers
│   ├── eslint-config/  # Shared ESLint configurations
│   └── typescript-config/ # Shared tsconfig presets
├── skills/             # Domain skill references for AI agents
├── docs/               # Design/decisions (non-tokenomics)
├── .agent/             # Agent rules (this folder)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Apps (top-level responsibilities)
- Web (`apps/web`): Next.js web surface. Code-split heavy features (maps, QR, charts). Use absolute imports once tsconfig paths are set.
- TMA (`apps/tma`): Telegram Mini App via Vite + `@telegram-apps/sdk-react`. Target ES2020; initial JS bundle <650 KB (hard ceiling 1 MB). Shares UI/logic through packages.
- Mobile (`apps/mobile`): Expo SDK 55; platform adapters for QR/mapping isolated under `app/adapters/`. Keep parity with web via shared packages; no platform-specific logic in shared packages.
- API (`apps/api`): Fastify (ESM) on Node 22 when added; Drizzle for Postgres; Zod contracts pulled from `@heyoo/types`. No raw coordinates persisted—H3 hex IDs only.

## Packages (boundaries and expectations)
- `ui/`: Platform-aware UI primitives. Web-only APIs must be guarded. Provide themed tokens and light/dark surfaces. Keep components small and composable.
- `core/`: Cross-platform logic (H3 utilities, validators, formatting, storage helpers, haptics). No React imports here.
- `api/`: API client helpers, shared request/response utilities.
- `types/`: Zod schemas + TypeScript types for request/response shapes. Source of truth for API contracts; apps consume, API implements.
- `maps/`: Map rendering abstractions and geospatial service layer.
- `scanner/`: QR scanner abstractions with platform implementations.
- `blockchain/`: TON Connect utilities, $LIGHTER token interaction helpers.
- `eslint-config/`: Shared ESLint rule sets.
- `typescript-config/`: Shared tsconfig presets (base, Next.js, Expo, React library).

## Imports and Path Aliases
- Use workspace aliases (`@heyoo/ui`, `@heyoo/core`, `@heyoo/types`, `@heyoo/maps`, `@heyoo/scanner`, `@heyoo/blockchain`) once configured. Avoid `../../..` chains.
- Never import app code from another app. Shared code must live in `packages/`.
- Keep barrel files only for public package APIs; avoid internal barrels that create cycles.

## File Naming and Layout
- Components: `PascalCase.tsx`. Hooks: `use-*.ts` (kebab-case). Utils: `kebab-case.ts`.
- Zustand stores live in `core/store` or feature-local `store/` folders.
- Feature slices stay under their feature folder.
- Tests: colocate (`Component.test.tsx`) when scope is local; otherwise place under `__tests__/` mirroring structure.
- Assets: keep per-app under `apps/*/assets` unless truly shared; then place in `packages/ui/assets` with platform guards.

## Configuration and scripts
- Root `package.json` holds workspace scripts; app-specific scripts live in each app package.
- Turbo tasks: define build/test/lint pipelines per app in `turbo.json` with explicit outputs to speed caching.
- Env files: `.env` at root only for shared dev defaults; app-specific envs live beside each app (`apps/web/.env`, etc.). Never commit secrets.
- TypeScript: strict mode plus `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`. Avoid project references; use workspace protocol and package exports for linking.
- Platform resolution: use `.native.tsx` and `.web.tsx` for UI divergences; runtime detection for TMA vs regular web.

## Data and API Boundaries
- Contracts: all request/response schemas originate in `packages/types/`; consumers do not redefine shapes.
- Geospatial: only store and return H3 hex IDs and centers. No raw lat/lng in DB or responses.
- Feature ownership: each feature folder owns its state, queries, and UI; cross-feature utilities move to `packages/core/` after 3+ proven uses.

## Performance and bundle hygiene
- Lazy-load heavy surfaces (maps, QR scanner, charts). Do not pull map/QR code into the initial bundle.
- Keep files under ~300 lines; extract logic or components when growing.
- Prefer duplication over premature abstraction. Add shared helpers only after multiple call sites.

## Platform Abstractions (critical surfaces)
- Maps: shared interface in `packages/maps/` with platform files (`MapView.native.tsx` using `@maplibre/maplibre-react-native`, `MapView.web.tsx` using `maplibre-gl` or `react-map-gl`). Keep H3 math in `packages/core/`.
- QR scanning: shared component in `packages/scanner/` with platform files (`QRScanner.native.tsx` via `expo-camera`, `QRScanner.web.tsx` via web QR library or TMA `useScanQrPopup`).
- Storage: cross-platform storage abstraction (MMKV on native, localStorage for web/TMA) kept in `packages/core/storage` and consumed by Zustand persist.
- Haptics: adapters per platform (Expo Haptics, TMA WebApp HapticFeedback, noop web) under `packages/core/haptics`.

## Navigation split
- Native: Expo Router (file-based). Place layouts under `(tabs)/_layout.tsx`, etc.
- Web/TMA: `react-router-dom` or the equivalent shell; wire Telegram BackButton visibility and handlers per route depth. Keep screen components shared; only shells differ.

## Testing and Linting Placement
- Tests follow the code they verify; shared helpers tested in `packages/core/__tests__/`. UI components tested per app where they render.
- Lint rules centralized in `packages/eslint-config/`. No per-app overrides without justification.
- See `testing.md` for framework and pattern details.

## Contribution Checklist (structure-specific)
- New feature: create a feature folder under the owning app; add contracts in `packages/types/` if API-bound.
- New shared utility: place in `packages/core/`; add tests and ensure no React imports.
- New component intended for both platforms: put in `packages/ui/`, add platform guards, and document props.
- New environment variable: document in `.env.example` and keep out of shared packages. See `environment-config.md`.
- TMA change: verify bundle stays under 650 KB uncompressed; avoid heavy deps in the TMA path; validate BackButton behavior and safe-area handling.
