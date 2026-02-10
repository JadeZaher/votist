# MVP Enhancements - Specification

## Overview

Votist is close to MVP but has critical gaps across security, broken navigation, dead code, missing mobile support, and unfinished features. This track addresses everything needed to make the application production-ready for its San Rafael proof-of-concept launch.

## Audit Summary

### Critical Issues (Must Fix)

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| C1 | **Quiz answers leaked to client** | Users can cheat on quizzes by inspecting network responses. `isCorrect` flags and `correctAnswer` fields are sent to the browser. Scoring is client-side. | `san-rafael/quiz/[quizId]/+page.server.ts`, quiz-taking page |
| C2 | **No mobile sidebar** | Sidebar is fixed 256px with `ml-[16rem]` on content. No hamburger menu or responsive collapse. App is unusable on mobile. | `+layout.svelte` |
| C3 | **PrismaClient proliferation** | 12+ files create `new PrismaClient()` instead of using shared singleton. Will exhaust connection pools in production. | All `/api/` routes |
| C4 | **N+1 Clerk API calls** | `transformUserData()` calls `clerkClient.users.getUser()` per user per render. 10 posts with 5 comments each = 80+ external API calls per page load. | `vote/+page.server.ts`, 5+ API files |
| C5 | **All landing page CTAs link to `/quiz` which doesn't exist** | Every "Start" button on the landing page leads to a 404. Should be `/san-rafael`. | `+page.svelte` (4 instances) |
| C6 | **No error pages** | No `+error.svelte` anywhere. Dead links (of which there are many) show SvelteKit's default ugly error page. | Missing file |
| C7 | **Post likes not connected to API** | `DiscussionForum.svelte`'s `handlePostLike()` only toggles local state. Likes are lost on refresh. The API endpoint exists but is never called. | `DiscussionForum.svelte`, `Post.svelte` (`export const onLike`) |
| C8 | **Poll editing silently drops changes** | `PostEdit.svelte` shows poll fields but `PUT /api/posts/[id]` ignores poll data entirely. Admins think they're saving poll edits. | `api/posts/[id]/+server.ts` |

### High Priority (Should Fix for MVP)

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| H1 | **Broken results page navigation** | "Back to Quiz Roadmap" links to `/san-rafael/quizzes` which doesn't exist. Should be `/san-rafael`. | `results/+page.svelte` |
| H2 | **Dashboard is a stub** | Only shows "Welcome to your dashboard" heading. No user stats, quiz progress, or activity. | `dashboard/+page.svelte` |
| H3 | **7 dead navigation links** | Footer links to `/tos`, `/privacy`, `/about`, `/feedback`. Sidebar links to `/profile`, `/settings`. None exist. | `Footer.svelte`, `+layout.svelte` |
| H4 | **Signed-out navbar typo + broken link** | "San Rafeal Project" (misspelled) links to relative `project/san-rafael` (broken). | `+layout.svelte` |
| H5 | **Hardcoded notification badges** | Sidebar shows "24" and "+1" badges that are not data-driven. | `+layout.svelte` |
| H6 | **Bookmark feature structurally broken** | `isBookmarked` is a column on Post (global), not per-user. No `Bookmark` model. Button only toggles local state. | Schema, `Post.svelte` |
| H7 | **Share button non-functional** | Share button in `Post.svelte` has no click handler. | `Post.svelte` |
| H8 | **No comment edit/delete UI** | API endpoints exist (`PUT/DELETE /api/comments/[id]`) but no UI buttons. The "more" icon on comments does nothing. | `Comment.svelte` |
| H9 | **No pagination on vote page** | Hard-coded `take: 10` with no "load more" or infinite scroll. | `vote/+page.server.ts` |
| H10 | **`transformUserData` duplicated in 6+ files** | Same function copy-pasted across API routes and SSR loaders. | Multiple files |

