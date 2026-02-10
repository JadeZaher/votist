# Implementation Plan: Custom Auth Migration

## Overview

This plan migrates Votist from Clerk to a self-hosted custom authentication system across 8 phases. The approach is **incremental and safe**: the new auth system is built alongside the existing Clerk integration, then swapped in, and finally Clerk is removed. Each phase ends with a verification checkpoint.

**Estimated total effort:** 6-8 working days
**Risk level:** High (auth is a cross-cutting concern touching every authenticated route)
**Mitigation:** Each phase is independently testable; Clerk removal is the final phase so rollback is possible at any point prior.

---

## Phase 1: Database Schema and Core Auth Utilities

**Goal:** Establish the new database models and core auth functions (password hashing, session management) without touching any existing Clerk code.

### Tasks

- [ ] Task 1.1: Create Prisma schema migration for auth models
  - Add `Session` model: `id` (cuid), `userId` (FK to User), `token` (unique, indexed), `expiresAt`, `createdAt`
  - Add `Account` model: `id` (cuid), `userId` (FK to User), `provider` (string), `providerAccountId` (string), `accessToken` (nullable), `refreshToken` (nullable), `createdAt`
  - Add new columns to `User`: `id` (cuid, new PK), `passwordHash` (nullable), `firstName`, `lastName`, `avatarUrl`, `role` (default "visitor")
  - Add `@@unique([provider, providerAccountId])` on Account
  - Retain `clerkId` as a nullable unique column for backward compatibility during migration
  - TDD: Write tests validating the Prisma schema generates correctly (schema validation tests)

- [ ] Task 1.2: Write database migration script for existing data
  - Create `prisma/migrations/` migration that:
    - Adds new columns with defaults
    - Generates cuid values for the new `id` column on existing User rows
    - Updates all FK references (UserProgress.userId, Post.authorId, Comment.authorId, Vote.userId, PostLike.userId, CommentLike.userId) from `clerkId` to new `id`
    - Swaps the primary key from `clerkId` to `id`
  - TDD: Write a migration test that seeds sample data, runs migration, and verifies FK integrity

- [ ] Task 1.3: Implement password hashing utility (`$lib/server/password.ts`)
  - `hashPassword(plain: string): Promise<string>` - bcrypt hash with cost 12
  - `verifyPassword(plain: string, hash: string): Promise<boolean>` - bcrypt compare
  - Install `bcryptjs` as a dependency
  - TDD: Write tests for hashing and verification (correct password returns true, wrong password returns false, hash is not plaintext, hash format is valid bcrypt)

- [ ] Task 1.4: Implement session management utility (`$lib/server/session.ts`)
  - `createSession(userId: string): Promise<{ token: string; expiresAt: Date }>` - generates crypto-random token, stores hashed token in Session table, returns raw token
  - `validateSession(token: string): Promise<User | null>` - hashes token, looks up Session, checks expiry, returns associated User or null
  - `invalidateSession(token: string): Promise<void>` - deletes session from database
  - `cleanExpiredSessions(): Promise<number>` - deletes all expired sessions
  - Session cookie name: `votist_session`
  - Token: `crypto.randomBytes(32).toString('hex')`
  - Default expiry: 30 days
  - TDD: Write tests for create, validate (valid/expired/invalid), invalidate, and cleanup

- [ ] Task 1.5: Implement shared user transform utility (`$lib/server/users.ts`)
  - `getUserProfile(userId: string): Promise<UserProfile | null>` - reads from local User table
  - `transformUserData(userId: string): Promise<TransformUserData>` - returns `{ name, avatar, username, isVerified }` from local data
  - Define `UserProfile` and `TransformUserData` types
  - TDD: Write tests with mocked Prisma client verifying correct data transformation, null handling, and fallback values

- [ ] Verification: Run full test suite, verify all new utilities pass. Verify Prisma migration generates without errors. [checkpoint marker]

---

## Phase 2: Auth Hooks and Middleware

**Goal:** Create the new SvelteKit hooks middleware that validates sessions and populates `locals.user`, running alongside the existing Clerk middleware initially.

### Tasks

