# Backend guide

## Architecture

- Keep controllers thin: parse transport input through DTOs and delegate business logic to services.
- Validate every external field with `class-validator`. The global `ValidationPipe` whitelists fields, rejects unknown fields, and transforms values.
- Access PostgreSQL through `PrismaService`; do not introduce ad-hoc SQL when Prisma expresses the operation clearly.
- Preserve Nest module boundaries under `src/song/`, `src/program/`, and `src/prisma/`. Use the `@/` alias for `src/` imports.
- Return the existing Russian domain error messages for user-visible failures unless the API contract is intentionally changing.

## Prisma workflow

- Edit `prisma/schema.prisma`, then run `npx prisma format` and `npx prisma generate`.
- Never edit `src/generated/prisma/` by hand and exclude it from review-only linting.
- For a schema change, create a new descriptive migration with `npx prisma migrate dev --name <name>` only against an appropriate development database. If no safe development database is available, stop after schema/generation checks and report that migration creation was not run.
- Never use `prisma db push` as a substitute for a committed migration unless the user explicitly asks for a disposable prototype workflow.
- Production migration deployment happens in the backend container startup. Do not run it from an ordinary coding task.

## Tests and checks

Run from `backend/`:

- `./node_modules/.bin/eslint "src/**/*.ts" "test/**/*.ts" --ignore-pattern "src/generated/**"` for read-only linting.
- `npm test -- --runInBand <path>` for focused Jest tests, or omit `<path>` for the full unit suite.
- `npm run test:e2e -- --runInBand` only when PostgreSQL and the required environment are available and the task affects API integration.

Do not run `npm run build` automatically after coding. Run it only when the user explicitly asks for a build or when the task specifically diagnoses or changes Nest production build behavior.

Do not use `npm run lint` merely to check work: the package script includes `--fix` and can rewrite files. Service tests should provide a mocked `PrismaService`; tests must not rely on a developer's real database unless they are explicitly integration tests.

## Review focus

- Check DTO validation, not-found handling, Prisma uniqueness errors, relation cleanup, transaction needs for multi-step writes, deterministic `ProgramSong.order`, and frontend contract compatibility.
- For changes that delete and recreate program-song relations, consider atomicity. A failure between steps must not silently leave a program partially updated.
