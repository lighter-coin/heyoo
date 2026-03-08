# CI/CD Standards

> Pre-action protocol: See CLAUDE.md §2.

trigger: GitHub Actions, CI, pipeline, deployment, `workflow`, `.github/workflows`

---

## Pipeline Stages (in order)

```
install → lint → check-types → test → build → deploy
```

Every stage must pass before the next runs. No skipping.

## GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm check-types
      - run: pnpm test
      - run: pnpm build
```

## Turborepo Caching in CI

- Enable **Remote Caching** via Vercel or self-hosted. Set `TURBO_TOKEN` and `TURBO_TEAM` as GitHub secrets.
- Turborepo skips unchanged packages automatically — respect this, never `--force` in CI without reason.
- `pnpm install --frozen-lockfile` — lockfile mismatch = CI failure. No auto-fixing in CI.

## TMA Bundle Size Gate

The TMA initial JS bundle must stay under **650 KB** uncompressed. Enforce in CI:

```yaml
- name: Check TMA bundle size
  run: |
    pnpm --filter tma build
    BUNDLE_SIZE=$(du -sb apps/tma/dist/assets/*.js | awk '{sum+=$1} END{print sum}')
    if [ "$BUNDLE_SIZE" -gt 665600 ]; then
      echo "❌ TMA bundle exceeds 650KB: ${BUNDLE_SIZE} bytes"
      exit 1
    fi
```

## Branch Strategy

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production-ready | Production |
| `develop` | Integration branch | Staging |
| `feat/*` | Feature work | Preview (optional) |
| `fix/*` | Bug fixes | Preview (optional) |
| `chore/*` | Non-functional changes | — |

## PR Requirements

- All CI checks pass (lint, types, test, build).
- At least 1 approval from a code owner.
- No merge commits — rebase or squash only.
- PR title follows Conventional Commits: `feat(auth): add TON wallet connect`.
- PR description: What changed, why, how to test, risks.

## Deployment

| App | Platform | Trigger |
|-----|----------|---------|
| `apps/web` | Vercel | Push to `main` |
| `apps/tma` | Vercel / custom hosting | Push to `main` |
| `apps/mobile` | EAS Build (Expo) | Manual or tag-triggered |
| `apps/api` (future) | Railway / Fly.io | Push to `main` |

## Rules

1. **Never push directly to `main`**. Always PR.
2. **CI must be green before merge**. No "I'll fix it after merge."
3. **Secrets via GitHub Secrets** — never in workflow files or env commits.
4. **Pin action versions** to commit SHA or major version (`@v4`), never `@latest`.
5. **Fail fast**: Put lint and type-check before build — they're cheaper.
