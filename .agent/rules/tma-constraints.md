# TMA Hardware & Bundle Constraints

## Bundle Size Discipline
- **Hard Limit:** The initial JS bundle MUST remain under 650KB uncompressed for Mini App Store acceptance.
- Avoid bulky libraries. Tree-shake everything.

## Compiler Constraints
- Target **ES2020** max. ES2022+ syntax fails on Telegram versions ≤10.7.

## Styling & Theme Constraints
- **NO `env(safe-area-inset-*)`**: Standard CSS safe areas do NOT work in TMA. You must use Telegram's `WebApp.safeAreaInset` and `WebApp.contentSafeAreaInset` (provided via Bot API 8.0+ / SDK).
- Telegram theme colors must be consumed directly from the SDK injects (`--tg-theme-bg-color`, etc.).

## Navigation & Routing Constraints
- React Navigation/Expo Router is for Native. TMA requires `react-router-dom`.
- The Telegram `BackButton` must be manually managed. You must mount it, check route depth, show/hide it dynamically, and bind standard back navigation to `backButton.onClick()`.