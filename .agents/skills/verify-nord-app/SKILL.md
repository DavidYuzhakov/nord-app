---
name: verify-nord-app
description: Verify changes in the Nord App React frontend, NestJS/Prisma backend, or Docker deployment. Use after implementing a feature or fix, before handing work back or preparing a review, and whenever the user asks to test, validate, or check changes in this repository.
---

# Verify Nord App

Validate only the surfaces affected by the change, expanding to both applications when an API contract crosses the boundary.

## 1. Establish scope

1. Read `git status --short`, `git diff --stat`, and the relevant diff.
2. Read the closest `AGENTS.md` for every touched path.
3. Classify the change as frontend, backend, Prisma schema, deployment, or cross-stack.
4. Preserve unrelated changes. Verification commands must not rewrite source files.

Always run `git diff --check` from the repository root.

## 2. Run relevant checks

### Frontend

Run from `frontend/`:

```bash
npm run lint
```

Do not run `npm run build` as a routine post-code check. Run it only when the user explicitly asks for a build or when the task is specifically about production build configuration, build failures, release, or deployment.

Find tests with `rg --files src -g '*.test.*' -g '*.spec.*'`. If tests exist, run focused tests first with `npm test -- --run <path>` and run the full suite when warranted. If none exist, report tests as not run; do not treat Vitest's “No test files found” exit as a pass.

For visible changes, exercise the affected flow in a browser at a narrow mobile viewport. Check both color modes when styling or theme behavior changed. Record what was inspected; do not claim visual QA from build output alone.

### Backend

Run from `backend/`:

```bash
./node_modules/.bin/eslint "src/**/*.ts" "test/**/*.ts" --ignore-pattern "src/generated/**"
```

Do not run `npm run build` as a routine post-code check. Run it only when the user explicitly asks for a build or when the task is specifically about Nest build configuration, build failures, release, or deployment.

Run focused Jest tests with `npm test -- --runInBand <path>`, then the full unit suite when warranted. The existing suite may fail during module resolution because Jest does not map `@/`; verify whether a failure matches that baseline or was introduced by the change.

If `prisma/schema.prisma` changed, also run:

```bash
npx prisma format
npx prisma validate
npx prisma generate
```

`prisma format` and `prisma generate` intentionally update derived files. Review the resulting diff and never hand-edit generated output. Do not create or apply a migration against an unknown database.

### Deployment

If Docker, Nginx, or Compose files changed, run `docker compose config --quiet` when Docker is available. Do not build, start, deploy, renew certificates, or touch volumes solely for verification unless the task requires it.

## 3. Diagnose results

- Compare failures with the dated baseline in the root `AGENTS.md`, but re-check rather than assuming it is current.
- Attribute a failure to the current change only when the diff or a before/after check supports that conclusion.
- Do not hide warnings, skipped tests, missing services, or unavailable environment variables.
- If a command mutates files, inspect the diff immediately and keep only expected generated or formatted changes.

## 4. Report

List each check as `passed`, `failed`, or `not run`, with the shortest useful reason. State any remaining risk, especially untested database behavior or visual flows. Never say the work is fully verified while a relevant check is failing.