- [ ] Task 2.1: Update `app.d.ts` with new type declarations
  - Replace Clerk `Auth` type import with custom types
  - Define `App.Locals` with `user: UserProfile | null` and `sessionToken: string | null`
  - Define `UserProfile` interface: `id`, `email`, `firstName`, `lastName`, `avatarUrl`, `role`, `isAdmin`
  - TDD: Write type-checking tests (compile-time validation via `tsc --noEmit`)

- [ ] Task 2.2: Implement new `hooks.server.ts` handler
  - Create a `handle` function that:
    1. Reads the `votist_session` cookie from the request
    2. Calls `validateSession(token)` if cookie present
    3. Sets `event.locals.user` to the validated user or null
    4. Sets `event.locals.sessionToken` to the raw token or null
  - Do NOT remove the Clerk handler yet -- use SvelteKit's `sequence()` to chain both handlers during transition
  - TDD: Write tests with mocked cookies and session validation (no cookie = null user, valid cookie = user populated, expired cookie = null user)

- [ ] Task 2.3: Rewrite `$lib/server/auth.ts` (getUser, requireAuth)
  - `getUser(event)`: Read `event.locals.user` directly (no Clerk API call). Return `{ user, isAuthenticated }` matching existing return shape but with local user data
  - `requireAuth(event)`: Check `event.locals.user`, redirect to `/sign-in` if null
  - Maintain backward-compatible return shapes so existing API routes continue to work
  - TDD: Write tests for both functions with mocked event.locals (authenticated case, unauthenticated case, redirect behavior)

- [ ] Task 2.4: Create session cookie utility (`$lib/server/cookies.ts`)
  - `setSessionCookie(cookies: Cookies, token: string): void` - sets HTTP-only, Secure, SameSite=Lax, Path=/, MaxAge=30days
  - `clearSessionCookie(cookies: Cookies): void` - clears the session cookie
  - `getSessionToken(cookies: Cookies): string | null` - reads the session cookie
  - TDD: Write tests verifying cookie attributes (httpOnly, secure, sameSite, path, maxAge)

- [ ] Verification: Run all tests. Verify type-checking passes with `npx svelte-check`. [checkpoint marker]

---

## Phase 3: Registration and Sign-Up Flow

**Goal:** Implement the server-side registration endpoint and rewrite the multi-step sign-up pages to use it instead of Clerk's client SDK.

### Tasks

- [ ] Task 3.1: Create registration Zod schemas (`$lib/schemas/auth.ts`)
  - `registerStep1Schema`: email (valid email), password (min 8 chars)
  - `registerStep2Schema`: firstName (required), lastName (required), dob (optional), phoneNumber (optional)
  - `registerCompleteSchema`: merged schema of all steps
  - `loginSchema`: identifier (email), password (string)
  - TDD: Write validation tests for each schema (valid inputs pass, invalid inputs fail with correct errors)

- [ ] Task 3.2: Create registration API endpoint (`src/routes/auth/register/+server.ts`)
  - POST handler that:
    1. Validates request body against `registerCompleteSchema`
    2. Checks email uniqueness in database
    3. Hashes password
    4. Creates User record with all profile fields
    5. Creates a session
    6. Sets the session cookie
    7. Returns success with user data
  - Error responses: 400 (validation), 409 (email exists), 500 (server error)
  - TDD: Write tests for happy path, duplicate email, validation errors, and password hashing verification

- [ ] Task 3.3: Create check-email API endpoint (`src/routes/auth/check-email/+server.ts`)
  - Replace existing `/api/check-email` (which uses Clerk) with local database check
  - GET handler: accepts `email` query param, returns `{ exists: boolean }`
  - TDD: Write tests for email exists, email not found, missing param

- [ ] Task 3.4: Rewrite sign-up page (`src/routes/sign-up/+page.svelte`)
  - Remove all `window.Clerk` references
  - Step 1 (email/password): validate locally, call `/auth/check-email` to verify uniqueness
  - Step 2 (name entry): collect firstName, lastName, dob
  - Step 3 (confirmation): collect phone (optional), submit to `/auth/register`
  - On success: redirect to home page (server-side cookie already set)
  - Social auth buttons: redirect to `/auth/google` and `/auth/linkedin` (implemented in Phase 5)
  - Remove import of `handleSocialAuth` from Clerk-based `social-auth.ts`
  - TDD: Write component tests verifying form validation, step navigation, and submission behavior

