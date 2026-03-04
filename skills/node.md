# Node.js Skill (2026)

Runtime: Node.js 22 LTS (aligns with toolchain requirements for Expo/React Native and turbo 2.8.x). Package manager: pnpm >= 9.

## Rules
- ESM-first. Avoid CJS-only deps where possible.
- Tooling: turbo 2.8.13, TypeScript >= 5.5, ESLint 10, Prettier 3.8.
- Scripts: standard tasks per package (lint, test, typecheck, build). Use turbo pipelines with cache where safe.
- Avoid long-running global installs; keep everything local to repo.

## Testing
- Vitest for logic/web packages; Jest only if RN-specific.

## TBD
- Runtime target for backend APIs (if added): prefer edge-compatible TS/ESM; otherwise Node 22. Decide hosting later.
