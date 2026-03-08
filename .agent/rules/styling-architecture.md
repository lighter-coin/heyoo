---
trigger: always_on
---

# Styling Architecture (Heyoo)

## Core Principle
No hardcoded values. Always use design tokens, shared primitives, or theme variables. Keep styles platform-appropriate (web/TMA/React Native).

## CSS Framework per Platform
- **Web / TMA:** Tailwind CSS (utility-first). Consume Telegram theme CSS variables (`--tg-theme-bg-color`, `--tg-theme-text-color`, etc.) in TMA surface.
- **React Native:** NativeWind (Tailwind for RN) or `StyleSheet.create()`. Prefer NativeWind for consistency with web tokens.
- **Shared tokens:** Centralize colors, spacing, radii, and typography in `packages/ui/theme`. Platform-specific application happens at the consumer level.

## Usage Priority
1. Shared UI components (`@heyoo/ui`) when available.
2. Design tokens / CSS variables (web) or theme constants (native).
3. Tailwind utility classes for composition.
4. Inline styles only for truly dynamic layout tweaks (e.g., computed positions).

## Class Composition
- Use `cn()` (or `clsx`/`twMerge`) to merge conditional classes.
- **Class ordering convention:** Layout → Sizing → Spacing → Typography → Visual → Interactive.

```tsx
// Example
<div className={cn(
  'flex items-center',        // Layout
  'w-full h-12',              // Sizing
  'px-4 py-2 gap-3',         // Spacing
  'text-sm font-medium',     // Typography
  'bg-zinc-900 rounded-lg',  // Visual
  'hover:bg-zinc-800',       // Interactive
  isActive && 'ring-2 ring-blue-500'
)} />
```

## Responsive Design
- **Mobile-first:** Write base styles for mobile, add `md:` / `lg:` overrides.
- **Breakpoints:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- TMA is always mobile-width; responsive breakpoints matter only for `apps/web`.

## No Arbitrary Values
- Avoid Tailwind arbitrary values like `w-[23px]`. Use the closest scale value. If a custom value is truly needed, add it to the Tailwind config as a named token.

## Dark/Light Mode Palette (Baseline)
**Dark Mode (Default — map and primary surfaces):**
- Bg: `bg-black` (main), `bg-zinc-900` (cards/surfaces)
- Primary: `bg-blue-600`
- Text: `text-white` (primary), `text-zinc-400` (muted)
- Border: `border-zinc-800`

**Light Mode:**
- Bg: `bg-white` (main), `bg-zinc-50` (cards/surfaces)
- Primary: `bg-blue-600`
- Text: `text-zinc-900` (primary), `text-zinc-500` (muted)
- Border: `border-zinc-200`

> Adapt to Heyoo brand colors as the design system matures. These are starting defaults.

## Accessibility
- Maintain WCAG AA contrast ratios. Use `text-zinc-100`+ on dark backgrounds.
- All interactive elements must have `:hover` and `:focus-visible` states.
- Respect `prefers-reduced-motion`: disable non-essential animations.

## Animations
- Keep motion subtle and purposeful.
- Web: prefer CSS transitions/animations. Native: `react-native-reanimated`.
- Always provide `prefers-reduced-motion` fallback.

## Performance and Bundle
- Code-split heavy visual components (maps, charts) on web/TMA.
- Avoid pulling large icon packs; tree-shake or use individual icon imports.

## Cross-reference
- Components: `react-components.md`
- Standards: `coding-standards.md`
