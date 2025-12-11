# Feature Specification: Astro Guides AEO Optimization

**Feature Branch**: `004-astro-guides-aeo`
**Created**: 2025-12-11
**Status**: Draft
**Input**: User description: "Astro Content Collections를 사용하여 부동산 면적 가이드 콘텐츠를 구조화하고, AEO(Answer Engine Optimization)를 위한 Schema.org 마크업과 FAQ 구조화 데이터를 추가하여 AI 검색 엔진(ChatGPT, Perplexity 등)에서 콘텐츠가 잘 인용될 수 있도록 최적화합니다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AI Search Engine Citation (Priority: P1)

사용자가 ChatGPT, Perplexity, Google AI Overview 등의 AI 검색 엔진에서 "평수 계산법", "1평 몇 제곱미터" 등의 질문을 했을 때, 평수계산기 가이드 콘텐츠가 신뢰할 수 있는 출처로 인용되어 노출됩니다.

**Why this priority**: AI 검색 엔진의 사용량이 급증하고 있으며, 구조화된 데이터가 있는 콘텐츠가 AI 응답에서 우선 인용됩니다. 이는 직접적인 트래픽과 브랜드 인지도 향상으로 이어집니다.

**Independent Test**: Schema.org Validator와 Google Rich Results Test에서 FAQPage, Article, HowTo 마크업이 올바르게 인식되는지 검증할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 가이드 페이지가 로드되었을 때, **When** 페이지 소스를 확인하면, **Then** JSON-LD 형식의 Schema.org 마크업이 포함되어 있습니다.
2. **Given** FAQ 섹션이 있는 가이드 페이지, **When** Google Rich Results Test를 실행하면, **Then** FAQPage 스키마가 유효하다고 표시됩니다.
3. **Given** 단계별 설명이 있는 가이드, **When** Schema.org Validator로 검증하면, **Then** HowTo 스키마가 올바르게 파싱됩니다.

---

### User Story 2 - Content Author Workflow (Priority: P2)

콘텐츠 작성자가 새로운 부동산 가이드를 추가하거나 기존 가이드를 수정할 때, Markdown 파일만 편집하면 자동으로 Schema.org 마크업이 생성되고 사이트맵에 반영됩니다.

**Why this priority**: 콘텐츠 관리의 효율성은 장기적인 SEO/AEO 성과에 필수적입니다. 작성자가 마크업을 직접 작성하지 않아도 되므로 오류 가능성이 줄어들고 생산성이 향상됩니다.

**Independent Test**: 새 Markdown 파일을 content/guides 폴더에 추가하고 빌드하여, 해당 페이지가 자동으로 생성되고 스키마 마크업이 포함되는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** 콘텐츠 작성자가 새 가이드 Markdown 파일을 생성했을 때, **When** 정의된 frontmatter 스키마를 따르면, **Then** 빌드 시 에러 없이 페이지가 생성됩니다.
2. **Given** 가이드 Markdown에 FAQ 섹션을 추가했을 때, **When** 사이트를 빌드하면, **Then** FAQPage 스키마가 자동으로 JSON-LD에 포함됩니다.
3. **Given** 기존 가이드의 내용을 수정했을 때, **When** 사이트를 빌드하면, **Then** 수정된 내용이 Schema.org 마크업에 반영됩니다.

---

### User Story 3 - Search Engine Discovery (Priority: P2)

검색 엔진 크롤러가 사이트를 방문했을 때, 모든 가이드 페이지를 효율적으로 발견하고 구조화된 데이터를 올바르게 파싱할 수 있습니다.

**Why this priority**: 구조화된 데이터가 있어도 검색 엔진이 발견하지 못하면 소용없습니다. 사이트맵과 올바른 메타데이터는 인덱싱의 기본 요소입니다.

**Independent Test**: sitemap.xml에 모든 가이드 URL이 포함되어 있고, 각 URL이 유효한 응답을 반환하는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** 사이트가 빌드되었을 때, **When** sitemap.xml을 확인하면, **Then** 모든 가이드 페이지 URL이 포함되어 있습니다.
2. **Given** 가이드 페이지가 로드되었을 때, **When** HTML head를 확인하면, **Then** canonical URL, Open Graph, Twitter Card 메타태그가 올바르게 설정되어 있습니다.
3. **Given** 새 가이드가 추가되었을 때, **When** 다음 빌드 후 sitemap.xml을 확인하면, **Then** 새 가이드 URL이 자동으로 포함됩니다.

