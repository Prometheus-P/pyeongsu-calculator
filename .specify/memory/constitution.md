<!--
- Version change: [none] → 1.0.0
- List of modified principles:
  - Added: I. User-Centric Design
  - Added: II. Progressive Enhancement
  - Added: III. Performance First
  - Added: IV. Code Quality
  - Added: V. Maintainability
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
-->
# Pyeongsu Calculator Constitution

## Core Principles

### I. User-Centric Design
All features and UI elements MUST prioritize the user's experience. This includes strict adherence to accessibility standards (WCAG AA), intuitive navigation, and providing clear visual feedback for all interactions, as defined by the Material 3 design system. The goal is to build a tool that is not only functional but also trustworthy and easy to use for everyone.

### II. Progressive Enhancement
The core functionality of the application—calculating conversions—MUST be available with only HTML and CSS. JavaScript SHOULD be used to enhance the user experience (e.g., real-time updates, theme switching) but not be a requirement for the application's primary purpose. This ensures the tool is resilient and accessible on all devices and network conditions.

### III. Performance First
The application MUST be fast and responsive. All technical decisions MUST prioritize performance, targeting minimal bundle size (<5KB increase for new features), fast page loads (Core Web Vitals), and smooth interactions (<300ms for animations). Performance is a core feature, not an afterthought.

### IV. Code Quality
Code MUST be clean, readable, and consistent. This is enforced through mandatory adherence to project-defined linting (ESLint) and formatting (Prettier) rules. All code MUST pass automated checks before being merged.

### V. Maintainability
The codebase MUST be easy to understand and modify. This is achieved by centralizing configuration (e.g., design tokens in `tailwind.config.js`), writing clear and concise documentation for new features, and following a consistent project structure. The goal is to lower the barrier for future development and collaboration.

## Development Workflow

All new features or significant changes MUST follow the `spec-plan-tasks` workflow. A feature specification (`spec.md`), implementation plan (`plan.md`), and task list (`tasks.md`) are required before implementation begins. This ensures clarity, alignment, and quality.

## Quality Gates

- **Linting & Formatting**: All code MUST pass `npm run lint` and `npm run format:check` without errors.
- **Testing**: All new features MUST be accompanied by appropriate tests (Unit, E2E). All tests MUST pass (`npm run test:all`).
- **Constitution Compliance**: All implementation plans MUST be checked against the Core Principles defined in this constitution.

## Governance

This constitution is the single source of truth for project standards and supersedes all other practices. Amendments require a formal proposal, review, and an update to this document, including a version bump and an entry in the amendment history. All code reviews MUST verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2025-12-03 | **Last Amended**: 2025-12-03