# Data Model: SEO Improvements

**Feature**: 001-seo-improvements
**Date**: 2025-12-02

## Overview

This feature does not introduce persistent data storage. All SEO data is:
- Defined in component props at build time
- Generated from page context (URL, content)
- Stored in HTML output as meta tags and JSON-LD scripts

## Entity Definitions

### PageMetadata

Represents SEO metadata for a single page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Page title (max 60 chars for display) |
| description | string | Yes | Meta description (max 160 chars for display) |
| canonical | string | No | Canonical URL (defaults to current page URL) |
| ogImage | string | No | Open Graph image path (defaults to /og-image.png) |
| noindex | boolean | No | Whether to exclude from search indexing (default: false) |
| publishDate | Date | No | Article publish date (for guide pages) |
| modifiedDate | Date | No | Article last modified date (for guide pages) |

**Validation Rules**:
- title: Non-empty, recommended ≤ 60 characters
- description: Non-empty, recommended ≤ 160 characters
- canonical: Valid URL format
- ogImage: Valid path starting with /

### BreadcrumbItem

Represents a single item in the breadcrumb navigation path.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Display name for breadcrumb item |
| url | string | Yes | Full URL of the breadcrumb item |
| position | number | Yes | 1-based position in breadcrumb list |

**Validation Rules**:
- position: Must be >= 1, sequential without gaps
- url: Valid absolute URL
- name: Non-empty string

### ArticleMetadata

Represents schema.org BlogPosting data for guide articles.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| headline | string | Yes | Article headline (title) |
| description | string | Yes | Article summary |
| datePublished | string | Yes | ISO 8601 date string |
| dateModified | string | No | ISO 8601 date string (defaults to datePublished) |
| authorName | string | No | Author name (defaults to "평수 계산기") |
| authorType | "Person" \| "Organization" | No | Author entity type (default: "Organization") |

**Validation Rules**:
- headline: Non-empty, recommended ≤ 110 characters
- datePublished: Valid ISO 8601 date format (YYYY-MM-DD)
- dateModified: Must be >= datePublished if provided

### EnvironmentConfig

Configuration values loaded from environment variables.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| PUBLIC_GOOGLE_SITE_VERIFICATION | string | No | Google Search Console verification code |
| PUBLIC_NAVER_SITE_VERIFICATION | string | No | Naver Search Advisor verification code |

**Validation Rules**:
- Both fields optional (site works without verification)
- Values are alphanumeric strings (no special characters except hyphens)

## Relationships

```
PageMetadata
    ├── references → BreadcrumbItem[] (for navigation context)
    └── contains → ArticleMetadata (for guide pages only)

EnvironmentConfig
    └── injected into → PageMetadata.verificationCodes
```

## State Transitions

N/A - SEO metadata is stateless; all values are determined at build time.

## Schema.org Type Mapping

| Entity | Schema.org Type | Output Location |
|--------|----------------|-----------------|
| PageMetadata (general) | WebPage | meta tags in head |
| PageMetadata (calculator) | WebApplication | JSON-LD script |
| BreadcrumbItem[] | BreadcrumbList | JSON-LD script |
| ArticleMetadata | BlogPosting | JSON-LD script |
| FAQ content | FAQPage | JSON-LD script |
| How-to content | HowTo | JSON-LD script |
