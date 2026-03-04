---
trigger: always_on
---

# Project Structure (Heyoo)

## Core principle
Keep the monorepo predictable and enforce boundaries. Apps live under `apps/`, shared code under `packages/`, and tooling at the root. Adjust names when we initialize, but follow this shape:

```
heyoo/
├── apps/
│   ├── web/            # Web/TMA surface (can be Expo Web or Next.js)
│   ├── mobile/         # Expo app (if separate from web)
│   └── api/            # Backend API (Fastify/Node 22) when added
├── packages/
│   ├── ui/             # Shared UI primitives (web/native-friendly)
│   ├── lib/            # Shared logic (H3 utils, validators)
│   ├── api-contracts/  # Shared types/schemas
│   └── config/         # Shared TS/ESLint configs
├── docs/               # Design/decisions (non-tokenomics)
├── .agent/             # Agent rules (this folder)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Apps (top-level responsibilities)
- Web/TMA (`apps/web`): primary surface; code-split heavy features (maps, QR, charts). Keep TMA shell separate from feature modules. Use absolute imports once tsconfig paths are set.
- Mobile (`apps/mobile`): Expo SDK 55; platform adapters for QR/mapping isolated under `app/adapters/`. Keep parity with web via shared packages; no platform-specific logic in shared packages.
- API (`apps/api`): Fastify (ESM) on Node 22 when added; Drizzle for Postgres; Zod contracts pulled from `packages/api-contracts`. No raw coordinates persisted—H3 hex IDs only.
- TMA delivery: TMA is a runtime variant of web. If a dedicated shell is needed, add `apps/tma` with Vite + `@telegram-apps/sdk-react` but keep shared UI/logic in packages. Target ES2020; initial JS bundle <650 KB (hard ceiling 1 MB) for TMA acceptance.

## Packages (boundaries and expectations)
- `ui/`: platform-aware primitives; web-only APIs must be guarded. Provide themed tokens and light/dark surfaces. Keep components small and composable.
- `lib/`: cross-platform logic (H3 utilities, validators, formatting, storage helpers). No React imports here.
- `api-contracts/`: Zod + TypeScript types for request/response schemas. This is the source of truth for API shapes; apps consume, API implements.
- `config/`: shared TS/ESLint/Prettier/turbo configs; no runtime code.

## Imports and path aliases
- Use workspace aliases (e.g., `@heyoo/ui`, `@heyoo/lib`, `@heyoo/api-contracts`) once configured. Avoid `../../..` chains.
- Never import app code from another app. Shared code must live in `packages/`.
- Keep barrel files only for public package APIs; avoid internal barrels that create cycles.

## File naming and layout
- Components: `PascalCase.tsx`. Hooks/utils: `kebab-case.ts`. Zustand stores live in `lib/store`. Feature slices stay under their feature folder.
- Tests: colocate (`Component.test.tsx`) when scope is local; otherwise place under `__tests__/` mirroring structure.
- Assets: keep per-app under `apps/*/assets` unless truly shared; then place in `packages/ui/assets` with platform guards.

## Configuration and scripts
- Root `package.json` holds workspace scripts; app-specific scripts live in each app package.
- Turbo tasks: define build/test/lint pipelines per app in `turbo.json` with explicit outputs to speed caching.
- Env files: `.env` at root only for shared dev defaults; app-specific envs live beside each app (`apps/web/.env`, etc.). Never commit secrets.
- TypeScript: strict mode plus `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`. Avoid project references; use workspace protocol and package exports for linking.
- Platform resolution: use `.native.tsx` and `.web.tsx` for UI divergences; runtime detection for TMA vs regular web.

## Data and API boundaries
- Contracts: all request/response schemas originate in `packages/api-contracts`; consumers do not redefine shapes.
- Geospatial: only store and return H3 hex IDs and centers. No raw lat/lng in DB or responses.
- Feature ownership: each feature folder owns its state, queries, and UI; cross-feature utilities move to `packages/lib` after 3+ proven uses.

## Performance and bundle hygiene
- Lazy-load heavy surfaces (maps, QR scanner, charts). Do not pull map/QR code into the initial bundle.
- Keep files under ~300 lines; extract logic or components when growing.
- Prefer duplication over premature abstraction. Add shared helpers only after multiple call sites.

## Platform abstractions (critical surfaces)
- Maps: shared interface in `packages/ui/maps/MapView.tsx` with platform files (`MapView.native.tsx` using `@maplibre/maplibre-react-native`, `MapView.web.tsx` using `maplibre-gl` or `react-map-gl`). Keep H3 math in `packages/lib`.
- QR scanning: shared component in `packages/ui/scanner/QRScanner.tsx` with platform files (`QRScanner.native.tsx` via `expo-camera`, `QRScanner.web.tsx` via `qr-scanner` or TMA `useScanQrPopup`).
- Storage: cross-platform storage abstraction (MMKV on native, localStorage for web/TMA) kept in `packages/lib/storage` and consumed by Zustand persist.
- Haptics: adapters per platform (Expo Haptics, TMA WebApp HapticFeedback, noop web) under `packages/lib/haptics`.

## Navigation split
- Native: Expo Router (file-based). Place layouts under `(tabs)/_layout.tsx`, etc.
- Web/TMA: `react-router-dom` or the equivalent shell; wire Telegram BackButton visibility and handlers per route depth. Keep screen components shared; only shells differ.

## Testing and linting placement
- Tests follow the code they verify; shared helpers tested in `packages/lib/__tests__`. UI components tested per app where they render.
- Lint rules centralized in `packages/config`. No per-app overrides without justification.

## Contribution checklist (structure-specific)
- New feature: create a feature folder under the owning app; add contracts in `packages/api-contracts` if API-bound.
- New shared utility: place in `packages/lib`; add tests and ensure no React imports.
- New component intended for both platforms: put in `packages/ui`, add platform guards, and document props.
- New environment variable: document expected usage in the app README and keep out of shared packages.
- TMA change: verify bundle stays under 650 KB uncompressed; avoid heavy deps in the TMA path; validate BackButton behavior and safe-area handling.
