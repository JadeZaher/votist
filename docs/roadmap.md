# Votist - Development Roadmap

## Vision

Votist aims to transform civic participation by introducing intentional friction — knowledge-gating, real-name accountability, and structured input — before people weigh in on policy questions. The platform produces a visible, structured signal of informed community sentiment useful to residents, civic leaders, and decision-makers.

## PoC Core Question

> **Will people accept a modest, respectful knowledge gate before expressing a civic opinion — and does this produce a more useful civic signal?**

---

## Phase 1: PoC Foundation (Current)

**Goal:** Launch the San Rafael housing PoC with a complete, polished participant flow.

### Track 1: Custom Auth Migration (P0 — 43 tasks, 9 phases)
Replace Clerk with self-hosted authentication to reduce vendor dependency and enable LinkedIn-first sign-in for real-name civic accountability.

**Key deliverables:**
- Custom session-based auth with HTTP-only cookies
- LinkedIn OAuth as primary sign-in method
- Google OAuth and email/password as secondary options
- Residency collection at sign-up (San Rafael resident yes/no)
- Real-name display formatting (First Name + Last Initial)
- Complete Clerk removal from codebase

### Track 2: MVP Enhancements (P0 — 56 tasks, 9 phases)
Fix critical bugs, add mobile support, and build the missing PoC flow steps.

**Key deliverables:**
- Server-side quiz scoring (prevent answer cheating)
- Mobile-responsive layout with hamburger sidebar
- Fix all broken navigation (4+ dead links on landing page)
- Orientation video page (context-setting before quiz)
- Aggregate results page (anonymized community sentiment)
- Resident/non-resident result segmentation
- PoC flow enforcement (video → quiz → polls → results)
- Branded error pages, PrismaClient singleton, dead code cleanup
- Svelte 5 migration for remaining components

---

## Phase 2: Content & Analytics

**Goal:** Empower admins with better content tools and give civic leaders actionable analytics.

### Track 3: Admin Content Management (P1 — 29 tasks, 7 phases)
Transform the admin panel for faster, more effective content creation.

**Key deliverables:**
- Admin dashboard with content overview
- Rich text/markdown editor for posts
- Dynamic quiz question options (2-8 per question)
- Drag-and-drop question and quiz reordering
- Content preview (see what users see before publishing)
- Draft/publish workflow
- Orientation video management
- PoC structured poll management
- Category management (database-backed)

### Track 4: Research Pages Refinement (P1 — 22 tasks, 5 phases)
Elevate the research section into a polished content hub that connects to the PoC flow.

**Key deliverables:**
- WordPress CSS optimization (strip unused styles)
- Image optimization (lazy loading, alt text, broken image fallbacks)
- Reading experience (progress bar, author info, breadcrumbs, TOC)
- Content discovery (related articles, improved search, pagination)
- PoC flow integration (knowledge check CTA, background material tagging)
- Loading skeletons and error handling with retry

### Track 5: Platform Analytics (P1 — 36 tasks, 6 phases)
Admin analytics dashboard measuring the PoC's core question.

**Key deliverables:**
- Overview dashboard with platform health metrics
- Poll response analytics (vote distributions, expertise breakdown)
- Quiz performance analytics (pass/fail by tier, per-question analysis)
- Quiz-to-vote engagement pipeline (the unique Votist funnel)
- Knowledge gate acceptance rate (THE primary PoC success metric)
- Civic signal quality metrics (response variance, resident divergence)
- Orientation video completion analytics
- Resident/non-resident segmentation across all views
- User activity metrics (DAU/WAU/MAU, activity heatmaps)

---

## Phase 3: Future Vision

**Goal:** Expand beyond the PoC into a full civic participation system.

### Multi-Domain Expansion
- Housing, transportation, governance, climate, budgeting, education, health, social policy
- City-by-city rollout with localized content and policy context
- Template-based PoC creation for new domains/cities

### Deeper Knowledge Progression
- Three-tier system: VOTIST (baseline), SCHOLAR (intermediate), MENTOR (advanced)
- Users earn standing through sustained engagement
- Knowledge modules per policy domain
- Progressive unlocking of participation features

### Shaped Discussion Forums
- Conversations anchored to shared factual material
- Participation privileges expand as users demonstrate understanding
- Moderation informed by expertise level
- Structured debate formats (not open comment threads)

### Civic Knowledge Commons
- Visualize how informed perspectives cluster on issues
- Track how opinions shift as understanding deepens
- Surface where disagreement persists among people who share facts
- Community-level dashboards for civic leaders

### Earned Civic Influence
- Influence tied to demonstrated work: learning, participating, returning
- Not based on popularity, volume, speed, or status
- Transparent influence scoring
- Civic reputation that rewards sustained, constructive engagement

---

## Success Metrics

### PoC Metrics (Phase 1)
| Metric | What It Measures |
|--------|-----------------|
| Full flow completion rate | % of users completing sign-in → video → quiz → all 3 polls |
| Knowledge gate acceptance | Do people accept the quiz requirement before voting? |
| Quiz pass rate | Genuine engagement with context material |
| Response variance | Do the 3 polls produce meaningfully different distributions? |
| Resident vs non-resident divergence | Do locals respond differently? |
| Civic utility feedback | Do decision-makers find the output useful? |

### Platform Health (Phase 2)
| Metric | Target |
|--------|--------|
| Page load time | < 2s for dashboard, < 3s on 4G |
| Mobile responsiveness | Fully functional 320px+ |
| Analytics freshness | Within 5 minutes |
| Test coverage | > 70% for new code |

---

## Task Summary

| Phase | Tracks | Total Tasks |
|-------|--------|-------------|
| Phase 1: PoC Foundation | 2 (Auth + MVP) | 99 |
| Phase 2: Content & Analytics | 3 (Admin + Research + Analytics) | 87 |
| **Total** | **5 tracks** | **186 tasks** |
