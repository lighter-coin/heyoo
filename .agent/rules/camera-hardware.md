# Camera & Hardware Abstraction Rules

## QR Scanner Architecture
A unified `<QRScanner />` component must route to three specific platform implementations behind the scenes:
1. **TMA Target:** Use the Telegram native `useScanQrPopup` API from `@telegram-apps/sdk-react`. Do NOT request HTML5 camera permissions in the TMA WebView—this causes horrific UX and layout issues.
2. **Native Target (`.native.tsx`):** Use `expo-camera` with `onBarcodeScanned`. Relies on VisionKit (iOS) and Google Code Scanner (Android).
3. **Web Target (`.web.tsx`):** Fallback to `html5-qrcode` utilizing standard MediaDevices API.

## Haptic Feedback
Similar hardware rules apply—abstract haptics behind standard interfaces:
- Native: `expo-haptics`
- TMA: `WebApp.HapticFeedback`
- Web: Graceful no-op.