- [ ] Task 3.5: Update sign-up sub-components
  - Update `Step1EmailPassword.svelte`, `Step2NameEntry.svelte`, `Step3Confirmation.svelte` to remove any Clerk references
  - Update `signup-store.ts` if needed (it is already Clerk-free, verify no changes needed)
  - Remove `src/routes/sign-up/social-auth.ts` (Clerk-specific OAuth helpers)
  - TDD: Write component tests for each step component

- [ ] Verification: Start dev server, manually test the 3-step sign-up flow with email/password. Verify user appears in database with correct password hash. Verify session cookie is set. [checkpoint marker]

---

## Phase 4: Login and Sign-Out Flow

**Goal:** Implement the login endpoint, rewrite the sign-in page, and implement sign-out with session invalidation.

### Tasks

- [ ] Task 4.1: Create login API endpoint (`src/routes/auth/login/+server.ts`)
  - POST handler that:
    1. Validates request body against `loginSchema`
    2. Looks up user by email
    3. Verifies password hash
    4. Creates a session
    5. Sets the session cookie
    6. Returns success with user data
  - Error responses: 400 (validation), 401 (invalid credentials -- generic message), 500 (server error)
  - TDD: Write tests for happy path, wrong password, nonexistent user, validation errors

- [ ] Task 4.2: Create sign-out API endpoint (`src/routes/auth/logout/+server.ts`)
  - POST handler that:
    1. Reads session token from cookie
    2. Invalidates the session in database
    3. Clears the session cookie
    4. Returns success (or redirects to `/sign-in`)
  - TDD: Write tests for sign-out with valid session, sign-out with no session

- [ ] Task 4.3: Rewrite sign-in page (`src/routes/sign-in/+page.svelte`)
  - Remove all `window.Clerk` references and `svelte-clerk` component imports (`SignedIn`, `SignedOut`)
  - Form submits to `/auth/login` via fetch POST
  - On success: redirect to home page
  - On error: display error message
  - Social auth buttons: redirect to `/auth/google` and `/auth/linkedin`
  - Add server-side load function to redirect already-authenticated users
  - TDD: Write component tests for form submission, error display, redirect behavior

- [ ] Task 4.4: Rewrite sign-out page (`src/routes/sign-out/+page.svelte`)
  - Remove `SignOutButton` and `SignedIn` imports from `svelte-clerk`
  - "Sign Out" button calls `/auth/logout` via fetch POST
  - On success: redirect to `/sign-in`
  - TDD: Write component test for sign-out button behavior

- [ ] Task 4.5: Add sign-in/sign-up page guards (`+page.server.ts` load functions)
  - `/sign-in/+page.server.ts`: if user is already authenticated, redirect to `/`
  - `/sign-up/+page.server.ts`: if user is already authenticated, redirect to `/`
  - TDD: Write tests for redirect behavior based on auth state

- [ ] Verification: Start dev server, test full sign-up -> sign-out -> sign-in flow. Verify session cookie lifecycle. Verify protected pages redirect unauthenticated users. [checkpoint marker]

---

## Phase 5: OAuth Implementation (Google and LinkedIn)

**Goal:** Implement Google and LinkedIn OAuth 2.0 flows with custom server-side handlers.

### Tasks

- [ ] Task 5.1: Create OAuth utility (`$lib/server/oauth.ts`)
  - `generateOAuthState(): { state: string; codeVerifier: string }` - generates CSRF state and PKCE code verifier
  - `generateCodeChallenge(verifier: string): Promise<string>` - SHA-256 code challenge for PKCE
  - `validateOAuthState(expected: string, actual: string): boolean`
  - Define provider configuration type: `{ clientId, clientSecret, authorizationUrl, tokenUrl, userInfoUrl, scopes, redirectUri }`
  - TDD: Write tests for state generation (randomness, length), code challenge generation, state validation

