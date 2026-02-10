# MVP Enhancements - Implementation Plan

## Phase 1: Critical Fixes (Navigation + Errors)
> Fix all broken links and add error handling so users can actually navigate the app.

- [ ] 1.1 Fix landing page CTAs: change all `/quiz` hrefs to `/san-rafael` in `+page.svelte` (4 instances)
- [ ] 1.2 Fix quiz results "Back to Roadmap" link: change `/san-rafael/quizzes` to `/san-rafael` in `results/+page.svelte`
- [ ] 1.3 Fix signed-out navbar: correct "Rafeal" typo to "Rafael" and `project/san-rafael` to `/san-rafael` in `+layout.svelte`
- [ ] 1.4 Fix footer dead links: remove non-existent routes (`/tos`, `/privacy`, `/about`, `/feedback`) and replace with placeholder or working links in `Footer.svelte`
- [ ] 1.5 Fix sidebar dead links: remove `/profile` and `/settings` nav items (or link to dashboard) in `+layout.svelte`; remove hardcoded notification badges
- [ ] 1.6 Create branded `+error.svelte` with 404/500 handling, navigation guidance, and consistent DaisyUI styling
- [ ] 1.7 Wire HeroSection buttons: "Vote for change" navigates to `/vote`, play button opens video modal or navigates to learn-more

## Phase 2: Security + Database Stability
> Fix the quiz cheating vulnerability and database connection issues.

- [ ] 2.1 Strip `isCorrect` and `correctAnswer` from quiz data sent to client in `san-rafael/quiz/[quizId]/+page.server.ts`
- [ ] 2.2 Create `POST /api/quiz/[quizId]/submit` endpoint: accepts user answers, scores server-side, returns per-question results
- [ ] 2.3 Update quiz-taking page to submit answers via new API endpoint instead of client-side scoring
- [ ] 2.4 Replace all `new PrismaClient()` with shared singleton import from `$lib/server/db/prisma` (12+ files)
- [ ] 2.5 Extract `transformUserData()` to shared utility `$lib/server/userTransform.ts` with batch fetching (collect IDs, single `getUserList()` call)
- [ ] 2.6 Add in-memory cache (Map with 5-min TTL) for user profile data in the shared utility

## Phase 3: Mobile Responsive Layout
> Make the app usable on phones and tablets.

- [ ] 3.1 Implement mobile sidebar: hamburger toggle / DaisyUI drawer, hidden on screens < 768px
- [ ] 3.2 Add mobile-responsive content area: remove fixed `ml-[16rem]`, use conditional margin
- [ ] 3.3 Add mobile bottom navigation bar or slide-out drawer for key nav items
- [ ] 3.4 Fix HeroSection mobile layout: stack content vertically, adjust text sizes
- [ ] 3.5 Fix ImageTextSection mobile layout: add `flex-col` breakpoint for stacking
- [ ] 3.6 Fix quiz results fail page: replace `w-[577px]`/`w-[668px]` with responsive widths
- [ ] 3.7 Add signed-out mobile navbar with hamburger menu

## Phase 4: Feature Completion (Voting + Discussion)
> Wire up broken features and fill functional gaps.

- [ ] 4.1 Fix post likes: change `export const onLike` to `export let onLike` in `Post.svelte`, wire `handlePostLike()` in `DiscussionForum.svelte` to call `POST /api/posts/{id}` with optimistic update
- [ ] 4.2 Fix poll editing: update `PUT /api/posts/[id]` to handle poll data OR remove poll fields from `PostEdit.svelte` with "Polls cannot be edited after creation" message
- [ ] 4.3 Add comment edit/delete UI: wire MoreHorizontal button in `Comment.svelte` to dropdown with Edit/Delete options calling existing API endpoints
- [ ] 4.4 Add pagination to vote feed: accept `page` param in `+page.server.ts`, add "Load more" button in `PollFeed.svelte`
- [ ] 4.5 Add share functionality: implement Web Share API with copy-to-clipboard fallback in `Post.svelte`
- [ ] 4.6 Add contact form submission feedback: loading spinner on submit, success message, error handling

## Phase 5: Dashboard Implementation
> Give users a home base that shows their progress.

- [ ] 5.1 Create dashboard server loader: fetch user's quiz progress, recent votes, highest difficulty level
- [ ] 5.2 Build quiz progress card: show completed/total per difficulty tier with visual progress bars
- [ ] 5.3 Build recent activity card: show last 5 votes cast and comments made
- [ ] 5.4 Build "Continue Learning" CTA: intelligently link to next available quiz
- [ ] 5.5 Build user stats card: member since, total votes, total comments, current level

