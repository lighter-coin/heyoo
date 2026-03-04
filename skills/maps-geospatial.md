# Maps & Geospatial Architecture

## Map Component Abstraction
Maps must be abstracted into platform-specific files exposing a unified interface:
- **Native (iOS/Android):** Code in `.native.tsx` using `@maplibre/maplibre-react-native`.
- **Web/TMA:** Code in `.web.tsx` using `react-map-gl` + `maplibre-gl-js`.

## H3 Hexagons
- Use `h3-js` (v4+) for all hexagon calculations. It is pure JavaScript and runs consistently across all environments.
- Keep all hexagon math, rules, and territorial logic in `packages/core/` (zero platform-specific code).
- Render calculated H3 boundaries as GeoJSON polygon layers dynamically onto the map views.