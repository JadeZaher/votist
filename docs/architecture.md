# Votist - Architecture

## System Overview

Votist is a SvelteKit 5 full-stack application with server-side rendering, API routes, and a PostgreSQL database accessed through Prisma ORM. The architecture supports a knowledge-gated civic participation flow where users must demonstrate contextual understanding before voting on policy questions.

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  SvelteKit Pages + Svelte 5 Components + Tailwind/DaisyUI│
└──────────────────────┬──────────────────────────────────┘
                       │ SSR + Client Navigation
┌──────────────────────▼──────────────────────────────────┐
│                   SvelteKit Server                       │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │  Hooks   │  │  Routes   │  │   API Endpoints      │  │
│  │(auth MW) │  │(SSR pages)│  │ (REST + tRPC)        │  │
│  └────┬─────┘  └─────┬─────┘  └──────────┬───────────┘  │
│       │              │                    │              │
│  ┌────▼──────────────▼────────────────────▼───────────┐  │
│  │              Server Utilities ($lib/server/)        │  │
│  │  auth.ts │ session.ts │ users.ts │ quizPermissions │  │
│  └────────────────────┬───────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────┘
                        │
         ┌──────────────▼──────────────┐
         │    Prisma ORM (singleton)    │
         └──────────────┬──────────────┘
                        │
         ┌──────────────▼──────────────┐
         │       PostgreSQL             │
         │  (Railway managed)           │
         └─────────────────────────────┘

         ┌─────────────────────────────┐
         │  WordPress Headless CMS      │
         │  (Kinsta-hosted, REST API)   │
         │  Research articles + media   │
         └─────────────────────────────┘
```

## Data Model

### Core Entities

```
User ──────┬── UserProgress (quiz attempts, scores)
           ├── Vote (poll responses)
           ├── Post (authored content)
           ├── Comment (on posts)
           ├── PostLike
           ├── CommentLike
           ├── Session (auth sessions)
           └── Account (OAuth providers)

Assembly ──── Quiz ──── Question
                        └── Options (JSON)

Post ──── Poll ──── PollOption
     └── Comment ──── Comment (nested, 2-level threading)
```

### Key Relationships

- **User → UserProgress → Quiz**: Tracks quiz completion and scores per user per quiz
- **Quiz → QuizDifficulty**: Three tiers — VOTIST, SCHOLAR, MENTOR (PoC uses single tier)
- **Poll → requiredDifficulty**: Polls can gate participation by quiz difficulty tier
- **Vote**: Links User to PollOption, one vote per user per poll
- **User.isResident**: Boolean for San Rafael resident segmentation in results

### Quiz-Gated Voting Flow (Data Path)

```
1. User signs in (LinkedIn OAuth) → Session created → User.isResident set
2. User watches orientation video → UserFlowProgress.videoWatched = true
3. User takes quiz → UserProgress created with answers JSON + quizScore
4. If quizScore >= Quiz.passingScore → UserProgress.isCompleted = true
5. User votes on Poll → Vote created linking User ↔ PollOption
6. Aggregate results queried: PollOption.votes grouped by User.isResident
```

## Authentication Architecture

### Current State (Clerk)
- `svelte-clerk` middleware in `hooks.server.ts`
- Clerk API calls for user profile data on every request
- User identity stored in Clerk, referenced by `clerkId` in local DB

### Target State (Custom Auth)
- Session-based authentication with HTTP-only cookies
- LinkedIn OAuth as primary sign-in (real-name civic accountability)
- Google OAuth as secondary option
- Email/password as fallback
- All user profile data stored locally (no external API calls)
- `hooks.server.ts` validates session cookie → populates `locals.user`

### Auth Flow
```
Browser                    Server                    Database
  │                          │                          │
  ├── GET /auth/linkedin ───►│                          │
  │                          ├── Generate OAuth state ──┤
  │◄── Redirect to LinkedIn──┤                          │
  │                          │                          │
  ├── Callback with code ───►│                          │
  │                          ├── Exchange code for token│
  │                          ├── Fetch LinkedIn profile │
  │                          ├── Find/create User ─────►│
  │                          ├── Create Session ────────►│
  │◄── Set session cookie ──┤                          │
  │                          │                          │
  ├── Any request ──────────►│                          │
  │                          ├── Read cookie            │
  │                          ├── Validate session ─────►│
  │                          ├── Set locals.user        │
  │                          ├── Process request        │
  │◄── Response ────────────┤                          │