### Medium Priority (Polish for MVP)

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| M1 | **Mixed Svelte 4/5 syntax** | Some components use `export let`/`$:`, others use `$props()`/`$derived`. Inconsistent. | ~15 components |
| M2 | **8 dead/legacy vote components** | `VotingOption`, `VoteHeader`, `VoteTitleSection`, `VoteQuestion`, `VoteStatusMessage`, `DiscussionSection` (hardcoded mock data), `DiscussionComment`, `DiscussionHeader`. | `src/lib/components/vote/` |
| M3 | **Debug console.log in production code** | Extensive logging in `Post.svelte`, `DiscussionForum.svelte`, `vote/+page.server.ts`. | Multiple files |
| M4 | **Broken font declaration** | `app.css` has `@font-face` with font-family "Railway" (misspelled Raleway) and empty `src: url()`. | `app.css` |
| M5 | **CSS typo** | `bg-secondar` instead of `bg-secondary` in VotingProgressBar. | `VotingProgressBar.svelte` |
| M6 | **HeroSection buttons do nothing** | "Vote for change" and play buttons have empty `() => {}` handlers. | `HeroSection.svelte` |
| M7 | **Inconsistent admin auth** | API checks `publicMetadata.role !== 'admin'` (Clerk), User model has `isAdmin` boolean. Can get out of sync. No layout-level admin guard. | Multiple files |
| M8 | **Categories hardcoded** | 15 categories exist only as arrays in `PostForm.svelte` and `PostEdit.svelte`. | Admin components |
| M9 | **Contact form has no submission feedback** | No loading, success, or error state after form submit. | `contact/+page.svelte` |
| M10 | **No quiz partial progress saving** | Leaving mid-quiz loses all progress. No save/resume. | Quiz page |
| M11 | **Seed data format mismatch** | Seeds use plain string arrays for options; runtime expects `{text, isCorrect, isNoOpinion}` objects. | `seed.ts` |
| M12 | **Dead `materialId` field and `QuizStatus` enum** | `UserProgress.materialId` is meaningless. `QuizStatus` Prisma enum is never stored. | Schema |
| M13 | **Quiz results fail page has fixed pixel widths** | `w-[577px]`, `w-[668px]` will overflow on mobile. | Quiz results page |
| M14 | **Hardcoded user location** | Sidebar shows "Fairfax CA" for all users. | `+layout.svelte` |

## Functional Requirements

### FR1: Server-Side Quiz Scoring
- Strip `isCorrect` and `correctAnswer` from client-sent quiz data
- Create `POST /api/quiz/[quizId]/submit` endpoint that accepts answers and scores server-side
- Return per-question results (correct/incorrect) for feedback UI
- Prevent answer leaking through any API endpoint

### FR2: Mobile-Responsive Layout
- Implement hamburger menu / drawer for mobile sidebar
- Content area adapts when sidebar is hidden
- All pages render correctly on 320px-768px viewports
- Fix quiz results fail page fixed-width elements

### FR3: Shared Database Client
- Replace all `new PrismaClient()` with import from `$lib/server/db/prisma.ts`
- Affects 12+ API route files

### FR4: User Data Caching
- Extract `transformUserData()` to a shared utility in `$lib/server/`
- Implement batch fetching: collect all unique user IDs, fetch once
- Add in-memory cache with TTL (5 min) for user profile data

### FR5: Fix All Broken Navigation
- Landing page: Change `/quiz` to `/san-rafael` (4 instances)
- Results page: Change `/san-rafael/quizzes` to `/san-rafael`
- Navbar: Fix "Rafeal" typo and `project/san-rafael` relative path
- Footer: Remove or create linked pages (`/tos`, `/privacy`, `/about`, `/feedback`)
- Sidebar: Remove or create `/profile` and `/settings` links

### FR6: Error Pages
- Create branded `+error.svelte` with 404/500 handling
- Include navigation back to home and search/quiz suggestions
- Style consistently with DaisyUI theme

