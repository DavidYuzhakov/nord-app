# Repository Guidelines

## Project Structure & Module Organization

- `backend/`: NestJS and TypeScript API. Feature modules live in `src/song/` and `src/program/`; database integration lives in `src/prisma/`.
- `backend/prisma/`: PostgreSQL schema and migrations. Do not manually edit generated Prisma client files.
- `frontend/src/`: React application with pages, components, API services, Redux state, models, and utilities. Shared UI primitives live in `components/ui/`.
- `frontend/public/`: Static images, icons, and audio.
- `docker-compose.yml` and `nginx/`: Container orchestration and reverse-proxy configuration.

## Build, Formatting, and Development Commands

Run commands inside the relevant package; each has its own npm lockfile.

- `npm ci`: Install locked dependencies.
- Backend: `npx prisma generate` generates the database client; `npm run start:dev` starts the API with watch mode.
- Frontend: `npm run dev` starts Vite on port 5174.
- Either package: `npm run build` builds production output.
- `npm run lint`: Runs ESLint; the backend command also applies fixes.
- Backend: `npm run format` formats source and tests with Prettier.
- Frontend: `npm run format` formats supported files; `npm run format:check` checks without writing. Build output, coverage, and the lockfile are excluded.

The frontend development proxy currently targets the hosted API. Point it at the local backend before testing local API changes.

## Coding Style & Naming Conventions

Use TypeScript and two-space indentation. Both packages use Prettier with single quotes, trailing commas, and default semicolons. Follow each package's `.prettierrc`; some existing frontend files still use the previous style. Keep formatting changes scoped to the task.

Use NestJS suffixes such as `.controller.ts`, `.service.ts`, and `.dto.ts`. Name React components in PascalCase and hooks with a `use` prefix. Keep frontend API calls in `services/` and reuse existing UI primitives.

## Validation Guidelines

Tests are not implemented for either package; backend scaffold tests are placeholders. Do not run tests or coverage commands.

After code changes, run only ESLint and Prettier in affected packages:

- Backend: `npx eslint "{src,apps,libs,test}/**/*.ts"` and `npx prettier --check "src/**/*.ts" "test/**/*.ts"`.
- Frontend: `npm run lint` and `npm run format:check`.

Run builds or other validation only when explicitly requested.

## Commit & Pull Request Guidelines

Prefer the history’s `feat:`, `fix:`, `chore:`, and `style:` prefixes, with optional scopes such as `chore(backend):`.

PRs should explain behavior changes, list verification results, link relevant issues, and include screenshots for UI changes.

## Agent-Specific Instructions

Do not create or modify tests or documentation unless explicitly requested. Follow the validation policy; never run tests. Report changes and check results in chat.
