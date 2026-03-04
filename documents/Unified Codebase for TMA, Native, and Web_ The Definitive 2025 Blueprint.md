

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 1 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
Unified codebase for TMA + Native + Web: the definitive 2025 blueprint
Building a single codebase that ships to Telegram Mini App, native iOS/Android, and responsive web
is technically proven but has never been done at production scale for a complex app. The dev.family
team demonstrated feasibility with a React Native → react-native-web → TMA pipeline,  and X
(Twitter) proves RN Web works at massive scale on the web side. For $LIGHTER × Heyoo — with its
TON blockchain, H3 hex maps, QR scanning, and venue booking — the recommended stack is Expo SDK
54+ with Turborepo, Zustand, TanStack Query, and platform-abstracted service layers, achieving an
estimated 70–85% code sharing across all three targets. This report covers every architectural decision,
tool selection, and configuration needed to build it.
- Expo wins the framework race, but the TMA layer needs careful handling
After evaluating every viable framework — Expo + React Native Web, Solito 5, Tamagui, Capacitor/Ionic,
NativeScript, Lynx (ByteDance), and React Strict DOM — Expo + React Native Web emerges as the
clear winner for this use case. The key insight: a TMA is just a web app running inside Telegram's
WebView,  and Expo's web build output is standard HTML/JS/CSS that loads directly in
that WebView.
Framework comparison at a glance:
FrameworkTMA SupportNative FeelCode SharingBundle Size (web)Maturity
Expo + RN Web Proven★★★★★75–85%400–800KB gz★★★★★
Solito 5 Via Next.js★★★★★70–80%300–600KB gz★★★★
Tamagui (UI layer)★★★★★+5–10% on top+24KB core★★★★
Capacitor/Ionic Natural★★★95–100%200–500KB gz★★★★★
NativeScript No web★★★★★90% (mobile only)N/A★★★
Lynx (ByteDance) Too new★★★★★~70%N/A★★
React Strict DOM Too new★★★★★~85% (future)~2KB overhead★★
Capacitor/Ionic offers 95–100% code sharing because it's literally the same web app everywhere — but the
WebView-based rendering can't match native performance for complex game interactions,  H3
map rendering, and real-time location tracking. NativeScript has no web target at all, eliminating it
entirely. Lynx and React Strict DOM are promising but too immature for production outside their parent
companies.
The recommended architecture stacks Expo Router for native navigation, with the web build serving
## Dev
DEV Community +2
## Mobiloud

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 2 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
as both the responsive website and the TMA deployment target. Platform-specific file extensions
(.native.tsx, .web.tsx) handle UI divergence, while runtime detection distinguishes TMA from standalone
web:
Solito 5 (released October 2025) is the strong runner-up — it removed react-native-web from the web
rendering path entirely,  meaning the web/TMA output is pure HTML/CSS with zero RN overhead.
This lighter output is ideal for TMA's sub-650KB bundle requirement. For $LIGHTER × Heyoo, if SEO
matters for venue discovery pages, combining Expo for native with Next.js via Solito for web/TMA gives
the best of both worlds.
- Telegram Mini App constraints demand ruthless bundle discipline
TMA development has a set of hard technical constraints that must inform every architectural decision. The
most critical: initial JS bundle must stay under 650KB uncompressed for Mini App Store acceptance,
with a hard ceiling of 1MB. One production team achieved 580ms time-to-first-paint after aggressive
optimization; another had their 1.8MB bundle rejected.
The TMA WebView varies by platform: Android uses system Chromium WebView, iOS uses WKWebView
(Safari engine), and desktop uses embedded Chromium. Target ES2020 for JavaScript compilation —
ES2022 syntax fails on Telegram ≤10.7.  Standard CSS features including Flexbox, Grid, and
animations all work, but CSS env(safe-area-inset-*) does NOT work inside TMA.  Telegram
provides its own safe area system through WebApp.safeAreaInset and WebApp.contentSafeAreaInset
(Bot API 8.0+).
SDK choice matters significantly. Three options exist, with a clear winner:
telegram-web-app.js (official CDN script) — no TypeScript, no tree-shaking, old-school
@twa-dev/sdk v8.0.2 — NPM wrapper, but stale (~1 year without updates)
@telegram-apps/sdk-react v3.3.9 — the recommended choice: TypeScript-first, signal-based
reactivity, tree-shakable, actively maintained,  used in official templates
The @telegram-apps/sdk-react approach is particularly elegant for cross-platform apps because each
component (viewport, theme, back button, haptics) is a separate mountable module:
typescript
import { Platform } from 'react-native';
const isTMA = typeof window !== 'undefined' && !!window?.Telegram?.WebApp;
const isWeb = Platform.OS === 'web' && !isTMA;
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
## Callstack
## Puc-telegram
## Puc-telegram
GitHub
TelegramTelegram Mini Appstelegram
## UNPKG
npm
## Socket
## Telegram Mini Apps
typescript

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 3 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
TON Connect integration is mandatory — as of January 2025, Telegram requires all Mini Apps with
blockchain functionality to use TON Connect exclusively.  Use @tonconnect/ui-react v2.3.1,
which provides a drop-in <TonConnectButton /> component.  The manifest file must be publicly
accessible without CORS restrictions or CloudFlare proxying.
Bot API 8.0+ (November 2024) unlocked full-screen mode, accelerometer, gyroscope, geolocation, and
biometric auth.  Bot API 9.0+ added DeviceStorage (persistent local storage) and SecureStorage
for sensitive data.  These APIs expand what's possible inside TMA significantly — the platform is
no longer just for simple tap-to-earn games.
- The Turborepo monorepo structure that maximizes sharing
Turborepo + pnpm workspaces is the clear winner for monorepo orchestration. Benchmarks on a 10-
package monorepo show Turborepo at 2.8s cold build vs Nx at 8.3s (M2 MacBook, November 2025).
Nx offers advantages for very large enterprises  with 100+ packages, but
for a project of this scope, Turborepo's minimal configuration (~20 lines in turbo.json) and native Vercel
remote caching make it the pragmatic choice.
Recommended folder structure:
import { init, backButton, themeParams, viewport } from '@telegram-apps/sdk-react';
init();
backButton.mount();
themeParams.bindCssVars();  // Injects --tg-theme-bg-color, etc.
viewport.bindCssVars();     // Injects --tg-viewport-height
nadcab.com
npm
## The Open Network
## Telegram
## Telegram
DEV CommunityGeneralist Programmer
lighter-heyoo/
├── apps/
│   ├── mobile/              # Expo app → iOS + Android
│   ├── web/                 # Next.js or Vite → responsive web
│   └── tma/                 # Vite + @telegram-apps/sdk → TMA
├── packages/
│   ├── core/                # Business logic, hooks, stores (Zustand)
│   ├── ui/                  # Cross-platform UI components
│   ├── api/                 # tRPC router definitions, API client
│   ├── types/               # Shared TypeScript types (Zod schemas)
│   ├── blockchain/          # TON Connect + smart contract interactions
│   ├── maps/                # Platform-abstracted map components
│   │   ├── MapView.tsx             # Shared interface
│   │   ├── MapView.native.tsx      # @maplibre/maplibre-react-native
│   │   └── MapView.web.tsx         # react-map-gl + maplibre-gl-js
│   ├── scanner/             # Platform-abstracted QR scanner
│   │   ├── QRScanner.tsx           # Shared interface

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 4 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
The critical architectural pattern is platform abstraction through file extensions. Metro bundler resolves
.native.tsx for iOS/Android and .web.tsx for web (including TMA). For TMA-specific behavior within the
web build, use runtime detection rather than build-time splitting.
TypeScript must be configured in strict mode with all additional flags enabled. The base tsconfig.json
should include strict: true (which enables strictNullChecks, strictFunctionTypes, strictBindCallApply,
strictPropertyInitialization, noImplicitAny, noImplicitThis, alwaysStrict, and
useUnknownInCatchVariables) plus noUncheckedIndexedAccess, noImplicitOverride, noImplicitReturns,
noFallthroughCasesInSwitch, forceConsistentCasingInFileNames, and verbatimModuleSyntax. Turborepo's
documentation explicitly recommends against TypeScript project references — instead,  use
package.json exports fields with the workspace protocol and let Turborepo handle cross-package caching.
- State management: Zustand for client, TanStack Query for server
The state management decision is straightforward: Zustand (~3KB) for client state and TanStack Query
(~13KB) for server state. This combination works identically across React Native, web, and TMA with
zero platform-specific code.
Zustand's killer feature for this project is its built-in persist middleware with pluggable storage backends. A
single cross-platform storage abstraction handles the native/web divide:
│   │   ├── QRScanner.native.tsx    # expo-camera
│   │   └── QRScanner.web.tsx       # TMA useScanQrPopup / html5-qrcode
│   ├── platform/            # Platform detection + adaptive services
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared tsconfig bases
├── turbo.json
├── pnpm-workspace.yaml
## ├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/        # Path-specific Copilot rules
│   └── workflows/ci.yml
## └── .husky/pre-commit
## Turborepo
turborepo
typescript

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 5 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
For TanStack Query's offline-first capability, set networkMode: 'offlineFirst' globally so cached data is served
immediately while revalidation happens in the background. Use PersistQueryClientProvider with platform-
appropriate persisters (sync storage for web/TMA, async for native). On native, wire up @react-native-
community/netinfo to TanStack Query's onlineManager so it knows when the device goes offline.
WebSocket for real-time game state works across all three platforms — the native WebSocket API is
available in React Native, standard browsers, and Telegram's WebView. However, dev.family reports that
WebSocket in TMA "might require additional configuration." Test thoroughly on both iOS and Android
Telegram clients. Feed real-time updates directly into TanStack Query's cache via
queryClient.setQueryData() for seamless integration with the rest of the data layer.
For venue/location data, the offline-first pattern is especially important. Consider PowerSync (v1.29.0) for
complex offline scenarios — it syncs between SQLite on the client and PostgreSQL on the server with
automatic conflict resolution, and has both React Native and Web SDKs. Telegram's new DeviceStorage
API (Bot API 9.0) provides additional persistent storage within the TMA context.
- Navigation requires a split strategy between native and TMA
Navigation is the one area where full unification breaks down. Native apps use Expo Router (file-based
routing built on React Navigation v7), while TMA uses react-router-dom with @telegram-apps/react-
router-integration. Business logic and screen components can still be shared — only the navigation shell
differs.
import { StateStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
export const platformStorage: StateStorage = Platform.OS === 'web'
? {  // Web/TMA: localStorage
setItem: (name, value) => localStorage.setItem(name, value),
getItem: (name) => localStorage.getItem(name),
removeItem: (name) => localStorage.removeItem(name),
## }
: (() => {  // Native: MMKV (30–100x faster than AsyncStorage)
const { MMKV } = require('react-native-mmkv');
const storage = new MMKV();
return {
setItem: (name, value) => storage.set(name, value),
getItem: (name) => storage.getString(name) ?? null,
removeItem: (name) => storage.delete(name),
## };
## })();
## Telegram

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 6 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
Expo Router provides automatic deep linking for all file-based routes. Native deep links use Universal Links
(iOS) and App Links (Android) pointing to your domain. TMA deep links follow the https://t.me/yourbot?
startapp=venue_123 pattern — parse the start_param on initialization and map it to internal routes.
Telegram's BackButton requires explicit management. Unlike native apps where React Navigation
handles back gestures automatically, TMA requires mounting the back button, showing/hiding it based on
route depth, and handling click events manually:
Tab navigation works natively through Expo Router's (tabs)/_layout.tsx pattern. In TMA, implement custom
bottom tabs as React components — Telegram doesn't provide native tab support. The @telegram-
apps/telegram-ui library offers pre-designed components matching Telegram's native look.
- Maps and QR scanning need platform-abstracted service layers
Maps are the trickiest cross-platform challenge for this project. No single map library works well across
native, web, and TMA. The solution: MapLibre for native via @maplibre/maplibre-react-native, and
react-map-gl + maplibre-gl-js for web/TMA, wrapped in platform-specific files that expose the same
component interface.
H3 hexagon computation is fully shared — h3-js v4+ (550K weekly npm downloads) is pure JavaScript
and works identically in all environments. Use it to compute hexagon boundaries as GeoJSON,
then render them as polygon layers on whichever map component is active.  The hexagon math, game
logic, and territorial calculations live in packages/core/ with zero platform-specific code.
QR scanning follows a three-way split:
TMA: Use Telegram's native useScanQrPopup from @telegram-apps/sdk-react — best UX, no
permissions dialog
Native iOS/Android: Use expo-camera with onBarcodeScanned — integrated with Expo SDK, uses
telegram
## Telegram Mini Apps
typescript
import { backButton } from '@telegram-apps/sdk-react';
useEffect(() => {
backButton.mount();
if (location.pathname === '/') backButton.hide();
else backButton.show();
## }, [location.pathname]);
backButton.onClick(() => navigate(-1));
GitHub
## Greenash
CodeSandbox
## AFI

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 7 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
Native iOS/Android: Use expo-camera with onBarcodeScanned — integrated with Expo SDK, uses
VisionKit (iOS) and Google Code Scanner (Android)
Standalone web: Fall back to html5-qrcode using the browser's MediaDevices API
Wrap all three behind a <QRScanner /> component in packages/scanner/ that checks the runtime
environment and renders the appropriate implementation. This is the same pattern used for haptic feedback
— expo-haptics for native, WebApp.HapticFeedback for TMA, no-op for regular web.
- GitHub Copilot configuration for consistent, high-quality code
Claude Sonnet 4.6 is the best model for TypeScript/React Native code generation in GitHub Copilot as
of February 2026, scoring 79.6% on SWE-bench Verified and leading DevBench at 84.80% Pass@1. It
follows custom instructions more reliably than GPT-4.1 or Gemini alternatives. Use GPT-4.1 or o4-mini for
quick inline completions where speed matters more than quality.
The .github/copilot-instructions.md file should be concise  (under 1,000 lines),  use
imperative directives,  and include DO/DON'T code examples for critical patterns. Key rules to
enforce:
Never use any — always use unknown and narrow types
Import from @app/* aliases — never relative imports across packages
Server state in TanStack Query only — never store API data in Zustand
Platform-specific code stays in apps/ — shared packages must be platform-agnostic
React.memo() for list items, FlashList instead of FlatList, expo-image instead of <Image>
Path-specific instruction files (.github/instructions/react-native.instructions.md with applyTo: "apps/mobile/**"
frontmatter) allow different rules per app.  This is especially useful for enforcing TMA-specific
patterns in apps/tma/ versus native patterns in apps/mobile/.
Critical insight: Copilot instructions are best-effort, not enforced.  The real enforcement layer is
CI/CD — ESLint, TypeScript strict mode, and pre-commit hooks catch what Copilot misses. Copilot
guides; CI enforces.
- Code quality enforcement through automation, not willpower
Five layers of automated quality enforcement prevent "code garbage":
## 1.
ESLint flat config with typescript-eslint/strict, eslint-plugin-unused-imports (auto-removes unused
imports),  eslint-plugin-simple-import-sort (enforces import ordering:  React → third-
party → @app/* → relative), and eslint-plugin-check-file (enforces PascalCase for .tsx files, kebab-
case for .ts files, kebab-case for folders).
## Scanbot
GitHub DocsGitHub
GitHub
GitHub
GitHub
npmegghead.io
## Socket

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 8 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
## 2.
Prettier with opinionated defaults — single quotes, trailing commas, 100-char line width, LF line
endings. Combined with eslint-config-prettier to prevent rule conflicts.
## 3.
Husky + lint-staged pre-commit hooks that run ESLint fix and Prettier on staged files only,
plus TypeScript type-checking across the entire project. This catches errors before
they enter version control without slowing down development.
## 4.
Danger.js for automated PR review  — enforces PR descriptions (minimum 20
characters), warns on large PRs (>500 lines), flags missing tests when source files change,
catches console.log statements, and verifies lockfile consistency.
## 5.
GitHub Actions CI pipeline running lint, type-check, test, and build on every push/PR, with
Turborepo remote caching for speed. The pipeline builds all three targets: web + TMA (Vite/Next.js
build → Vercel deploy), and mobile (EAS Build → App Store/Play Store submission).
The eslint-plugin-check-file package (324K+ weekly downloads) is particularly valuable  — it
enforces naming conventions at the filesystem level,  ensuring component files are always
PascalCase and utility files are always kebab-case, regardless of what Copilot or developers generate.
- No production precedent exists — this is genuinely novel territory
No major production application currently ships TMA + native iOS/Android from a truly unified
codebase. Every TMA game in the TON ecosystem (Notcoin with 35M+ users, Hamster Kombat, TapSwap,
Catizen, Blum)  is web-only inside Telegram,  with no native mobile counterpart
from shared code. The dev.family experiment proved feasibility with a simple clicker app but stopped short
of production complexity.
The closest analogues come from different domains. X (Twitter) rebuilt its entire web experience with react-
native-web.  Shopify achieves 95% code sharing in background systems across its mobile apps.
Instagram reports 85–99% sharing between iOS and Android.  Discord shares core logic between
its React Native iOS app and React web app. But none of these target Telegram's WebView as a deployment
target.
Starter templates to build from:
create-t3-turbo — the most popular RN monorepo template (Expo + Next.js + Turborepo + tRPC +
NativeWind), actively maintained
byCedric/expo-monorepo-example — the "official" Expo monorepo reference by Expo's own
engineer
Official TMA reactjs-template — React + @telegram-apps/sdk + Vite + TON Connect, maintained
by the Telegram Mini Apps team
Solito starter — Expo + Next.js + Solito 5, best for teams wanting web-first with SSR
The practical approach: fork create-t3-turbo, add a apps/tma/ directory based on the official reactjs-
## Medium
## Medium
DEV Community
JavaScript in Plain English
@Upnxtblog
## Socket
GitHub
CoinSwitchFindMini.app
## Dev
## Medium
## Brainhub
GitHub
GitHub
GitHubGitHub
## Solito

28/2/26, 04:09Unified Codebase for TMA, Native, and Web: The Definitive 2025 Blueprint
Page 9 of 10https://claude.ai/chat/a4d08b11-c227-4c81-a5e0-139a63511711
The practical approach: fork create-t3-turbo, add a apps/tma/ directory based on the official reactjs-
template, and wire up the shared packages. This gives you a production-grade monorepo with tRPC type
safety, EAS Build for mobile, Vercel deployment for web/TMA, and established patterns for cross-package
code sharing.
Conclusion: the recommended stack and what makes it work
The full recommended technology stack for $LIGHTER × Heyoo:
LayerChoiceWhy
MonorepoTurborepo + pnpm 9Fastest builds, minimal config, free remote
caching
MobileExpo SDK 54+ (React Native 0.81+)New Architecture default, CNG, EAS ecosystem
WebNext.js 15+ or ViteSSR for venue discovery, API routes
TMAVite + @telegram-apps/sdk-react v3Lightest bundle, best TypeScript support
NavigationExpo Router (native) + react-router-dom (TMA)File-based routing + TMA BackButton integration
StylingNativeWind v4 (Tailwind for RN + Web)Single styling system across all platforms
Client StateZustand v53KB, no Provider, cross-platform persist
## Server
## State
TanStack Query v5 + tRPCOffline-first, type-safe end-to-end
Blockchain@tonconnect/ui-react v2+Mandatory for TMA, works on web too
MapsMapLibre (native + web) + h3-js v4Open-source, free, H3 compatible everywhere
QRexpo-camera (native) + TMA SDK (TMA)Platform-native scanning, best UX per target
AI DevGitHub Copilot Pro+ with Claude Sonnet 4.6Best TS quality, path-specific instructions
QualityESLint flat config + Prettier + Husky +
## Danger.js
Five automated enforcement layers
CI/CDGitHub Actions + EAS Build + VercelMulti-platform build from single pipeline
Three insights make this architecture work. First, the TMA is not a separate app — it's your web build
deployed to Telegram's WebView with an SDK initialization layer on top.
This collapses "three platforms" to "two builds" (native + web), with TMA being a runtime variant of web.
Second, platform abstraction happens at the service layer, not the component layer — maps, QR
scanning, haptics, and storage each get a thin adapter that dispatches to the platform-appropriate
DEV CommunityTelegram Mini Apps