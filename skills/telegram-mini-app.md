# Telegram Mini App (TMA) Development

## Platform Context
- A TMA is essentially a web app running inside Telegram's WebView.
- Always use `@telegram-apps/sdk-react` v3+ (TypeScript-first, tree-shakable).
- Use `vite` + `@telegram-apps/sdk-react` for the lightest possible bundle.

## Environment Detection
Abstract environment logic safely:
```typescript
import { Platform } from 'react-native';
export const isTMA = typeof window !== 'undefined' && !!window?.Telegram?.WebApp;
export const isWeb = Platform.OS === 'web' && !isTMA;
export const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
```

## Storage & Setup
- Initialize the SDK (`init()`) and explicitly mount components like `backButton`, `themeParams`, and `viewport`.
- Bind CSS variables properly (`themeParams.bindCssVars()`, `viewport.bindCssVars()`).
- Use Telegram's `DeviceStorage` for persistent storage when inside the TMA.