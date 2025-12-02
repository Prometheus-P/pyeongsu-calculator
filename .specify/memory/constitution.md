<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (Initial ratification)

Modified principles: N/A (Initial creation)

Added sections:
- Core Principles (5 principles)
- Technology Standards
- Development Workflow
- Governance

Removed sections: N/A

Templates requiring updates:
- .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
- .specify/templates/spec-template.md ✅ (User scenarios align with UX-first principle)
- .specify/templates/tasks-template.md ✅ (Test-first workflow compatible)

Follow-up TODOs: None
-->

# Pyeongsu Calculator Constitution

## Core Principles

### I. User Experience First

All features MUST prioritize the end-user experience above implementation convenience.

- Real-time conversion feedback MUST be immediate (< 100ms perceived latency)
- Mobile responsiveness MUST be maintained across all viewport sizes (320px to 1920px+)
- Interface MUST be intuitive without requiring instructions or documentation
- Error states MUST provide clear, actionable feedback in Korean
- Accessibility MUST meet WCAG 2.1 AA standards minimum

**Rationale**: As a public utility calculator, the primary value proposition is seamless, friction-free conversion. Technical elegance means nothing if users struggle with the interface.

### II. Type Safety

TypeScript strict mode MUST be enforced across all source files.

- No `any` types except where explicitly justified with inline comments
- All component props MUST have explicit type definitions
- Utility functions MUST have full input/output type coverage
- API responses and external data MUST be validated at boundaries

**Rationale**: Type safety prevents runtime errors that would break the calculator's core functionality and ensures maintainability as the codebase evolves.

### III. Test Coverage

All business logic and user interactions MUST have corresponding tests.

- Unit tests (Vitest) MUST cover all conversion utilities with edge cases
- Component tests MUST verify user interaction flows
- E2E tests (Playwright) MUST validate critical user journeys
- Test coverage MUST NOT decrease with new changes
- New features require tests BEFORE implementation (TDD encouraged)

**Rationale**: A calculator's correctness is its fundamental promise. Incorrect conversions would destroy user trust instantly.

### IV. Accessibility

The application MUST be usable by all users regardless of ability.

- All interactive elements MUST be keyboard navigable
- Form inputs MUST have proper labels and ARIA attributes
- Color contrast MUST meet WCAG AA standards (4.5:1 for normal text)
- Focus states MUST be clearly visible
- Screen reader compatibility MUST be verified

**Rationale**: Public utility tools have a responsibility to be accessible to everyone, including users with disabilities.

### V. Performance

The application MUST load and respond quickly on all devices and network conditions.

- Initial page load MUST complete in < 3 seconds on 3G networks
- Largest Contentful Paint (LCP) MUST be < 2.5 seconds
- Cumulative Layout Shift (CLS) MUST be < 0.1
- Bundle size MUST be monitored and justified for any significant increases
- Astro islands architecture MUST be leveraged to minimize JavaScript payload

**Rationale**: Users expect instant results from a simple calculator. Poor performance suggests unreliability.

## Technology Standards

**Framework**: Astro 4.x with React 18 islands for interactive components
**Styling**: Tailwind CSS with consistent design tokens
**Language**: TypeScript 5.x in strict mode
**Testing**: Vitest for unit/component tests, Playwright for E2E
**Build**: Astro build pipeline with sitemap generation
**Linting**: ESLint with TypeScript and React plugins
**Formatting**: Prettier with Astro plugin

All dependencies MUST be kept reasonably up-to-date. Major version upgrades require explicit justification and testing.

## Development Workflow

**Code Changes**:
1. All changes MUST pass linting (`npm run lint`)
2. All changes MUST pass formatting check (`npm run format:check`)
3. All changes MUST pass type checking (`astro check`)
4. All changes MUST pass existing tests (`npm run test:run`)
5. E2E tests MUST pass before deployment (`npm run test:e2e`)

**Commits**:
- Commit messages SHOULD follow conventional commits format
- Each commit SHOULD represent a logical, atomic change
- Breaking changes MUST be clearly documented

**Deployment**:
- Production builds MUST pass all quality gates
- SEO meta tags MUST be verified after deployment
- Core Web Vitals MUST be monitored post-deployment

## Governance

This constitution supersedes all other development practices for this project.

**Amendment Process**:
1. Propose amendment with rationale
2. Evaluate impact on existing code and workflows
3. Update constitution with new version number
4. Update any affected templates or documentation
5. Communicate changes to all contributors

**Version Policy**:
- MAJOR: Principle removal, redefinition, or backward-incompatible governance change
- MINOR: New principle added, existing principle materially expanded
- PATCH: Clarifications, wording improvements, typo fixes

**Compliance**:
- All pull requests MUST verify compliance with these principles
- Code reviews SHOULD reference relevant principles when providing feedback
- Violations require explicit justification in the PR description

**Version**: 1.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02