- [ ] Task 5.2: Implement Google OAuth endpoints
  - `src/routes/auth/google/+server.ts` (GET): Generates state + PKCE, stores in cookie, redirects to Google authorization URL
  - `src/routes/auth/google/callback/+server.ts` (GET): Validates state, exchanges code for tokens, fetches user info, creates/links Account + User, creates session, redirects to `/`
  - Environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - Google scopes: `openid email profile`
  - TDD: Write tests for authorization URL generation, callback with valid code (mocked), callback with invalid state, user creation vs linking logic

- [ ] Task 5.3: Implement LinkedIn OAuth endpoints
  - `src/routes/auth/linkedin/+server.ts` (GET): Generates state, stores in cookie, redirects to LinkedIn authorization URL
  - `src/routes/auth/linkedin/callback/+server.ts` (GET): Validates state, exchanges code for tokens, fetches user info via OIDC userinfo endpoint, creates/links Account + User, creates session, redirects to `/`
  - Environment variables: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
  - LinkedIn scopes: `openid profile email`
  - TDD: Write tests for authorization URL generation, callback flow, user creation vs linking

- [ ] Task 5.4: Implement account linking logic (`$lib/server/oauth.ts`)
  - `findOrCreateOAuthUser(provider, providerAccountId, profile)`:
    1. Check if Account exists for this provider+providerAccountId -> return existing user
    2. Check if User exists with the same email -> link new Account to existing user
    3. Otherwise create new User + Account
  - TDD: Write tests for all three scenarios (existing account, existing email user, new user)

- [ ] Task 5.5: Remove SSO callback page and old social auth
  - Delete `src/routes/sso-callback/+page.svelte` (replaced by provider-specific callbacks)
  - Delete `src/routes/sign-up/social-auth.ts` (if not already removed in Phase 3)
  - Update sign-in and sign-up pages to use new OAuth routes (`/auth/google`, `/auth/linkedin`)
  - TDD: Verify no imports of deleted files remain (static analysis test)

- [ ] Verification: Start dev server, test Google OAuth flow end-to-end (requires Google Cloud Console credentials). Test LinkedIn OAuth flow. Verify account creation and linking. [checkpoint marker]

---

## Phase 6: Layout and UI Migration

**Goal:** Remove all Clerk UI components from the layout and replace with custom auth-aware rendering.

### Tasks

- [ ] Task 6.1: Rewrite root layout server load (`src/routes/+layout.server.ts`)
  - Remove `buildClerkProps()` and `clerkClient.users.getUser()` imports
  - Return `{ user: locals.user }` (user profile from session middleware, or null)
  - No more `clerk` prop in the return data
  - TDD: Write tests verifying the load function returns correct shape for authenticated and unauthenticated states

- [ ] Task 6.2: Rewrite root layout (`src/routes/+layout.svelte`)
  - Remove `ClerkProvider`, `SignedIn`, `SignedOut`, `UserButton` imports from `svelte-clerk`
  - Use `data.user` (from `+layout.server.ts`) to conditionally render authenticated vs unauthenticated layouts
  - Replace `<UserButton />` with a custom user avatar dropdown component (`$lib/components/UserMenu.svelte`)
  - TDD: Write component tests for authenticated layout rendering, unauthenticated layout rendering

- [ ] Task 6.3: Create UserMenu component (`$lib/components/UserMenu.svelte`)
  - Displays user avatar (or initials fallback) and full name
  - Dropdown with: Profile link, Settings link, Sign Out link
  - Sign Out link navigates to `/sign-out`
  - TDD: Write component tests for rendering with user data, dropdown toggle behavior

- [ ] Task 6.4: Update dashboard layout (`src/routes/dashboard/+layout.svelte`)
  - Remove `SignOutButton` import from `svelte-clerk`
  - Use custom sign-out mechanism (link to `/sign-out` or direct API call)
  - TDD: Write component test verifying no Clerk imports and correct rendering

- [ ] Task 6.5: Update auth store (`src/stores/authStore.ts`)
  - Remove any Clerk-related logic
  - The store should be initialized from server data passed via the layout
  - `signOut()` calls `/auth/logout` via fetch then redirects
  - Optionally migrate to Svelte 5 runes-based state if appropriate
  - TDD: Write store tests for state transitions (set authenticated, set loading, sign out)

- [ ] Verification: Start dev server, navigate as authenticated and unauthenticated user. Verify sidebar shows user info, UserMenu works, sign-out works from layout. [checkpoint marker]

