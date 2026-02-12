# Implementation Plan: Quiz Gate System

## Phase 1: Database Schema
1. Add `QuizGateType` enum and fields to `Post` model in Prisma schema
2. Run Prisma migration

## Phase 2: Backend Logic
3. Update `quizPermissions.ts` with new gate check functions
4. Add quiz gate search API endpoint (`/api/quizzes/search`)
5. Update vote API to check post-level quiz gate
6. Update comments API to check post-level quiz gate
7. Update posts create/update APIs to handle quiz gate fields

## Phase 3: Admin UI
8. Update PostForm.svelte with quiz gate controls + searchable quiz dropdown
9. Update PostEdit.svelte with quiz gate controls + searchable quiz dropdown

## Phase 4: User-Facing UI
10. Update Post.svelte and DiscussionForum.svelte to show gate status and block interactions
