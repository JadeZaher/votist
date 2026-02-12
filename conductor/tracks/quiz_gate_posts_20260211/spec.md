# Quiz Gate / Block System for Posts

## Overview
Posts can have a "quiz gate" that blocks users from participating in polling or discussion unless they've completed a set of quizzes. The gate can be:
1. **None** - No restriction, anyone can participate
2. **Difficulty-level gate** - User must complete ALL quizzes at or below a given difficulty (VOTIST, SCHOLAR, MENTOR)
3. **Specific quiz gate** - User must have completed a specific quiz (by ID)

## Functional Requirements

### Post Model Changes
- Add `quizGateType` enum field: `NONE`, `DIFFICULTY`, `SPECIFIC_QUIZ`
- Add `quizGateDifficulty` field (nullable QuizDifficulty)
- Add `quizGateQuizId` field (nullable, references Quiz)

### Admin UI
- When creating/editing a post, admin can:
  - Toggle quiz gate on/off
  - Choose gate type: difficulty level OR specific quiz
  - For difficulty: select from VOTIST, SCHOLAR, MENTOR dropdown
  - For specific quiz: searchable dropdown with full-text search across quiz titles

### API Enforcement
- Vote endpoint (`/api/posts/[id]/vote`): Check quiz gate before allowing vote
- Comment endpoint (`/api/posts/[id]/comments`): Check quiz gate before allowing comment creation
- Posts GET endpoint: Include quiz gate info so frontend can display appropriate UI

### User Experience
- When user doesn't meet quiz gate requirements:
  - Show a modal explaining what quizzes they need to complete
  - Provide a "Take Quiz" button redirecting to `/san-rafael`
  - Poll options are visible but disabled with explanation
  - Comment form is replaced with quiz requirement message
  - Discussion can still be viewed (read-only)

### Permission Logic
- `NONE`: Allow all authenticated users
- `DIFFICULTY`: Check that user has completed ALL quizzes at that difficulty level AND all levels below it
- `SPECIFIC_QUIZ`: Check that user has completed the specific quiz (passed with passing score)

## Technical Stack
- Prisma (PostgreSQL) for database
- SvelteKit for frontend/API
- DaisyUI + Tailwind for UI components
- Existing `quizPermissions.ts` module for permission checks
