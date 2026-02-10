# Platform Analytics Dashboard - Implementation Plan

## Phase 1: Schema & API Foundation
> Add missing data fields and build the analytics API layer.

- [ ] 1.1 Add schema fields: `Post.viewCount`, `UserProgress.attemptCount`, `UserProgress.timeSpent`, `User.lastActiveAt`; run Prisma migration
- [ ] 1.2 Create `GET /api/analytics/overview` endpoint: total users, votes, quizzes completed, active polls, growth trends (this week/month)
- [ ] 1.3 Create `GET /api/analytics/polls` endpoint: all polls with vote distributions, participation rates, voter expertise breakdown
- [ ] 1.4 Create `GET /api/analytics/quizzes` endpoint: completion rates, average scores, pass/fail by difficulty tier
- [ ] 1.5 Add admin auth guard to all analytics endpoints
- [ ] 1.6 Add query result caching (in-memory Map with 5-min TTL) to analytics endpoints

## Phase 2: Analytics Overview Dashboard
> Build the main admin analytics landing page.

- [ ] 2.1 Install lightweight charting library (`chart.js` + `svelte-chartjs` or equivalent)
- [ ] 2.2 Build analytics overview page (`/admin/analytics`): stat cards for total users, votes, quizzes, active polls
- [ ] 2.3 Add growth trend mini-charts: new users, votes, quiz completions over last 30 days
- [ ] 2.4 Add "Polls ending soon" alert section
- [ ] 2.5 Add navigation link to analytics from admin sidebar
- [ ] 2.6 Add **resident participation rate** stat card: % of participants who are San Rafael residents

## Phase 3: Poll Response Analytics
> Detailed poll-level insights for civic engagement understanding.

- [ ] 3.1 Create `GET /api/analytics/polls/[pollId]` endpoint: votes over time, voter expertise levels, option breakdown
- [ ] 3.2 Build poll analytics page (`/admin/analytics/polls`): list of polls with key metrics (total votes, participation rate)
- [ ] 3.3 Build poll detail view: vote distribution chart (bar/pie), option percentages, total participation
- [ ] 3.4 Add votes-over-time line chart per poll (daily vote count from `Vote.createdAt`)
- [ ] 3.5 Add voter expertise breakdown per poll: pie chart showing VOTIST/SCHOLAR/MENTOR distribution of voters
- [ ] 3.6 Add poll comparison view: side-by-side metrics for 2-3 polls
- [ ] 3.7 Add **resident/non-resident segmentation** toggle to all poll analytics views: filter vote distributions and participation by `User.isResident`

## Phase 4: Quiz Performance & Expertise Analytics
> Understand how users learn and progress through difficulty tiers.

- [ ] 4.1 Create `GET /api/analytics/quizzes/[quizId]` endpoint: per-question miss rates (parse `answers` JSON), score distribution
- [ ] 4.2 Build quiz analytics page (`/admin/analytics/quizzes`): completion rates, average scores, pass/fail by tier
- [ ] 4.3 Add score distribution histogram per quiz
- [ ] 4.4 Add difficulty tier progression chart: VOTIST → SCHOLAR → MENTOR with user counts at each level
- [ ] 4.5 Add per-question analysis view: bar chart of most-missed questions with question text
- [ ] 4.6 Add time-to-completion metrics (average time between progress `createdAt` and `completedAt`)

## Phase 5: Quiz ↔ Poll Engagement Pipeline & PoC Metrics
> The unique Votist insight -- connecting learning to civic participation. Plus PoC-specific validation metrics.

- [ ] 5.1 Create `GET /api/analytics/pipeline` endpoint: conversion funnel data reflecting full PoC flow (registered → video watched → quiz attempted → quiz passed → poll 1 → poll 2 → poll 3), drop-off by stage
- [ ] 5.2 Build pipeline analytics page (`/admin/analytics/pipeline`): visual funnel chart showing conversion at each PoC flow stage
- [ ] 5.3 Add tier-level voting rates: what % of users at each difficulty level actually vote
- [ ] 5.4 Add quiz requirement impact analysis: compare participation rates for polls with different `requiredDifficulty` levels
- [ ] 5.5 Add engagement quality metric: do higher-tier users generate more comments/likes per vote
- [ ] 5.6 Add **knowledge gate acceptance rate**: % of users completing the full PoC flow (sign-in → video → quiz → all 3 polls) — the primary PoC success metric
- [ ] 5.7 Add **civic signal quality metrics**: response variance across the 3 poll questions, resident vs non-resident divergence scores
- [ ] 5.8 Add **orientation video analytics**: view count, completion rate, average time on video page before proceeding

## Phase 6: User Activity & Content Performance
> Track platform health and identify top-performing content.

- [ ] 6.1 Create `GET /api/analytics/users` endpoint: DAU/WAU/MAU, most active users, activity by hour/day
- [ ] 6.2 Create `GET /api/analytics/content` endpoint: top posts by engagement, category performance
- [ ] 6.3 Build user activity page: active user trends over 30/90 days, activity heatmap (hour x day-of-week)
- [ ] 6.4 Build content performance page: top posts table with likes, comments, poll votes; top quizzes by completion rate
- [ ] 6.5 Add most active users leaderboard (top 10 by votes + comments + quiz completions)
- [ ] 6.6 Update `User.lastActiveAt` on vote, comment, and quiz completion actions