### FR7: Post Likes API Integration
- Change `export const onLike` to `export let onLike` in `Post.svelte`
- Wire `handlePostLike()` in `DiscussionForum.svelte` to call `POST /api/posts/{id}`
- Add optimistic update pattern (like Comment.svelte's like handler)

### FR8: Poll Editing Fix
- Either: Update `PUT /api/posts/[id]` to handle poll updates (with vote-exists guard)
- Or: Remove poll fields from `PostEdit.svelte` and show "Polls cannot be edited after creation"

### FR9: Dashboard Implementation
- Quiz progress summary (completed/total per difficulty tier)
- Recent voting activity
- User's highest earned difficulty level
- "Continue learning" CTA pointing to next available quiz

### FR10: Dead Code Cleanup
- Delete 8 unused legacy vote components
- Remove debug `console.log` statements
- Fix broken `@font-face` in `app.css`
- Fix `bg-secondar` typo
- Remove dead `QuizStatus` Prisma enum
- Address `materialId` field

### FR11: Svelte 5 Migration
- Migrate all Svelte 4 components to Svelte 5 runes syntax
- Replace `export let` with `$props()`, `$:` with `$derived`, `createEventDispatcher` with callback props

### FR12: UX Polish
- Wire HeroSection buttons to navigation
- Add contact form submission feedback (loading/success/error)
- Remove hardcoded notification badges from sidebar
- Remove hardcoded "Fairfax CA" or make it data-driven
- Add share functionality (Web Share API or copy-to-clipboard)
- Add comment edit/delete UI (dropdown menu on "more" icon)

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Mobile support | Fully responsive 320px+ |
| Page load time | < 3s on 4G connection |
| Database connections | Single PrismaClient singleton |
| External API calls | Batched + cached (max 1 Clerk call per unique user per 5 min) |
| Test coverage | > 70% for new code |
| Accessibility | WCAG 2.1 AA for interactive elements |
| Console logging | Zero in production builds |

## PoC Alignment Notes

The PoC participant flow is: **LinkedIn sign-in → Watch orientation video → Complete knowledge check → Answer 3 structured polls → View aggregate results**. Several features in the current codebase are future-vision and should be deprioritized for PoC.

### FR13: Orientation Video Page
- Build an orientation video step between sign-in and quiz
- Short, neutral video outlining San Rafael's growth history and housing context
- Optional links to background materials (research section articles)
- "Continue to Knowledge Check" CTA after video completion
- Track video view status per user (to enforce flow order)

### FR14: Aggregate Results Page
- Build anonymized, read-only aggregate results page showing community sentiment
- Displays results for all 3 structured poll questions
- Bar charts or pie charts showing option breakdown with percentages
- Segmentable by resident vs non-resident responses
- No individual vote visibility — only aggregates
- Accessible after completing all 3 polls (the final step in the PoC flow)

### FR15: Resident/Non-Resident Result Segmentation
- Add toggle or tabs on results page: "All Participants" / "San Rafael Residents" / "Non-Residents"
- Query votes joined with User.isResident for segmentation
- Display participation counts per segment

### FR16: PoC Flow Enforcement
- After sign-in, guide users through the sequential flow: video → quiz → polls → results
- Users who haven't watched the video cannot access the quiz
- Users who haven't passed the quiz cannot access polls
- After completing all 3 polls, redirect to aggregate results
- Dashboard shows flow progress indicator

### PoC Deprioritization Notes
- **Comment threads/discussions** (Phase 4 tasks 4.1, 4.3): The PoC explicitly has "No comment threads, debates, scores, rankings, or weighted votes." These are future-vision features and should be deferred.
- **Post likes** (Phase 4 task 4.1): Deprioritized for PoC — focus on the poll voting flow.
- **Share functionality** (Phase 4 task 4.5): Keep for research articles; not critical for PoC poll flow.
- The PoC uses exactly **3 structured poll questions** about San Rafael housing, not a general-purpose poll feed.

## Open Questions

1. **Bookmark feature**: Should we implement per-user bookmarks (new `Bookmark` model) for MVP, or remove the button entirely?
2. ~~**User-generated posts**: Should regular users be able to create discussion posts, or is admin-only sufficient for MVP?~~ **RESOLVED: PoC has no user-generated discussion. Admin-only content.**
3. **Dead footer pages**: Create minimal `/tos` and `/privacy` pages, or remove links for now?
4. **Quiz timer**: Should quizzes have time limits for MVP?
5. ~~**Real-time updates**: Should votes/comments update live (WebSocket/SSE) for MVP, or is refresh-based sufficient?~~ **RESOLVED: PoC has no real-time updates. Refresh-based is sufficient for read-only aggregate results.**
