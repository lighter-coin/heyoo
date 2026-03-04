# Expo Skill (2026)

Versions: Expo 55.0.4; React Native 0.84.1; React Native Web 0.21.2; React 19.2.x; Solito 5.0.0 optional for web/native routing.

## Rules
- Use managed Expo where possible; bare only if a needed native module is missing.
- Keep TMA bundle < 650 KB compressed; lazy-load maplibre and heavy libs.
- QR on native/TMA: expo-barcode-scanner 13.0.1. Ask for camera permission; stop scanner on unmount.
- Maps: use maplibre-gl (via webview/native bridges) and h3-js for geo math; never expose raw coords (hex center only).
- Navigation: React Navigation 7.x; if Solito is used, keep routes aligned between web/native.
- TON: @tonconnect/sdk 3.4.1 + @tonconnect/ui 2.4.2 for wallet connect surfaces in TMA.

## Build/config
- Metro: ensure aliases match TS paths; avoid CJS-only deps.
- Hermes on mobile; verify library compatibility.
- EAS: pin SDK 55 in eas.json when added.

## Testing
- Jest for RN components if needed; RTL for RN (@testing-library/react-native 13.3.3). Logic tests can stay in Vitest if detached from RN APIs.

## TBD
- Decide Solito usage vs. standalone Expo Router/Next. Align routing strategy with Turborepo layout.
- Confirm maplibre integration path (native module vs. webview) for RN surface.