# Admin Content Management Enhancement - Specification

## Overview

The admin panel currently works for basic CRUD but has significant UX friction that slows content creation. This track transforms the admin experience to enable faster, more effective quiz and poll creation with better content management tools.

## Current Pain Points

| # | Issue | Impact |
|---|-------|--------|
| 1 | **Plain textarea for post content** | No formatting, no markdown, no rich text. Admins can't create visually engaging posts. |
| 2 | **No content preview** | Can't see how quizzes or posts look to users before publishing. Blind publishing. |
| 3 | **Manual URL entry for media** | Image/video fields require typing URLs. No upload, no preview, no media library. |
| 4 | **Fixed 4 options per question** | Hardcoded `Array(4)`. Can't add/remove options dynamically. |
| 5 | **No question reordering** | Must delete and recreate to change order. |
| 6 | **Up/down arrows for quiz ordering** | No drag-and-drop. Each move triggers N API calls (one per quiz in group). |
| 7 | **Hardcoded categories** | 15 categories baked into PostForm/PostEdit. Can't manage without code changes. |
| 8 | **No tag autocomplete** | Tags entered one-by-one with no suggestions from existing tags. |
| 9 | **Full page reloads on success** | `window.location.reload()` on create/delete. Loses scroll position and state. |
| 10 | **No search/filter in admin lists** | Can't search quizzes by title or filter posts by category/date. |
| 11 | **No bulk actions** | Must delete/edit items one at a time. |
| 12 | **Inconsistent delete confirmations** | Quizzes use `confirm()`, posts use modal. |
| 13 | **No draft/publish workflow** | All content goes live immediately on save. No drafts. |
| 14 | **Toast uses innerHTML** | XSS risk if error messages contain user input. |
| 15 | **Poll editing silently fails** | PUT endpoint ignores poll data (covered in MVP track, but admin UX should also communicate this). |

## Functional Requirements

### FR1: Rich Text Editor for Posts
- Replace plain `<textarea>` with a markdown or WYSIWYG editor
- Support: headings, bold/italic, links, images, blockquotes, lists
- Preview mode showing rendered output
- Keep lightweight (avoid heavy editors like TinyMCE)

### FR2: Quiz Question Improvements
- Dynamic option count (2-8 options per question, add/remove buttons)
- Drag-and-drop question reordering within a quiz
- Question duplication ("Clone this question")
- Inline image preview when URL is entered
- Video embed preview (YouTube/Vimeo thumbnail)

### FR3: Quiz Ordering via Drag-and-Drop
- Replace up/down arrows with drag-and-drop reordering
- Single batch API call on drop (instead of N calls)
- Visual feedback during drag
- Use `svelte-dnd-action` (already in dependencies)

### FR4: Content Preview
- "Preview" button on quiz creation showing user-facing quiz view
- "Preview" button on post creation showing post as it appears in feed
- Modal or side-by-side preview panel

### FR5: Admin Search & Filtering
- Search quizzes by title, difficulty, or content
- Filter posts by category, date range, has-poll, engagement level
- Sort by created date, title, engagement
- Persistent filter state (URL params)

### FR6: Bulk Actions
- Checkbox selection on quiz and post lists
- Bulk delete with single confirmation
- Bulk category change for posts

### FR7: Category Management
- Move categories from hardcoded array to database (new `Category` model) or admin config
- CRUD interface for categories
- Category usage counts

### FR8: Tag Autocomplete
- Suggest existing tags as admin types
- Show popular/recent tags
- Prevent duplicate tags (case-insensitive)

### FR9: Admin Dashboard Landing
- Replace empty `/admin` page with overview:
  - Content counts (quizzes, posts, polls)
  - Recent activity feed
  - Quick-create shortcuts
  - Content needing attention (polls ending soon, posts with no comments)

### FR10: Draft/Publish Workflow
- Posts can be saved as drafts before publishing
- Draft indicator in post list
- "Publish" button separate from "Save Draft"
- Drafts not visible to regular users

### FR11: UX Polish
- Replace `window.location.reload()` with reactive state updates
- Consistent delete confirmation (DaisyUI modal everywhere)
- Replace `innerHTML` toasts with safe DaisyUI toast component
- Inline form validation with field-level error messages
- Loading states on all async operations

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Content creation speed | < 5 minutes for a 5-question quiz with media |
| Preview accuracy | 95% match between preview and user-facing view |
| Drag-and-drop | Smooth 60fps on desktop, functional on tablet |
| Form auto-save | Draft saved every 30 seconds |
