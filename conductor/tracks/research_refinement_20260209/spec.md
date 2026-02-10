# Research Pages Refinement - Specification

## Overview

The research section pulls content from a headless WordPress instance (Kinsta-hosted). The core integration works but the reading experience lacks polish expected of a platform that values informed civic engagement. This track elevates the research section into a professional, engaging content hub.

## Current State

### What Works
- WordPress REST API integration with Basic Auth
- Post fetching with Yoast SEO metadata extraction
- Client-side search and category filtering
- Responsive layout with mobile breakpoints
- Comprehensive fallback data when WordPress is unavailable
- Featured post hero display on listing page
- Single article view with featured image, meta, reading time

### What Needs Refinement

| # | Issue | Impact |
|---|-------|--------|
| 1 | **1,893 lines of injected WordPress CSS** | Large payload with unused admin/theme styles. No build-time optimization. Potential Tailwind conflicts. |
| 2 | **No image optimization** | Full-resolution images from WordPress. No lazy loading, no responsive srcset, no CDN. |
| 3 | **No related articles** | Single article view is a dead end. No way to discover similar content. |
| 4 | **No reading progress indicator** | Long-form articles have no visual progress feedback. |
| 5 | **No social sharing** | No way to share articles to social media or copy link. |
| 6 | **No table of contents** | Long articles have no navigation aid. |
| 7 | **No breadcrumb navigation** | No orientation trail (Home > Research > Article). |
| 8 | **No author information** | No author name, bio, or avatar despite WordPress having this data. |
| 9 | **Search only matches titles** | Can't search article content or excerpts. |
| 10 | **No search debouncing** | Every keystroke triggers filter recalculation. |
| 11 | **No URL parameter sync for filters** | Can't bookmark or share filtered views. |
| 12 | **No pagination** | All posts loaded at once. Will degrade with large content libraries. |
| 13 | **No loading skeletons** | Content appears all at once or shows fallback. No progressive loading. |
| 14 | **No error messages to users** | Errors only logged to console. Users see fallback silently. |
| 15 | **No retry mechanism** | Failed WordPress requests don't retry. |
| 16 | **Empty alt text on images** | `alt=""` on featured images. Accessibility gap. |
| 17 | **`@html` without sanitization** | WordPress content rendered unsanitized. XSS risk. |
| 18 | **Listing page has no SEO metadata** | `/research` page lacks title, description, OG tags. |
| 19 | **No broken image fallback** | If WordPress media CDN is down, images show browser broken icon. |

## Functional Requirements

### FR1: Optimize WordPress CSS
- Strip unused WordPress admin, dashboard, and theme-specific styles
- Keep only Gutenberg block rendering styles needed for content
- Process through PostCSS/build pipeline for minification
- Scope styles to `.wp-content` container to prevent Tailwind conflicts

### FR2: Image Optimization
- Add `loading="lazy"` to all article images
- Add `onerror` fallback for broken images (show placeholder)
- Extract and use alt text from WordPress media metadata
- Add responsive image widths with CSS `max-width: 100%`

### FR3: Related Articles
- Show 3 related articles at bottom of single article page
- Match by WordPress category/tag
- Fallback to most recent articles if no category match
- Card layout matching the listing page style

### FR4: Reading Progress Bar
- Fixed progress bar at top of single article page
- Tracks scroll position through article content
- Subtle, non-intrusive design (thin bar, brand color)
- Only shows on article pages, not listing

### FR5: Social Sharing
- Share buttons on single article page (Twitter/X, Facebook, LinkedIn, copy link)
- Use Web Share API where available, fallback to manual share links
- Copy-to-clipboard with visual confirmation

### FR6: Table of Contents
- Auto-generate TOC from H2/H3 headings in WordPress content
- Collapsible sidebar or inline block at top of article
- Smooth scroll to sections on click
- Highlight current section based on scroll position

### FR7: Breadcrumb Navigation
- Display on single article pages: Home > Research > Article Title
- Use BreadcrumbList schema.org markup for SEO
- Style consistent with DaisyUI breadcrumb component

### FR8: Author Information
- Extract author name and avatar from WordPress `_embedded` data
- Display author card below article title (name, avatar, publish date)
- Link to filtered view of articles by same author (if multiple authors)

### FR9: Search & Filter Improvements
- Search article content and excerpts in addition to titles
- Debounce search input (300ms)
- Show result count ("Showing 5 of 12 articles")
- Sync search/filter state with URL parameters (`?search=housing&category=policy`)
- Clear filters button
- Search result highlighting in titles

### FR10: Pagination
- Load 9 articles per page (3x3 grid)
- "Load more" button or numbered pagination
- Preserve search/filter state across pages

### FR11: Loading & Error States
- Skeleton loading cards while fetching from WordPress
- User-facing error banner with retry button when WordPress is unavailable
- Broken image fallback with branded placeholder

### FR12: SEO Enhancements
- Add meta tags to listing page (`/research`)
- Sanitize Yoast SEO HTML before injection (prevent XSS)
- Add BreadcrumbList structured data
- Ensure canonical URLs are correct for headless setup

## PoC Alignment Notes

In the PoC flow, the research section serves as the "optional links to related background materials and articles" referenced in the orientation step. The research section should be explicitly connected to the knowledge-gating flow.

### FR13: Connection to PoC Orientation Flow
- Research articles are linked from the orientation video page as optional background reading
- Add a prominent CTA at the bottom of research articles: "Ready to take the Knowledge Check?" linking to the quiz
- Tag certain articles as "PoC Background Material" to distinguish from general research
- Featured/pinned articles should be the San Rafael housing context materials

### FR14: Neutral Framing Indicators
- Research content should reinforce Votist's neutral positioning
- Display a subtle "Context Material" badge on PoC-related articles
- No opinion-framing in article presentation (consistent with PoC design constraints)

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| WordPress CSS payload | < 30KB (down from ~60KB) |
| Image loading | Lazy-loaded, < 200KB per image on mobile |
| Page load | < 2s on 4G for listing, < 1.5s for cached article |
| Accessibility | All images have meaningful alt text |
| SEO | Valid structured data on all research pages |
