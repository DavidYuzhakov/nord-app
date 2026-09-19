# Nord App repository guide

## Repository map

- `frontend/` is a React 19, Vite, strict TypeScript, Redux Toolkit, Tailwind CSS application. The user-facing copy is Russian and the layout is primarily mobile-oriented.
- `backend/` is a NestJS 11 REST API using Prisma 7 and PostgreSQL.
- `docker-compose.yml`, `nginx/`, and the two Dockerfiles describe production deployment. Deployment is not part of ordinary feature work.
- Each application has its own `package-lock.json`. Run npm commands from the application directory; there is no root npm workspace.

Read the nearest nested `AGENTS.md` before changing files below `frontend/` or `backend/`.

## Working agreements

- Keep changes scoped to the request and preserve unrelated user changes.
- Follow existing module boundaries. A typical cross-stack feature flows through the backend DTO/controller/service, the frontend model/service, Redux state when shared state is needed, and finally the page or component.
- Keep API request and response shapes synchronized across backend DTOs, Prisma data, frontend models, and frontend services.
- Reuse existing UI primitives from `frontend/src/components/ui/` and existing helpers before adding a dependency or a new abstraction.
- Ask before adding or upgrading production dependencies. Use `npm install` so the relevant lockfile stays synchronized.
- Do not deploy, change certificates/domains, run production migrations, or operate production services unless the user explicitly asks.

## Data and security

- Never print, commit, or overwrite `backend/.env`. Refer to required variables by name only; `DATABASE_URL` is required by Prisma.
- Never hand-edit `backend/src/generated/prisma/`; regenerate it from `backend/prisma/schema.prisma`.
- Preserve existing migrations. Schema changes need a new migration rather than editing a migration that may already have been applied.
- Avoid destructive database and Docker volume operations unless the user explicitly requests them and the exact target has been verified.

## Product invariants

- User-visible copy remains Russian unless the task says otherwise.
- A program's song order is meaningful and is stored as one-based `ProgramSong.order`; preserve it in writes and reads.
- A song can occur only once in a program (`@@unique([programId, songId])`).
- Song search ranks name matches before text-only matches and must not return duplicates.
- Keep date values compatible with the backend `IsDateString` validation and the frontend's ISO-string handling.

## Verification and handoff

- Use the repository skill `$verify-nord-app` after implementation and before claiming completion.
- Prefer checks for the touched application first, then broader checks when the change crosses boundaries or affects deployment.
- Do not run frontend or backend production builds automatically after writing code. Run a build only when the user explicitly requests it or when diagnosing a build, release, or deployment task whose result cannot be verified without it.
- Report every check as passed, failed, or not run. Separate failures introduced by the change from known baseline failures.

Baseline observed on 2026-09-19:

- Both `frontend` and `backend` builds pass.
- Frontend lint passes with one existing `react-hooks/exhaustive-deps` warning in `src/pages/SongsPage.tsx`.
- Frontend has no test files, so `npm test -- --run` exits with code 1.
- Backend Jest fails before running tests because the `@/` alias is not mapped in Jest.
- The backend package lint script uses `--fix` and also lints generated Prisma files. For read-only verification, use the command in `backend/AGENTS.md`.

Treat this baseline as diagnostic context, not as permission to add new failures. Re-run relevant checks and mention if the baseline has changed.

## Code review rules

- Flag unsynchronized API contract changes, missing validation for external input, unstable song ordering, duplicate program songs, accidental edits to generated Prisma code, leaked secrets, and destructive migration/deployment behavior.
- For bug fixes, prefer a focused regression test when the affected test layer is runnable. If an existing harness issue prevents the test, explain that limitation precisely.
