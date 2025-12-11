# Tasks: Astro Guides AEO Optimization

**Input**: Design documents from `/specs/004-astro-guides-aeo/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: External validation via Schema.org Validator and Google Rich Results Test. No automated test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Web application (Astro + React Islands)
- **Source**: `src/` at repository root
- **Content**: `src/content/` for Content Collections

---

## Phase 1: Setup

**Purpose**: Verify baseline and create directory structure

- [x] T001 Verify existing tests pass before refactor: `npm run test:run`
- [x] T002 Record current build time baseline: `npm run build`
- [x] T003 Create content directory structure: `src/content/guides/`

---

## Phase 2: Foundational (Content Collections Infrastructure)

**Purpose**: Core Content Collections setup that ALL user stories depend on

**CRITICAL**: User stories cannot proceed until this phase is complete

- [x] T004 Create Content Collections schema with Zod in `src/content/config.ts`
- [x] T005 Create schema generation utilities in `src/utils/schema.ts`
- [x] T006 Create GuideLayout component in `src/layouts/GuideLayout.astro`
- [x] T007 Create dynamic route for guides in `src/pages/guide/[...slug].astro`

**Checkpoint**: Foundation ready - Content Collections infrastructure in place

---

## Phase 3: User Story 1 - AI Search Engine Citation (Priority: P1) 🎯 MVP

**Goal**: Implement Schema.org JSON-LD markup (Article, FAQPage, HowTo) for AI search engine citation

**Independent Test**: Validate any guide page with Schema.org Validator and Google Rich Results Test

### Implementation for User Story 1

- [x] T008 [US1] Implement `generateArticleSchema()` function in `src/utils/schema.ts`
- [x] T009 [P] [US1] Implement `generateFAQSchema()` function in `src/utils/schema.ts`
- [x] T010 [P] [US1] Implement `generateHowToSchema()` function in `src/utils/schema.ts`
- [x] T011 [US1] Add JSON-LD script injection in `src/layouts/GuideLayout.astro`
- [x] T012 [US1] Migrate first guide with FAQ: `src/content/guides/pyeong-sqm-guide.md`
- [x] T013 [US1] Verify JSON-LD output in page source: `npm run build && npm run preview`
- [x] T014 [US1] Validate schema with external tools (Schema.org Validator)

**Checkpoint**: User Story 1 complete - Schema.org markup working for one guide

---

## Phase 4: User Story 2 - Content Author Workflow (Priority: P2)

**Goal**: Migrate all 10 guides to Markdown with automatic schema generation

**Independent Test**: Add new Markdown file, build, verify page renders with correct schema

### Implementation for User Story 2

- [ ] T015 [P] [US2] Migrate `apartment-size-guide.astro` to `src/content/guides/apartment-size-guide.md`
- [ ] T016 [P] [US2] Migrate `exclusive-vs-supply-area.astro` to `src/content/guides/exclusive-vs-supply-area.md`
- [ ] T017 [P] [US2] Migrate `calculate-actual-area.astro` to `src/content/guides/calculate-actual-area.md`
- [ ] T018 [P] [US2] Migrate `contract-area-check.astro` to `src/content/guides/contract-area-check.md`
- [ ] T019 [P] [US2] Migrate `furniture-layout-by-size.astro` to `src/content/guides/furniture-layout-by-size.md`
- [ ] T020 [P] [US2] Migrate `officetel-area-guide.astro` to `src/content/guides/officetel-area-guide.md`
- [ ] T021 [P] [US2] Migrate `real-estate-terms.astro` to `src/content/guides/real-estate-terms.md`
- [ ] T022 [P] [US2] Migrate `studio-to-three-room.astro` to `src/content/guides/studio-to-three-room.md`
- [ ] T023 [P] [US2] Migrate `world-area-units.astro` to `src/content/guides/world-area-units.md`
- [ ] T024 [US2] Update guide index page to query Content Collections: `src/pages/guide/index.astro`
- [ ] T025 [US2] Verify all 10 guides render correctly: `npm run build && npm run preview`
- [ ] T026 [US2] Delete old static guide files from `src/pages/guide/*.astro` (keep index.astro)

**Checkpoint**: User Story 2 complete - All guides migrated with automatic schema generation

---

## Phase 5: User Story 3 - Search Engine Discovery (Priority: P2)

**Goal**: Ensure sitemap includes all guides and meta tags are properly set

**Independent Test**: Check sitemap.xml contains all guide URLs after build

### Implementation for User Story 3

- [ ] T027 [US3] Add Open Graph meta tags to `src/layouts/GuideLayout.astro`
- [ ] T028 [P] [US3] Add Twitter Card meta tags to `src/layouts/GuideLayout.astro`
- [ ] T029 [US3] Verify sitemap includes all guide URLs: check `dist/sitemap-0.xml`
- [ ] T030 [US3] Verify canonical URLs are correct for all guides

**Checkpoint**: User Story 3 complete - Full SEO/AEO discoverability

---

## Phase 6: Polish & Validation

**Purpose**: Final verification of all requirements

- [ ] T031 Run lint check: `npm run lint`
- [ ] T032 Run format check: `npm run format:check`
- [ ] T033 Run full test suite: `npm run test:run`
- [ ] T034 Verify build time is within 30% of baseline: `npm run build`
- [ ] T035 Validate all guides pass Google Rich Results Test (manual)
- [ ] T036 Verify no broken internal links across guides

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verify baseline first
- **Foundational (Phase 2)**: Depends on Setup - creates infrastructure
- **US1 (Phase 3)**: Depends on Foundational - implements core schema
- **US2 (Phase 4)**: Depends on Foundational - can run parallel with US1
- **US3 (Phase 5)**: Depends on US2 (needs migrated guides for sitemap)
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Schema implementation - can complete with just one guide migrated
- **User Story 2 (P2)**: Content migration - depends on Foundational, not on US1
- **User Story 3 (P2)**: SEO completion - depends on US2 (needs all guides for sitemap verification)

### Within Each Phase

- Schema utilities (T008-T010) before layout integration (T011)
- First guide migration (T012) before validation (T013-T014)
- All 9 parallel migrations (T015-T023) before index update (T024)
- All guides verified (T025) before deleting old files (T026)

### Parallel Opportunities

**Phase 2 - Foundational (limited parallelism):**
```
T005 (schema.ts) and T006 (GuideLayout) can overlap slightly
T004 (config.ts) must complete before T007 (dynamic route)
```

**Phase 3 - Schema Functions parallel:**
```
T009, T010 can run in parallel (different functions in same file)
```

**Phase 4 - All 9 migrations parallel:**
```
T015, T016, T017, T018, T019, T020, T021, T022, T023 can run in parallel (different files)
```

**Phase 5 - Meta tags parallel:**
```
T027, T028 can run in parallel (different meta tag types)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007)
3. Complete Phase 3: User Story 1 (T008-T014)
4. **VALIDATE**: Schema.org Validator shows valid Article + FAQ schema
5. **MVP READY**: AI search engines can cite the first guide

### Full Implementation

1. Complete MVP (Phases 1-3)
2. Add Phase 4: User Story 2 (T015-T026) - All 10 guides migrated
3. Add Phase 5: User Story 3 (T027-T030) - Full SEO/AEO
4. Complete Phase 6: Polish (T031-T036) - Final validation
5. **FULL RELEASE READY**

### Task Counts by Phase

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| Setup | 3 | 0 | Baseline verification |
| Foundational | 4 | 0 | Content Collections setup |
| US1 (P1) | 7 | 2 | Schema implementation |
| US2 (P2) | 12 | 9 | Content migration |
| US3 (P2) | 4 | 1 | SEO completion |
| Polish | 6 | 0 | Final validation |
| **Total** | **36** | **12** | |

---

## Notes

- [P] tasks = different files or different functions, no dependencies
- [US1] = Schema.org markup (Article, FAQ, HowTo)
- [US2] = Content migration (10 guides to Markdown)
- [US3] = SEO/AEO discoverability (sitemap, meta tags)
- External validation tools: Schema.org Validator, Google Rich Results Test
- Build time constraint: <30% increase from baseline
- Each guide migration preserves existing content structure
