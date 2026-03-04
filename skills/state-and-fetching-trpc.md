# State Management & tRPC Fetching

## Client State: Zustand
- Use **Zustand** (v5) for global client-side state.
- **NEVER** use Zustand to store server data.
- **Persistence:** Use Zustand's persist middleware with a custom cross-platform storage adapter:
  - Native: `react-native-mmkv`
  - Web/TMA: `localStorage` or Telegram DeviceStorage based on platform flags.

## Server State: TanStack Query + tRPC
- Use **TanStack Query** (v5) mapped through **tRPC**.
- **Offline-First:** Set `networkMode: 'offlineFirst'` globally. Use `PersistQueryClientProvider`.
- Inject real-time updates (from WebSockets or Telegram Bot events) directly into TanStack Query caches using `queryClient.setQueryData()`.