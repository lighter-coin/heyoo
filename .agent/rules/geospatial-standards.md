---
trigger: always_on
---

# Geospatial Standards (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## Core Rule: No Raw Coordinates
- **Never store, persist, or return raw lat/lng** in databases, API responses, or URL params.
- Accept lat/lng at ingestion (e.g., from device GPS), immediately convert to H3 hex ID, then discard raw coords.
- Display hex center coordinates in the UI — these are derived at render time from the hex ID, never stored.

## H3 Resolution Guide

| Resolution | Use Case | Approximate Area |
|-----------|----------|------------------|
| r12 | Individual lighter ownership (1 lighter = 1 r12 hex) | ~300 m² |
| r11 | Neighborhood-level aggregation | ~2,100 m² |
| r9 | District-level shareholding view | ~105,000 m² |
| r7 | City-level heat maps | ~5.2 km² |
| r5 | Regional overview | ~253 km² |

- **Ownership**: r12 hexes are the atomic unit. One lighter drop = one r12 hex claim.
- **Shareholding**: r11–r5 aggregations derived from r12 ownership counts. Never stored as separate ownership records — computed on read.
- Store `hex_resolution` alongside `hex_id` in the database when multiple resolutions coexist in the same table.

## Separation of Concerns

### Math vs Presentation
- All `h3-js` computations (hex resolution, neighbor lookups, boundary polygons, distance calculations) live in `packages/core/` or `packages/maps/` as pure functions/hooks.
- No MapLibre, Mapbox GL, or any rendering library code in business logic or utility files.
- Map rendering components consume pre-computed hex data — they don't compute it.

### Platform Split
- Map rendering MUST NEVER mix native and web APIs in the same file.
- Abstraction happens at the **service layer**, not the component layer:
  - `MapView.native.tsx` — `@maplibre/maplibre-react-native`
  - `MapView.web.tsx` — `maplibre-gl` or `react-map-gl`
- Shared interface defined in `packages/maps/`, platform implementations colocated.

## Coordinate Handling at API Boundaries

```
Client (GPS) → API ingestion → h3.latLngToCell(lat, lng, 12) → store hex_id only
                                                                      ↓
Client (display) ← API response ← h3.cellToLatLng(hex_id) ← derive center on read
```

- API endpoints that accept location input: validate lat/lng ranges, convert to H3 immediately in the handler, never pass raw coords deeper than the controller layer.
- API responses return `hexId` and optionally `center: [lat, lng]` (derived, not stored).

## Hex Boundary Rendering (MapLibre)
- Use `h3.cellToBoundary()` to get hex polygon coordinates for rendering.
- For large grids: only render hexes within the current map viewport. Use `h3.polygonToCells()` with the viewport bounding box to determine visible hexes.
- Apply viewport-based loading: fetch/render hex data only for the visible area + small buffer.
- Use GeoJSON source with `fill` + `line` layers for hex visualization. Update source data on viewport change, debounced (~200ms).

## Performance Considerations
- **Viewport culling**: Never render all hexes at once. Filter to viewport bounds.
- **Resolution switching**: At low zoom levels, aggregate to coarser resolutions (r9, r7) to reduce polygon count.
- **Debounce map events**: Viewport changes trigger data fetches — debounce to avoid thrashing.
- **Web Workers**: For large hex computations (>1000 cells), consider offloading `h3-js` calls to a Web Worker to avoid blocking the main thread.
- **Lazy-load map**: MapLibre is heavy (~200KB). Always lazy-load on web/TMA. Never include in the initial bundle.

## Cross-references
- Project structure: `project-structure.md` (platform abstractions)
- Components: `react-components.md` (code-splitting)
- TMA constraints: `tma-constraints.md` (bundle size)