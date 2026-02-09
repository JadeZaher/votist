# Platform Analytics Dashboard - Specification

## Overview

Votist's unique value proposition -- quiz-gated voting -- creates a rich dataset connecting user expertise to civic participation. This track builds an admin analytics dashboard that surfaces poll response patterns, user expertise by quiz performance, and the quiz-to-vote engagement pipeline.

## Available Data (No Schema Changes Needed)

### Already Tracked
| Data Point | Source | Timestamp |
|-----------|--------|-----------|
| Vote per user per poll | `Vote` table | `createdAt` |
| Vote counts per option | `PollOption.votes` | - |
| Total poll votes | `Poll.totalVotes` | - |
| Quiz scores | `UserProgress.quizScore` | `completedAt` |
| Quiz completion status | `UserProgress.isCompleted` | `completedAt` |
| Quiz difficulty tier | `Quiz.difficulty` (VOTIST/SCHOLAR/MENTOR) | - |
| Quiz passing threshold | `Quiz.passingScore` | - |
| User answers (JSON) | `UserProgress.answers` | - |
| Poll difficulty requirements | `Poll.requiredDifficulty` | - |
| Post engagement | `Post.likes`, Comment `_count` | `createdAt` |
| Post/comment likes | `PostLike`, `CommentLike` tables | `createdAt` |
| User registration | `User.createdAt` | `createdAt` |

### Key Correlatable Relationships
- **User → Quiz Performance → Vote Eligibility → Actual Votes** (the full pipeline)
- `UserProgress.userId` + `UserProgress.quiz.difficulty` → `Vote.userId` + `Poll.requiredDifficulty`
- Can answer: "Of users who reached SCHOLAR level, what % voted on SCHOLAR-gated polls?"

### Missing Data (Schema Additions Needed)
| Data Point | Model Change | Priority |
|-----------|-------------|----------|
| Post view count | Add `viewCount Int @default(0)` to Post | High |
| Quiz attempt count | Add `attemptCount Int @default(1)` to UserProgress | Medium |
| Quiz time spent | Add `timeSpent Int?` (seconds) to UserProgress | Medium |
| User last active | Add `lastActiveAt DateTime?` to User | Medium |

## Functional Requirements

### FR1: Analytics Overview Dashboard
Admin landing analytics page showing at-a-glance platform health:
- **Total users** (with growth trend - new this week/month)
- **Total votes cast** (with daily trend)
- **Total quizzes completed** (with completion rate)
- **Active polls** (count, ending soon alerts)
- **Engagement rate** (votes + comments per active user)

### FR2: Poll Response Analytics
Detailed view of how users vote:
- **Vote distribution chart** per poll (bar or pie chart showing option breakdown with percentages)
- **Votes over time** per poll (line chart showing voting velocity)
- **Participation rate** per poll (voters vs total eligible users based on quiz requirement)
- **Voter expertise breakdown** per poll (what difficulty level did voters achieve before voting)
- **Poll comparison** (side-by-side engagement metrics across polls)
- **Poll status tracking** (active/ended, time remaining)

### FR3: User Expertise Analytics (Quiz Performance)
Understand how users progress through the learning pipeline:
- **Quiz completion funnel** (started → completed → passed per quiz)
- **Pass/fail rates by difficulty tier** (VOTIST vs SCHOLAR vs MENTOR)
- **Average scores by quiz** with distribution histogram
- **Difficulty progression** (how many users advance from VOTIST → SCHOLAR → MENTOR)
- **Per-question analysis** (which questions are missed most frequently, using `answers` JSON)
- **Time-to-completion** (gap between UserProgress `createdAt` and `completedAt`)

### FR4: Quiz ↔ Poll Engagement Pipeline
The unique Votist insight -- connecting learning to civic participation:
- **Conversion funnel**: Registered → Quiz Started → Quiz Passed → Vote Cast
- **Tier breakdown**: What % of VOTIST/SCHOLAR/MENTOR users actually vote?
- **Drop-off analysis**: Where in the pipeline do users stop? (registered but never quizzed, quizzed but never voted)
- **Quiz requirement impact**: Do polls with higher difficulty requirements get fewer but more engaged voters?
- **Engagement quality**: Do users with higher quiz scores leave more comments/likes on polls?

### FR5: User Activity Analytics
Track platform health and user behavior:
- **Daily/weekly/monthly active users** (based on vote, comment, quiz activity)
- **User retention cohorts** (registration week → activity in subsequent weeks)
- **Most active users** leaderboard (by votes, comments, quiz completions)
- **Activity heatmap** (time of day / day of week)
- **New vs returning user split**

### FR6: Content Performance
Which content drives the most engagement:
- **Top posts by engagement** (likes + comments + poll votes)
- **Top quizzes by completion rate**
- **Category performance** (engagement by post category)
- **Comment thread depth** (average replies per top-level comment)

## Technical Requirements

### API Endpoints Needed

```
GET /api/analytics/overview
  → Total counts, growth trends, active polls

GET /api/analytics/polls
  → All polls with vote distributions, participation rates

GET /api/analytics/polls/[pollId]
  → Detailed poll analytics: votes over time, voter expertise

GET /api/analytics/quizzes
  → Quiz completion rates, average scores, pass/fail by tier

GET /api/analytics/quizzes/[quizId]
  → Per-question analysis, score distribution

GET /api/analytics/pipeline
  → Quiz-to-vote conversion funnel, tier breakdowns

GET /api/analytics/users
  → Activity metrics, retention, most active users

GET /api/analytics/content
  → Top posts, category performance
```

### Visualization Approach
- Use a lightweight charting library (Chart.js via `svelte-chartjs` or similar)
- Server-side aggregation (Prisma queries + raw SQL for complex aggregates)
- Cache expensive queries with short TTL (1-5 minutes)
- All analytics pages admin-only

### Schema Additions
```prisma
// Add to Post model:
viewCount Int @default(0)

// Add to UserProgress model:
attemptCount Int @default(1)
timeSpent    Int? // seconds

// Add to User model:
lastActiveAt DateTime?
```

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Dashboard load time | < 2s for overview |
| Data freshness | Within 5 minutes (cached aggregates) |
| Chart rendering | Smooth on desktop, functional on tablet |
| Query performance | Complex aggregates < 500ms with indexes |
| Admin only | All analytics endpoints require admin auth |
