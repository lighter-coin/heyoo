# TypeScript Skill (2026)

Version: TypeScript >= 5.5 (align with React 19.2.x and RN/Expo SDK 55 toolchains). Package manager: pnpm.

## Rules
- Strict mode everything: no `any`, no type assertions unless unavoidable; enable `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`.
- Prefer interfaces for object shapes, type aliases for unions; use discriminated unions to make illegal states unrepresentable.
- Max 3 params per function; otherwise use an options object.
- Avoid ambient types; colocate types near usage.
- ESM first; avoid CJS shims. When consuming dual packages, prefer `exports` field with `import`.
- Target: align with Expo/React Native toolchain (Metro) and web bundlers (Vite/Next). Keep `moduleResolution` at `bundler`/`nodenext` depending on surface; document per-package.

## Testing and lint
- Use ESLint 10 with @typescript-eslint; Prettier 3.8 for format only.
- Tests: Vitest for web/logic; Jest for RN-specific parts if needed.

## Build constraints
- Tree-shake friendly imports; prefer named imports.
- No path aliases that break Metro unless mirrored in both TS config and babel/metro config.

## TODOs
- Finalize tsconfig presets per package (web, TMA, shared).