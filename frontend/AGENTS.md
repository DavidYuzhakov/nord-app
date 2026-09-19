# Frontend guide

## Architecture

- Keep route composition in `src/App.tsx` and page-level orchestration in `src/pages/`.
- Put HTTP calls in `src/services/` through `src/api.ts`; do not call Axios directly from components.
- Put shared asynchronous state in typed Redux Toolkit slices under `src/store/`. Keep truly local form and interaction state inside components.
- Keep API-facing types in `src/models/` aligned with backend responses. Use the `@/` alias for `src/` imports.
- Reuse `src/components/ui/` primitives. That directory is intentionally excluded from frontend lint; avoid broad mechanical rewrites there.

## UI conventions

- Preserve the mobile-first layout, current Tailwind conventions, and both light and dark modes.
- Keep user-facing copy in Russian and preserve keyboard and touch accessibility. Interactive controls need semantic elements, labels where needed, and stable keys for rendered lists.
- For meaningful visual changes, verify the affected flow at a narrow mobile viewport and check dark mode. Also verify loading, empty, and error-relevant states affected by the change.
- Do not hard-code a new API origin in a component. Development and production API selection belongs in `src/api.ts` or Vite configuration.

## Tests and checks

Run from `frontend/`:

- `npm run lint` for static analysis.
- `npm test -- --run <path>` for focused Vitest tests, or `npm test -- --run` when a test suite exists.

Do not run `npm run build` automatically after coding. Run it only when the user explicitly asks for a build or when the task specifically diagnoses or changes production build behavior.

Place tests beside the code as `*.test.ts` or `*.test.tsx` and prefer Testing Library assertions on behavior over implementation details. The repository currently has no frontend tests; do not describe a no-tests exit as a passing test run.

## Review focus

- Check API/model drift, stale Redux loading state on rejected thunks, missing effect dependencies, list items without stable keys, inaccessible click-only elements, and regressions in mobile or dark-mode behavior.
