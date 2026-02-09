# Admin Content Management Enhancement - Implementation Plan

## Phase 1: Admin Dashboard & List Improvements
> Give admins an overview and make existing lists more usable.

- [ ] 1.1 Build admin dashboard landing page (`/admin/+page.svelte`): content counts, recent activity, quick-create shortcuts
- [ ] 1.2 Add search bar to quiz list: filter by title and difficulty
- [ ] 1.3 Add search and category filter to post list: filter by title, category, has-poll
- [ ] 1.4 Add sort controls to both lists: sort by date, title, engagement
- [ ] 1.5 Replace `window.location.reload()` with reactive state updates in quiz and post dashboards
- [ ] 1.6 Replace `innerHTML` toast with safe DaisyUI toast/alert component

## Phase 2: Quiz Creation UX
> Make quiz building faster and more flexible.

- [ ] 2.1 Add dynamic option count to QuestionEditor: add/remove option buttons (2-8 options)
- [ ] 2.2 Add question reordering via `svelte-dnd-action` within QuizForm/QuizEdit
- [ ] 2.3 Add question duplication ("Clone question" button)
- [ ] 2.4 Add inline image preview when URL is entered in question editor
- [ ] 2.5 Add video embed preview (fetch YouTube/Vimeo thumbnail on URL entry)
- [ ] 2.6 Replace quiz list up/down arrows with drag-and-drop reordering via `svelte-dnd-action`, single batch PUT

## Phase 3: Post Creation UX
> Upgrade the post creation experience with richer content tools.

- [ ] 3.1 Integrate lightweight markdown editor for post content (e.g., `svelte-markdown` or similar)
- [ ] 3.2 Add markdown preview panel (side-by-side or toggle)
- [ ] 3.3 Add tag autocomplete: fetch existing tags, suggest as admin types, prevent duplicates
- [ ] 3.4 Implement draft/publish workflow: add `status` field to Post schema (`draft`/`published`), save draft button, publish button
- [ ] 3.5 Add draft indicator to post list, filter drafts from public API responses

## Phase 4: Content Preview
> Let admins see what users will see before publishing.

- [ ] 4.1 Build quiz preview modal: render quiz questions in user-facing style (reuse quiz-taking page components)
- [ ] 4.2 Build post preview modal: render post as it appears in vote feed (reuse Post.svelte component)
- [ ] 4.3 Add "Preview" buttons to QuizForm, QuizEdit, PostForm, and PostEdit

## Phase 5: Category Management & Bulk Actions
> Move categories to data and enable efficient bulk operations.

- [ ] 5.1 Create `Category` model in Prisma schema (or admin config file) with name and usage count
- [ ] 5.2 Build category management page in admin: CRUD for categories
- [ ] 5.3 Update PostForm/PostEdit to load categories from database instead of hardcoded array
- [ ] 5.4 Add checkbox selection to quiz and post lists
- [ ] 5.5 Implement bulk delete with single confirmation modal
- [ ] 5.6 Implement bulk category change for posts

## Phase 6: Form Validation & Polish
> Make forms robust and consistent.

- [ ] 6.1 Add field-level inline validation with error messages (character limits, required fields, URL format)
- [ ] 6.2 Standardize delete confirmations: DaisyUI modal everywhere (replace `confirm()` in quiz delete)
- [ ] 6.3 Add loading spinners/disabled states on all async form submissions
- [ ] 6.4 Add form auto-save for drafts (save to localStorage every 30 seconds, restore on page load)
