# Geospatial Component Standards

## Separation of Concerns
- Map rendering logic MUST NEVER mix native and web APIs in the same file.
- Abstraction happens at the *service layer*, not the component layer. Create a generic `<MapView />` interface and implement `MapView.native.tsx` and `MapView.web.tsx` completely independently.
- **Math vs. Presentation:** All `h3-js` computations are presentation-agnostic and should run in pure hooks/utils inside the core package. No MapLibre or Mapbox GL code should leak into business logic.