---

## Phase 7: API Route Migration

**Goal:** Replace all `clerkClient.users.getUser()` calls and duplicated `transformUserData()` helpers in API routes with the shared local utility.

### Tasks

- [ ] Task 7.1: Migrate `/api/posts/+server.ts`
  - Remove `clerkClient` import from `svelte-clerk/server`
  - Remove local `transformUserData()` function
  - Import shared `transformUserData` from `$lib/server/users.ts`
  - Update all `transformUserData(clerkId)` calls to use `User.id`
  - Update Prisma queries: select `id` instead of `clerkId` in author includes
  - Update `POST` handler: use `locals.user.id` instead of Clerk user ID; use `locals.user.isAdmin` or `locals.user.role` for admin checks
  - TDD: Write integration tests for GET and POST endpoints with mocked auth

- [ ] Task 7.2: Migrate `/api/posts/[id]/+server.ts`
  - Same pattern as 7.1: remove Clerk imports, use shared utility, update Prisma queries
  - Update PUT/DELETE handlers: replace `user.publicMetadata?.role` checks with `locals.user.isAdmin`
  - TDD: Write integration tests for GET, PUT, DELETE endpoints

- [ ] Task 7.3: Migrate `/api/comments/+server.ts`
  - Remove Clerk imports, use shared `transformUserData`
  - Update GET handler: use `locals.user.id` for comment like lookups
  - Update POST handler: use `locals.user.id` for author
  - TDD: Write integration tests for GET and POST endpoints

- [ ] Task 7.4: Migrate `/api/comments/[id]/+server.ts`
  - Remove Clerk imports, use shared utility
  - Update PUT/DELETE authorization checks to use `locals.user.isAdmin`
  - TDD: Write integration tests for PUT and DELETE endpoints

- [ ] Task 7.5: Migrate `/vote/+page.server.ts`
  - Remove `clerkClient` import
  - Remove local `transformUserData()` function
  - Import shared utility from `$lib/server/users.ts`
  - Update Prisma queries to select `id` instead of `clerkId`
  - Update all `transformUserData(post.author.clerkId)` to `transformUserData(post.author.id)`
  - TDD: Write tests for the page server load function

- [ ] Task 7.6: Update `$lib/server/quizPermissions.ts`
  - Update JSDoc comments that reference "Clerk user ID" to "user ID"
  - No functional changes needed (already uses generic `userId: string` parameter)
  - TDD: Existing tests should still pass; verify

- [ ] Verification: Run all API route tests. Start dev server, test creating a post, adding comments, voting on a poll. Verify user names and avatars display correctly from local data. [checkpoint marker]

---

## Phase 8: Clerk Removal and Cleanup

**Goal:** Completely remove Clerk from the project. No Clerk code, dependencies, or configuration should remain.

### Tasks

- [ ] Task 8.1: Remove Clerk from hooks.server.ts
  - Remove `withClerkHandler` import and usage
  - Remove `sequence()` if it was used to chain handlers
  - The custom session handler should be the only handle function
  - TDD: Write test verifying hooks.server.ts has no Clerk imports

- [ ] Task 8.2: Delete Clerk-specific files
  - Delete `src/lib/clerk.d.ts`
  - Delete `src/routes/sso-callback/+page.svelte` (if not already deleted)
  - Delete `src/routes/sign-up/social-auth.ts` (if not already deleted)
  - Delete `src/routes/api/check-email/+server.ts` (replaced by `/auth/check-email`)
  - Delete `src/lib/server/db/schema.ts` (Drizzle schema referencing `clerk_user_id` -- appears to be unused legacy)
  - TDD: Glob test verifying no files import from `svelte-clerk` or `@clerk/backend`

- [ ] Task 8.3: Remove Clerk dependencies
  - Run `npm uninstall svelte-clerk`
  - Remove any `@clerk/backend` or `@clerk/types` entries if present
  - Remove Clerk-related environment variables from `.env.example` (document in migration notes)
  - TDD: Verify `package.json` contains no Clerk references

- [ ] Task 8.4: Update Prisma schema to remove clerkId
  - Remove `clerkId` column from User model (or mark as deprecated with a comment)
  - Generate and apply migration
  - Update `zod-prisma-types` generated schemas
  - TDD: Verify Prisma schema compiles and generates client without errors