```

## PoC Participation Flow

The core PoC flow is a sequential pipeline with enforcement:

```
Sign In (LinkedIn) → Orientation Video → Knowledge Check → 3 Polls → Aggregate Results
       │                    │                   │              │              │
   Session created     videoWatched=true    quizScore set   Vote created   Read-only view
   isResident set                          isCompleted set                 Segmented by
                                                                          resident status
```

Each step gates the next — users cannot skip ahead. The flow is tracked per-user and displayed as a progress indicator.

## API Architecture

### REST Endpoints (`/api/`)

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/posts` | GET, POST | List/create posts |
| `/api/posts/[id]` | GET, PUT, DELETE | Single post CRUD |
| `/api/comments` | GET, POST | List/create comments |
| `/api/comments/[id]` | PUT, DELETE | Edit/delete comments |
| `/api/quiz/[quizId]/submit` | POST | Server-side quiz scoring |
| `/api/analytics/*` | GET | Admin analytics endpoints |
| `/auth/login` | POST | Email/password sign-in |
| `/auth/register` | POST | Email/password registration |
| `/auth/logout` | POST | Session invalidation |
| `/auth/linkedin` | GET | LinkedIn OAuth initiation |
| `/auth/linkedin/callback` | GET | LinkedIn OAuth callback |
| `/auth/google` | GET | Google OAuth initiation |
| `/auth/google/callback` | GET | Google OAuth callback |

### tRPC Layer

tRPC (`trpc-sveltekit`) provides type-safe API calls alongside REST endpoints. Used for internal data fetching with full TypeScript inference.

## Content Architecture

### WordPress Integration

Research/background materials are sourced from a headless WordPress instance:

```
WordPress (Kinsta)          Votist Server              Browser
  REST API ────────────► wordpress.ts ────────────► /research pages
  /wp-json/wp/v2/          formatPost()              @html rendered
  posts?_embed              Yoast SEO extraction      Scoped CSS
```

- Content fetched server-side with Basic Auth
- HTML sanitized before `@html` rendering (XSS prevention)
- WordPress CSS scoped under `.wp-content` class
- Fallback data when WordPress is unavailable

### Content Types

| Content | Source | Management |
|---------|--------|-----------|
| Research articles | WordPress REST API | WordPress admin |
| Quizzes | PostgreSQL (Quiz/Question models) | Votist admin panel |
| Polls | PostgreSQL (Poll/PollOption models) | Votist admin panel |
| Posts | PostgreSQL (Post model) | Votist admin panel |
| Orientation video | Admin-configured URL | Votist admin panel |

## Frontend Architecture

### Component Organization

```
src/lib/components/
  cards/          # Landing page components (Hero, CTA, feature cards)
  quiz/           # Quiz roadmap, quiz level, quiz list items
  vote/           # Post, poll feed, comment, discussion forum
  icons/          # Custom SVG icon components
  overlays/       # Modals, drawers
  Footer.svelte   # Site footer
  Tabs.svelte     # Tab navigation
```

### Svelte 5 Patterns

- **Runes-based reactivity**: `$state`, `$derived`, `$props`, `$effect`
- **Callback props**: Replace `createEventDispatcher` with function props
- **Server data**: `+page.server.ts` load functions pass data to pages
- **Optimistic updates**: UI updates immediately, rolls back on API failure (voting, likes)

### Styling

- **Tailwind CSS 4** for utility classes
- **DaisyUI 5** for component primitives (buttons, cards, modals, drawers)
- **Scoped `<style>` blocks** for component-specific CSS
- **No custom CSS framework** — Tailwind-first approach

## Deployment

### Target: Railway

```
GitHub Push → Railway Build → adapter-node → Node.js Server
                                                  │
                                          Railway PostgreSQL
```

- `@sveltejs/adapter-node` for Railway deployment
- PostgreSQL managed by Railway
- Environment variables configured in Railway dashboard
- No serverless/edge — standard Node.js runtime