---

### Edge Cases

- 가이드에 FAQ 섹션이 없는 경우? FAQPage 스키마는 생략되고 Article 스키마만 포함됩니다.
- Markdown frontmatter에 필수 필드가 누락된 경우? 빌드 시 명확한 유효성 검사 오류가 표시됩니다.
- 콘텐츠에 특수 문자나 HTML이 포함된 경우? JSON-LD에서 올바르게 이스케이프 처리됩니다.
- 매우 긴 FAQ 답변이 있는 경우? Google 권장 사항(약 300자)을 초과해도 마크업은 유효하며, 검색 엔진이 필요에 따라 잘라서 표시합니다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 Markdown 기반 콘텐츠 파일에서 가이드 페이지를 생성해야 합니다.
- **FR-002**: 각 가이드 페이지는 JSON-LD 형식의 Article 스키마를 포함해야 합니다.
- **FR-003**: FAQ 섹션이 있는 가이드는 FAQPage 스키마를 자동으로 포함해야 합니다.
- **FR-004**: 단계별 설명이 있는 가이드는 HowTo 스키마를 포함해야 합니다.
- **FR-005**: 콘텐츠 frontmatter는 타입 안전한 스키마로 유효성 검사되어야 합니다.
- **FR-006**: 빌드 시 모든 가이드 URL이 sitemap.xml에 자동으로 포함되어야 합니다.
- **FR-007**: 기존 10개 가이드 페이지를 Content Collections로 마이그레이션해야 합니다.
- **FR-008**: 각 가이드 페이지는 Open Graph 및 Twitter Card 메타태그를 포함해야 합니다.

### Non-Functional Requirements

- **NFR-001**: 빌드 시간은 현재 대비 30% 이상 증가하지 않아야 합니다.
- **NFR-002**: 생성된 JSON-LD는 Schema.org Validator에서 오류 없이 통과해야 합니다.
- **NFR-003**: 콘텐츠 타입 스키마 오류는 빌드 시점에 감지되어야 합니다 (런타임이 아닌).
- **NFR-004**: 새 가이드 추가 시 코드 변경 없이 Markdown 파일만 추가하면 됩니다.

### Key Entities

- **Guide**: 부동산 관련 교육 콘텐츠. 제목, 설명, 작성일, 수정일, 키워드, 본문 콘텐츠를 포함합니다.
- **FAQ Item**: 질문-답변 쌍. 가이드 내에 여러 개 포함될 수 있으며 FAQPage 스키마를 생성하는 데 사용됩니다.
- **HowTo Step**: 단계별 지침. 순서, 제목, 설명을 포함하며 HowTo 스키마를 생성하는 데 사용됩니다.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 모든 10개 기존 가이드 페이지가 Content Collections로 마이그레이션됩니다.
- **SC-002**: 모든 가이드 페이지가 Google Rich Results Test에서 유효한 구조화 데이터로 통과합니다.
- **SC-003**: sitemap.xml에 모든 가이드 URL이 포함되어 있습니다.
- **SC-004**: 새 가이드 추가 시 Markdown 파일 생성만으로 5분 이내에 완료됩니다.
- **SC-005**: frontmatter 스키마 오류 시 빌드가 실패하고 명확한 오류 메시지가 표시됩니다.
- **SC-006**: 빌드 시간이 현재 기준 대비 30% 이상 증가하지 않습니다.

## Assumptions

- Astro 4.16의 Content Collections API가 stable 상태이며 breaking changes 없이 사용 가능합니다.
- 기존 ArticleLayout.astro를 수정하거나 새 레이아웃으로 대체합니다.
- Schema.org의 Article, FAQPage, HowTo 스키마는 현재 표준을 따릅니다.
- Google, Bing, ChatGPT, Perplexity 등 주요 엔진이 JSON-LD 형식을 지원합니다.
- 기존 가이드 콘텐츠의 구조(헤딩, 목록, 테이블)는 마이그레이션 시 유지됩니다.
- @astrojs/sitemap 플러그인이 Content Collections 페이지를 자동으로 포함합니다.
