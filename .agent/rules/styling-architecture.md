---
trigger: always_on
---

# Styling Architecture (Heyoo)

## Core principle
No hardcoded values; prefer tokens and shared primitives. Keep styles platform-appropriate (web/TMA/Expo).

## Priorities
1) Use shared UI components (packages/ui) when available. 2) Use design tokens/CSS variables (web) or theme constants (native). 3) Utilities (Tailwind/classnames) for composition. Avoid inline styles except for dynamic layout tweaks.

## Tokens
- Centralize colors/spacing/typography in one place (web: globals.css/theme file; native: theme constants). Do not sprinkle literal hex values.

## Accessibility
- Maintain contrast; focus-visible states for interactive elements on web. Provide fallbacks for motion-sensitive users if animations are added.

## Performance and bundle
- Code-split heavy visual components (maps) on web/TMA. Avoid pulling large icon packs; tree-shake.

## Animations
- Keep motion subtle and purposeful; prefer CSS-based animations on web. Allow disabling if user prefers reduced motion.

## Cross-reference
- Components: `react-components.md`
- Standards: `coding-standards.md`
