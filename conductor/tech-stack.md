# Votist - Tech Stack

## Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| SvelteKit | 5.x | Full-stack framework (SSR, routing, API) |
| Svelte | 5.x | UI component framework (runes-based reactivity) |
| TypeScript | 5.8 | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| DaisyUI | 5.x | Tailwind component library |
| Lucide Svelte | 0.477 | Icon library |

## Backend & Data

| Technology | Version | Purpose |
|-----------|---------|---------|
| SvelteKit Server | 5.x | Server-side rendering, API routes, hooks |
| Prisma | 6.7 | ORM and database migrations |
| PostgreSQL | - | Primary database |
| tRPC | 10.x | Type-safe API layer (trpc-sveltekit) |
| Zod | 3.x | Schema validation (with zod-prisma-types generation) |
| trpc-shield | 0.4 | tRPC authorization middleware |

## Authentication

| Technology | Version | Purpose |
|-----------|---------|---------|
| Custom auth | - | Custom authentication solution (planned) |

> **Note:** The project currently uses Clerk (`svelte-clerk`). Migration to a custom auth solution is planned to reduce vendor dependency and increase control.

## Deployment & Infrastructure

| Technology | Purpose |
|-----------|---------|
| Railway | Application hosting and deployment |
| PostgreSQL (Railway) | Managed database |

> **Note:** The project currently uses `@sveltejs/adapter-vercel`. Migration to Railway will require switching to `@sveltejs/adapter-node` or a compatible adapter.

## Testing

| Technology | Version | Purpose |
|-----------|---------|---------|
| Vitest | 3.x | Unit testing |
| Playwright | - | Integration/E2E testing |

## Build & Dev Tools

| Technology | Purpose |
|-----------|---------|
| Vite | 6.x — Build tool and dev server |
| PostCSS | CSS processing pipeline |
| ESLint | Code linting |
| Prettier | Code formatting (with Svelte + Tailwind plugins) |
| tsx | TypeScript execution (seed scripts) |

## Key Integrations

- **WordPress** — Research/blog content source (`src/lib/wordpress.ts`)
- **Vimeo / YouTube** — Video embedding for educational content
- **hCaptcha** — Bot protection on forms

## Architecture Patterns

- **File-based routing** — SvelteKit `src/routes/` convention
- **Server-side auth** — Clerk middleware in `hooks.server.ts`
- **Prisma schema-first** — Database models defined in `prisma/schema.prisma` with generated Zod types
- **Component composition** — Reusable components in `src/lib/components/` organized by domain (vote, quiz, cards, icons)
- **API routes** — RESTful endpoints in `src/routes/api/` alongside tRPC
