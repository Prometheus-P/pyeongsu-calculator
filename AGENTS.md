# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts Astro pages, React islands (`components/`, `hooks/`, `contexts/`), calculator math in `utils/`, and shared styling under `styles/`.
- `public/` contains static assets; `docs/` and `specs/` summarize research decisions—skim the relevant spec before touching UX surfaces.
- `e2e/` holds Playwright journeys, while `coverage/`, `dist/`, and `test-results/` are build artifacts that should stay untouched.
- Central configuration lives in `astro.config.mjs`, `tsconfig.json`, and `tailwind.config.js`; tweak these instead of scattering overrides inside components.

## Build, Test, and Development Commands
- `npm run dev` — Astro dev server with React HMR; default port 4321.
- `npm run build` — `astro check` + production build; run before release branches.
- `npm run preview` — Serve the compiled site to validate SEO metadata.
- `npm run test`, `npm run test:run`, `npm run test:coverage` — Vitest interactive, headless, and coverage modes.
- `npm run test:e2e`, `npm run test:e2e:ui`, `npm run test:e2e:headed` — Playwright journeys in `e2e/`.
- `npm run lint` / `lint:fix` and `npm run format` / `format:check` — ESLint + Prettier; lint must be clean before opening a PR.

## Coding Style & Naming Conventions
- TypeScript, Astro, and TSX files follow Prettier defaults (2 spaces) and the ESLint config in `eslint.config.js`.
- Favor functional React components with hooks; colocate helper modules beside the component.
- Name React components in PascalCase (`FloorAreaCard.tsx`), hooks in camelCase with a `use` prefix, and Vitest specs as `*.test.ts(x)` near their source.
- Tailwind utilities should stay mobile-first; move repeating values into `src/styles/tokens.css`.

## Testing Guidelines
- Unit tests live near their modules (for example `src/App.test.tsx`) and should use Testing Library queries that mirror user intent (`getByRole`, `findByLabelText`).
- Guard coverage with `npm run test:coverage`; jsdom mocks are acceptable only for APIs missing in Vitest.
- Playwright specs in `e2e/` must assert viewport, locale, and SEO tags for the calculator funnel; capture videos (`--trace on`) when debugging CI.

## Commit & Pull Request Guidelines
- Follow Conventional Commits with scopes seen in history (`feat(converter): …`, `fix(ci): …`) and reference the issue or spec number when possible.
- PRs should explain the user story, list the commands you ran (unit/e2e), and attach screenshots for UI-visible changes; link updated docs/specs.
- Verify build, lint, unit, and e2e CI statuses before requesting review and keep changes tightly scoped to a single calculator concern.
