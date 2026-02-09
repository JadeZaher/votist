# Research Pages Refinement - Implementation Plan

## Phase 1: Performance & Security Foundations
> Fix the CSS bloat, image issues, and XSS risk before adding features.

- [ ] 1.1 Audit WordPress CSS: identify which styles are actually used by article content, strip admin/dashboard/unused theme styles
- [ ] 1.2 Scope remaining WordPress styles under a `.wp-content` class wrapper to prevent Tailwind conflicts
- [ ] 1.3 Add `loading="lazy"` to all `<img>` elements in article content and listing cards
- [ ] 1.4 Add `onerror` fallback handler on images to show branded placeholder when WordPress media CDN fails
- [ ] 1.5 Extract and apply alt text from WordPress media metadata in `formatPost()`
- [ ] 1.6 Sanitize WordPress HTML content before rendering with `@html` (DOMPurify or equivalent)
- [ ] 1.7 Add SEO meta tags to research listing page (`/research`): title, description, OG tags

## Phase 2: Reading Experience
> Enhance the single article page with features readers expect.

- [ ] 2.1 Add reading progress bar: fixed thin bar at top of article page, tracks scroll position
- [ ] 2.2 Extract author information from WordPress `_embedded` data, display author card (name, avatar, date)
- [ ] 2.3 Add breadcrumb navigation: Home > Research > Article Title with DaisyUI breadcrumb component
- [ ] 2.4 Auto-generate table of contents from H2/H3 headings in article content, collapsible with scroll-to-section
- [ ] 2.5 Add social sharing buttons: Twitter/X, Facebook, LinkedIn, copy-link with Web Share API fallback

## Phase 3: Content Discovery
> Help users find and explore more content.

- [ ] 3.1 Build related articles section: show 3 articles matching category/tags at bottom of article page
- [ ] 3.2 Improve search: extend matching to content/excerpts, add 300ms debounce, show result count
- [ ] 3.3 Sync search and filter state with URL parameters (`?search=X&category=Y`)
- [ ] 3.4 Add clear filters button and search result highlighting in titles
- [ ] 3.5 Add pagination: load 9 articles per page, "Load more" button, preserve filter state

## Phase 4: Loading & Error Polish
> Make the research section feel robust and responsive.

- [ ] 4.1 Add skeleton loading cards for research listing while WordPress API responds
- [ ] 4.2 Add user-facing error banner with retry button when WordPress is unreachable
- [ ] 4.3 Add fetch retry logic with exponential backoff (3 attempts) in `wordpress.ts`
- [ ] 4.4 Add BreadcrumbList structured data (schema.org JSON-LD) for SEO