- [ ] Task 8.5: Final codebase audit
  - Run `grep -r "clerk" --include="*.ts" --include="*.svelte" --include="*.js"` across entire `src/` directory
  - Verify zero matches (excluding comments documenting the migration)
  - Run `npx svelte-check` for type errors
  - Run `CI=true npx vitest run` for all tests
  - Run `npm run build` for build verification
  - TDD: All existing and new tests pass; build succeeds

- [ ] Task 8.6: Update tech-stack.md
  - Update the Authentication section to reflect the custom auth solution
  - Remove the migration note about Clerk
  - Document the new auth architecture: session-based, bcrypt passwords, OAuth (Google/LinkedIn)
  - Add new environment variables to tech stack docs: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `SESSION_SECRET` (if used)

- [ ] Verification: Full build succeeds. All tests pass with >70% coverage on auth modules. Start dev server and manually test: sign-up, sign-in, Google OAuth, sign-out, protected routes, post/comment creation, voting. No Clerk references in codebase. [checkpoint marker]

---

## Dependency Graph

```
Phase 1 (Schema + Utils)
    |
    v
Phase 2 (Hooks + Middleware)
    |
    +---> Phase 3 (Registration/Sign-Up)
    |         |
    |         v
    |     Phase 4 (Login/Sign-Out)
    |
    +---> Phase 5 (OAuth)
    |
    v
Phase 6 (Layout/UI) -- depends on Phase 2, 3, 4
    |
    v
Phase 7 (API Routes) -- depends on Phase 1, 2
    |
    v
Phase 8 (Clerk Removal) -- depends on ALL prior phases
```

## Phase 9: PoC-Specific Auth Requirements

**Goal:** Add LinkedIn-first sign-in flow, residency collection, and real-name display settings required by the PoC.

### Tasks

- [ ] Task 9.1: Elevate LinkedIn as the primary sign-in method
  - On sign-in/sign-up pages, display "Sign in with LinkedIn" as the prominent primary button
  - Email/password and Google auth remain available but are visually secondary
  - Add explanatory text: "We use LinkedIn for real-name civic accountability"
  - TDD: Write component tests verifying LinkedIn button is visually primary

- [ ] Task 9.2: Add residency field to User schema and sign-up flow
  - Add `isResident Boolean @default(false)` to User model
  - Add residency question to sign-up Step 2: "Are you a San Rafael resident?" (yes/no toggle)
  - For LinkedIn/Google OAuth: show residency question on first-login profile completion page
  - TDD: Write tests for schema validation and sign-up flow with residency

- [ ] Task 9.3: Implement real-name display formatting
  - Create `formatDisplayName(user: User): string` utility that returns "FirstName L." format
  - Use this in all public-facing user displays (votes, comments, poll results)
  - Admin views continue to show full names
  - TDD: Write tests for name formatting (edge cases: no last name, single character names)

- [ ] Task 9.4: Add LinkedIn profile data extraction
  - On LinkedIn OAuth callback, extract and store: firstName, lastName, profilePictureUrl, email
  - Map LinkedIn profile data to User model fields
  - TDD: Write tests for LinkedIn profile data mapping

- [ ] Verification: Sign up via LinkedIn, verify residency is collected, verify name displays as "First L." format in public views. [checkpoint marker]

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Database migration breaks FK relationships | Medium | High | Extensive migration tests; keep `clerkId` column until Phase 8 |
| OAuth callback URLs misconfigured | Medium | Medium | Document exact redirect URIs; test in dev before production |
| Session cookie not set correctly across environments | Medium | High | Test with both HTTP (dev) and HTTPS (prod); use `Secure` only in production |
| Clerk removal breaks an unidentified integration | Low | High | Phase 8 includes comprehensive audit; Clerk removal is the final step |
| Existing users lose access during migration | Medium | High | Keep dual-auth running (Phases 2-7) until fully validated |

## New Dependencies

| Package | Purpose |
|---------|---------|
| `bcryptjs` | Password hashing (pure JS, no native deps) |

No other new dependencies required. OAuth is implemented using Node.js built-in `fetch` and `crypto` modules.
