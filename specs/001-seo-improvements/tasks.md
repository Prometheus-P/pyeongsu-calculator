# Tasks: SEO Improvements

**Input**: Design documents from `/specs/001-seo-improvements/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: E2E tests included per constitution requirement (Principle III: Test Coverage)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Astro static site with React islands
- **Source**: `src/` at repository root
- **Components**: `src/components/`
- **Tests**: `e2e/` for Playwright E2E tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment configuration and shared assets

- [x] T001 Add environment variable type declarations to src/env.d.ts for PUBLIC_GOOGLE_SITE_VERIFICATION and PUBLIC_NAVER_SITE_VERIFICATION
- [x] T002 [P] Create .env.example file with template verification code placeholders

**Checkpoint**: Environment configuration ready for all user stories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update src/components/seo/SEOHead.astro to read verification codes from import.meta.env instead of hardcoded placeholders
- [x] T004 [P] Create PNG OG image at public/og-image.png (1200x630px) to replace SVG

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Search Engine Discovery (Priority: P1) 🎯 MVP

**Goal**: Ensure the site is properly indexed by search engines with rich results appearing for target keywords

**Independent Test**: Validate robots.txt accessibility, sitemap generation, and structured data presence via Rich Results Test

### Tests for User Story 1

- [x] T005 [P] [US1] Create E2E test for homepage meta tags in e2e/seo.spec.ts (title, description, canonical)
- [x] T006 [P] [US1] Create E2E test for homepage structured data in e2e/seo.spec.ts (WebApplication, FAQPage, HowTo schemas)
- [x] T007 [P] [US1] Create E2E test for robots.txt accessibility in e2e/seo.spec.ts

### Implementation for User Story 1

- [x] T008 [US1] Verify robots.txt endpoint returns correct content at src/pages/robots.txt.ts (already exists, validate output)
- [x] T009 [US1] Verify sitemap generation works with @astrojs/sitemap in astro.config.mjs (already configured, validate output)
- [x] T010 [US1] Ensure all public pages have unique title and description by auditing src/pages/**/*.astro

**Checkpoint**: At this point, User Story 1 should be fully functional - site is crawlable with proper meta tags

---

## Phase 4: User Story 2 - Social Media Sharing (Priority: P2)

**Goal**: When shared on social platforms, links display attractive preview cards with correct title, description, and image

**Independent Test**: Paste site URL into Facebook Debugger and Twitter Card Validator to verify preview cards render correctly

### Tests for User Story 2

- [x] T011 [P] [US2] Create E2E test for Open Graph tags in e2e/seo.spec.ts (og:title, og:description, og:image, og:url)
- [x] T012 [P] [US2] Create E2E test for Twitter Card tags in e2e/seo.spec.ts (twitter:card, twitter:title, twitter:image)

### Implementation for User Story 2

- [x] T013 [US2] Update src/components/seo/SEOHead.astro to reference og-image.png instead of og-image.svg
- [x] T014 [US2] Verify all pages pass og:image URL with absolute path (https://pyeongsu-calculator.kr/og-image.png)
- [x] T015 [US2] Add page-specific OG metadata to guide articles by updating src/layouts/ArticleLayout.astro

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - site is crawlable and shareable

---

## Phase 5: User Story 3 - Guide Content Discoverability (Priority: P3)

**Goal**: Guide articles appear in search results with article metadata (publish date, author) and breadcrumb navigation

**Independent Test**: Validate guide pages have BlogPosting and BreadcrumbList schemas via Rich Results Test

### Tests for User Story 3

- [x] T016 [P] [US3] Create E2E test for BlogPosting schema on guide pages in e2e/seo.spec.ts
- [x] T017 [P] [US3] Create E2E test for BreadcrumbList schema on guide pages in e2e/seo.spec.ts

### Implementation for User Story 3

- [x] T018 [US3] Create BreadcrumbSchema.astro component in src/components/seo/BreadcrumbSchema.astro with typed props interface
- [x] T019 [US3] Add BlogPosting schema type to src/components/seo/SchemaMarkup.astro with headline, author, datePublished, dateModified
- [x] T020 [US3] Update src/layouts/ArticleLayout.astro to include BlogPosting and BreadcrumbList schemas
- [x] T021 [US3] Add publishDate and modifiedDate frontmatter to all guide pages in src/pages/guide/*.astro
- [x] T022 [US3] Integrate BreadcrumbSchema into guide index page at src/pages/guide/index.astro

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T023 Run Lighthouse SEO audit on all page types and verify 100/100 score (manual - requires deployment)
- [ ] T024 [P] Validate all pages pass Google Rich Results Test (manual - requires deployment)
- [ ] T025 [P] Test social sharing previews with Facebook Debugger and Twitter Card Validator (manual - requires deployment)
- [x] T026 Run full E2E test suite with npm run test:e2e and fix any failures (223 passed, 70 SEO tests across 5 browsers)
- [x] T027 Run quickstart.md validation checklist and document results (6/8 items verified locally, 2 require deployment)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - US2 and US3 can start in parallel after Foundational since they modify different files
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2

### Within Each User Story

- Tests written FIRST, ensure they FAIL before implementation
- Schema components before layout integration
- Layout changes before page-level changes
- Story complete before moving to next priority

### Parallel Opportunities

- T001/T002: Setup tasks can run in parallel
- T003/T004: Foundational tasks can run in parallel
- T005/T006/T007: US1 tests can run in parallel
- T011/T012: US2 tests can run in parallel
- T016/T017: US3 tests can run in parallel
- T024/T025: Polish validation tasks can run in parallel

---

## Parallel Example: User Story 3

```bash
# Launch all tests for User Story 3 together:
Task: "Create E2E test for BlogPosting schema on guide pages in e2e/seo.spec.ts"
Task: "Create E2E test for BreadcrumbList schema on guide pages in e2e/seo.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004)
3. Complete Phase 3: User Story 1 (T005-T010)
4. **STOP and VALIDATE**: Test robots.txt, sitemap, and Rich Results
5. Deploy if ready - site is now properly crawlable

### Incremental Delivery

1. Complete Setup + Foundational → Environment and OG image ready
2. Add User Story 1 → Test independently → Site is crawlable (MVP!)
3. Add User Story 2 → Test independently → Social sharing works
4. Add User Story 3 → Test independently → Guide articles have rich results
5. Each story adds SEO value without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (meta tags, robots, sitemap validation)
   - Developer B: User Story 2 (OG image integration)
   - Developer C: User Story 3 (schemas for guides)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- E2E tests validate final built HTML output
- Manual validation steps (T024, T025) require deployment or ngrok tunnel
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
