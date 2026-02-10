# Votist

Votist is a civic participation platform that uses knowledge-gating and real-name accountability to produce a visible, structured signal of informed community sentiment on real policy questions.

## Current Proof of Concept: San Rafael Housing

The PoC is a small pilot focused on San Rafael, CA and housing growth policy. It tests one core question:

> **Will people accept a modest, respectful knowledge gate before expressing a civic opinion — and does this produce a more useful civic signal?**

### Participant Flow

1. **Sign in via LinkedIn** — Real-name verification for civic accountability
2. **Watch orientation video** — Neutral context on San Rafael's housing situation
3. **Complete knowledge check** — Brief quiz establishing a shared factual baseline
4. **Answer 3 structured polls** — Questions surfacing values, preferences, and reasoning
5. **View aggregate results** — Anonymized, read-only community sentiment snapshot

### Design Constraints

- No comment threads, debates, scores, rankings, or weighted votes
- Responses aggregated in anonymized, read-only form
- Results segmentable by San Rafael resident vs non-resident
- Intentionally small and restrained

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit 5 (Svelte 5, runes-based reactivity) |
| Styling | Tailwind CSS 4 + DaisyUI 5 |
| Database | PostgreSQL + Prisma 6 ORM |
| API | tRPC (trpc-sveltekit) + RESTful API routes |
| Auth | Custom auth (migrating from Clerk) — LinkedIn OAuth primary |
| Content | WordPress headless CMS (research articles) |
| Testing | Vitest + Playwright |
| Deployment | Railway (adapter-node) |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- LinkedIn OAuth credentials (for sign-in)
- Google OAuth credentials (optional)

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and OAuth credentials

# Generate Prisma client and Zod types
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

### Using Docker

```bash
# Start containers
docker compose up --build -d

# Generate Prisma client
npx prisma generate

# Apply migrations (inside the votist container)
npx prisma migrate dev
```

Access the app at `http://localhost:5173`.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `LINKEDIN_CLIENT_ID` | Yes | LinkedIn OAuth app client ID |
| `LINKEDIN_CLIENT_SECRET` | Yes | LinkedIn OAuth app secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth app secret |

## Project Structure

```
src/
  routes/
    +layout.svelte          # Root layout with auth-aware sidebar
    +page.svelte             # Landing page
    admin/                   # Admin panel (quiz, post, poll management)
    api/                     # REST API endpoints
    san-rafael/              # PoC flow: quiz roadmap, quiz taking, results
    vote/                    # Poll voting feed
    research/                # WordPress-sourced background materials
    sign-in/                 # Authentication pages
    sign-up/                 # Multi-step registration
    dashboard/               # User dashboard
    contact/                 # Contact form
  lib/
    components/              # Reusable UI components
      cards/                 # Hero, CTA, feature cards
      quiz/                  # Quiz-related components
      vote/                  # Poll/vote components
      icons/                 # Custom icon components
    server/                  # Server-only utilities (auth, db, permissions)
    types/                   # TypeScript type definitions
    wordpress.ts             # WordPress API integration
prisma/
  schema.prisma              # Database schema
  seed.ts                    # Database seeding
conductor/                   # Development planning and specs
  product.md                 # Product guide
  tracks/                    # Feature tracks with specs and plans
  tech-stack.md              # Detailed tech stack documentation
docs/
  architecture.md            # System architecture documentation
  roadmap.md                 # Development roadmap
```

## Documentation

- [Architecture](docs/architecture.md) — System design, data flow, and key patterns
- [Roadmap](docs/roadmap.md) — Development phases and future vision
- [Product Guide](conductor/product.md) — Full product definition and PoC scope
- [Tech Stack](conductor/tech-stack.md) — Detailed technology inventory
- [Development Tracks](conductor/tracks.md) — Active implementation plans

## Building

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting
npm run lint
```

## Development Tracks

Active development is organized into tracks:

| Track | Priority | Tasks | Description |
|-------|----------|-------|-------------|
| Custom Auth Migration | P0 | 43 | Replace Clerk with custom auth (LinkedIn-first) |
| MVP Enhancements | P0 | 56 | Fix bugs, add mobile support, complete PoC flow |
| Admin Content Mgmt | P1 | 29 | Better quiz/poll creation UX |
| Research Refinement | P1 | 22 | Polish the research content hub |
| Platform Analytics | P1 | 36 | Admin analytics dashboard |

**Total: 186 tasks across 5 tracks**

## License

Proprietary. All rights reserved.