## Phase 6: Code Quality + Cleanup
> Remove dead code, fix inconsistencies, and modernize.

- [ ] 6.1 Delete 8 unused legacy vote components: `VotingOption.svelte`, `VoteHeader.svelte`, `VoteTitleSection.svelte`, `VoteQuestion.svelte`, `VoteStatusMessage.svelte`, `DiscussionSection.svelte`, `DiscussionComment.svelte`, `DiscussionHeader.svelte`
- [ ] 6.2 Remove all debug `console.log` statements from production code
- [ ] 6.3 Fix `app.css`: remove broken `@font-face` declaration (misspelled "Railway" with empty URL)
- [ ] 6.4 Fix `VotingProgressBar.svelte`: correct `bg-secondar` typo to `bg-secondary`
- [ ] 6.5 Clean up dead Prisma schema items: remove unused `QuizStatus` enum, document or remove `materialId` field
- [ ] 6.6 Fix seed data format: update `seed.ts` to use `{text, isCorrect, isNoOpinion}` option format matching runtime expectations
- [ ] 6.7 Standardize admin auth: use `User.isAdmin` consistently instead of mixing with Clerk `publicMetadata.role`
- [ ] 6.8 Remove hardcoded "Fairfax CA" from sidebar; remove or make data-driven

## Phase 7: Svelte 5 Migration
> Migrate remaining Svelte 4 components to Svelte 5 runes syntax.

- [ ] 7.1 Migrate layout components: `+layout.svelte`, `Footer.svelte`, `Tabs.svelte`
- [ ] 7.2 Migrate card components: `HeroSection.svelte`, `CenterContentCTA.svelte`, `ImageTextSection.svelte`, `QuizFeatureCard.svelte`, `HeroCard.svelte`
- [ ] 7.3 Migrate quiz components: `QuizRoadmap.svelte`, `QuizLevel.svelte`, `QuizListItem.svelte`, `san-rafael/+page.svelte`
- [ ] 7.4 Migrate vote components: `Post.svelte`, `DiscussionForum.svelte`, `PollFeed.svelte`, `Comment.svelte`, `CommentForm.svelte`
- [ ] 7.5 Migrate admin components: `QuizForm.svelte`, `QuizEdit.svelte`, `QuizList.svelte`, `QuestionEditor.svelte`, `PostForm.svelte`, `PostEdit.svelte`, `PostList.svelte`
- [ ] 7.6 Migrate remaining: `Modal.svelte`, `UserLoader.svelte`, `VotingProgressBar.svelte`, auth pages

## Phase 8: PoC Flow — Orientation Video & Aggregate Results
> Build the missing PoC-specific pages that complete the civic participation flow.

- [ ] 8.1 Create orientation video page (`/san-rafael/orientation`): embed neutral context video, provide optional links to research articles
- [ ] 8.2 Add `videoWatched Boolean @default(false)` to UserProgress or create `UserFlowProgress` model tracking video/quiz/poll completion
- [ ] 8.3 Build flow enforcement middleware: redirect users to next incomplete step (video → quiz → polls → results)
- [ ] 8.4 Create aggregate results page (`/san-rafael/results/aggregate`): anonymized bar/pie charts for all 3 structured poll questions
- [ ] 8.5 Add resident/non-resident toggle to aggregate results: filter displayed data by `User.isResident`
- [ ] 8.6 Add participation counts to results: total participants, resident count, non-resident count
- [ ] 8.7 Add PoC flow progress indicator to dashboard/sidebar: checkmarks for video, quiz, polls, results

## Phase 9: Final Verification
> Comprehensive testing and validation before launch.

- [ ] 9.1 Run full test suite: `CI=true npm test`
- [ ] 9.2 Run type checking: `npm run check`
- [ ] 9.3 Run linting: `npm run lint`
- [ ] 9.4 Manual mobile testing: verify all pages on 320px, 375px, 768px, 1024px viewports
- [ ] 9.5 Manual PoC flow testing: complete full LinkedIn → video → quiz → 3 polls → aggregate results cycle end-to-end
- [ ] 9.6 Verify no `console.log` statements remain in source
- [ ] 9.7 Update `conductor/tech-stack.md` with any changes made during this track
- [ ] 9.8 Final build verification: `npm run build` succeeds without errors
