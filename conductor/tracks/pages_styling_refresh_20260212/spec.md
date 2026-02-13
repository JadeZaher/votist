# Stand-in Pages, Styling Refresh & Responsive Fixes

## Overview
Create placeholder pages for legal/info routes, add HeroTofu contact forms, refresh main page styling for a sleek civic engagement brand, fix responsiveness on settings page, update favicon, and ensure footer links are functional.

## Functional Requirements

### New Stand-in Pages
- `/tos` - Terms of Service placeholder
- `/privacy` - Privacy Policy placeholder
- `/about` - What is Votist informational page
- `/feedback` - Contact form using HeroTofu (action: `https://public.herotofu.com/v1/375281f0-0886-11f1-b8b0-610c8f909331`)
- `/support` - Support form using HeroTofu (action: `https://public.herotofu.com/v1/fe67e780-3073-11f0-9486-b3bf4f299ad0`)

### Responsive Fixes
- Settings page (`/settings`) - mobile-friendly padding and layout
- HeroSection component - mobile responsive
- ImageTextSection component - stack on mobile
- CenterContentCTA component - responsive text/spacing
- QuizFeatureCard component - responsive sizing

### Styling Refresh
- Main page (`/`) - sleek, simplistic, illustrative, engaging civic application brand
- Consistent use of brand colors (#167B9B, #0891B2)

### Infrastructure
- Favicon: use `votist-logo.png` instead of `favicon.png`
- Footer: make Support link functional (point to `/support`)

## Technical Stack
- SvelteKit with Svelte 5 runes syntax
- Tailwind CSS + DaisyUI
- HeroTofu for external form submissions
