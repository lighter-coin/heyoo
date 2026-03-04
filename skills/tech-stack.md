# Tech Stack Skill (2026)
Quick reference for agents. Tokenomics is out of scope.

## Versions (minimums)
- Expo 55.0.4; React Native 0.84.1; React Native Web 0.21.2; Solito 5.0.0
- React 19.2.x; React DOM 19.2.x
- Query: @tanstack/react-query 5.90.21; State: Zustand 5.0.11
- Maps/geo: maplibre-gl 5.19.0; h3-js 4.4.0
- TON: @tonconnect/sdk 3.4.1; @tonconnect/ui 2.4.2
- QR: expo-barcode-scanner 13.0.1 (native/TMA); web pick one: @zxing/browser 0.1.5 or qr-scanner 1.4.2
- Testing: Vitest 4.0.18; Jest 30.2.0; @testing-library/react 16.3.2; @testing-library/react-native 13.3.3
- Tooling: turbo 2.8.13; pnpm >= 9; TypeScript >= 5.5; ESLint 10.0.2; Prettier 3.8.1

## Required practices
- Anonymous onboarding; optional TON Connect later. No wallet gate for first run.
- H3-only geo math; store/display hex center only. Unlock 1 r12/day (2/day gated later).
- Map starts dark; record r12 ownership and r11–r5 shareholding.
- Soft-holding with thresholds (TBD); Git-like history, last-3 default, “see all” available.
- TMA bundle target < 650 KB; lazy-load maplibre.
- Strict TS; no `any`; lint (ESLint 10) + format (Prettier 3.8).

## Turborepo bootstrap
- Command: `pnpm dlx create-turbo@latest` (pnpm + TS). Pin turbo to 2.8.13.
- Choose Expo starter if multi-surface; otherwise add Expo app after init.

## TBD knobs (non-tokenomics)
- Hold time, interaction count, GPS plausibility, rate limits, spam filters.
- “See all history” UX shape.
- Web QR library choice (pick one to avoid bundle bloat).
