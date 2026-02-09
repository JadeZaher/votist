# Specification: Custom Auth Migration

## Overview

Replace the Clerk (`svelte-clerk`) third-party authentication system with a fully self-hosted custom authentication solution. This migration eliminates vendor dependency, reduces costs, and gives the team full control over the authentication pipeline while preserving all existing user-facing functionality.

## Background

Votist currently uses Clerk for all authentication concerns. Clerk is deeply integrated across the codebase:

- **Server middleware** (`hooks.server.ts`): `withClerkHandler()` injects `locals.auth()` on every request
- **Layout data** (`+layout.server.ts`): `buildClerkProps()` and `clerkClient.users.getUser()` provide user data to all pages
- **Root layout** (`+layout.svelte`): `<ClerkProvider>`, `<SignedIn>`, `<SignedOut>`, `<UserButton>` components control the entire authenticated/unauthenticated UI shell
- **Auth pages**: Sign-in, sign-up (3-step flow), sign-out, and SSO callback pages all use Clerk's client-side SDK (`window.Clerk`)
- **Social auth**: Google and LinkedIn OAuth flows use `clerk.client.signUp.authenticateWithRedirect()`
- **API routes**: 5 server files use `clerkClient.users.getUser()` to transform user IDs into display names/avatars (duplicated `transformUserData` helper in each file)
- **Database**: The `User` model uses `clerkId` as its primary key; all relations (UserProgress, Post, Comment, Vote, PostLike, CommentLike) reference `clerkId`
- **Type system**: `app.d.ts` declares `locals.auth` based on Clerk types; `clerk.d.ts` extends Clerk type definitions
- **Auth store**: Client-side `authStore.ts` manages auth state with protected/public route lists

The current architecture has a significant design issue: user profile data (name, avatar, role) is stored in Clerk rather than in the local database, requiring API calls to Clerk on every page load and in every API route that displays user information.

## Functional Requirements

### FR-1: Database Schema Migration
**Description:** Migrate the User model from Clerk-based identity to a self-contained auth model. Add password hashing, session management, and profile fields to the local database.

**Acceptance Criteria:**
- The `User` model has a new `id` field (cuid) as the primary key, replacing `clerkId`
- The `User` model includes: `email` (unique, required), `passwordHash` (nullable for OAuth users), `firstName`, `lastName`, `avatarUrl`, `role` (default "visitor")
- A new `Session` model exists with: `id`, `userId`, `expiresAt`, `createdAt`
- A new `Account` model exists for OAuth providers with: `id`, `userId`, `provider` (google/linkedin), `providerAccountId`, `accessToken`, `refreshToken`
- All foreign key references across UserProgress, Post, Comment, Vote, PostLike, CommentLike point to the new `User.id`
- A data migration script exists to migrate existing `clerkId`-based records to the new `id` scheme
- Priority: **P0 (Critical)**

### FR-2: Password Authentication
**Description:** Implement secure email/password registration and login that replaces Clerk's client-side authentication SDK.

**Acceptance Criteria:**
- Passwords are hashed using bcrypt (or argon2) before storage
- Password requirements: minimum 8 characters
- Registration validates email uniqueness against the local database
- Login accepts email + password and returns a valid session
- Failed login attempts return a generic "Invalid credentials" error (no user enumeration)
- The existing multi-step sign-up flow (email/password, name entry, confirmation) is preserved
- Priority: **P0 (Critical)**

### FR-3: Session Management
**Description:** Implement server-side session management using secure HTTP-only cookies.

**Acceptance Criteria:**
- Sessions are stored in the database (`Session` model)
- A session token is stored in an HTTP-only, Secure, SameSite=Lax cookie
- Session tokens are cryptographically random (minimum 32 bytes)
- Sessions have a configurable expiration (default: 30 days)
- Sessions can be invalidated (sign-out)
- The `hooks.server.ts` middleware validates the session cookie on every request and populates `locals.user`
- Expired sessions are cleaned up periodically or on access
- Priority: **P0 (Critical)**

### FR-4: Social Authentication (Google)
**Description:** Implement Google OAuth 2.0 sign-in/sign-up without Clerk as an intermediary.

**Acceptance Criteria:**
- Users can sign in or register using their Google account
- The OAuth flow uses standard Authorization Code flow with PKCE
- On first Google sign-in, a User record and linked Account record are created
- On subsequent Google sign-ins, the existing user is matched by provider + providerAccountId
- The user's Google profile picture URL is stored as `avatarUrl`
- The user's Google name is stored as `firstName`/`lastName`
- If a user with the same email already exists (from password registration), the Google account is linked to the existing user
- Priority: **P0 (Critical)**

### FR-5: Social Authentication (LinkedIn)
**Description:** Implement LinkedIn OAuth 2.0 (OIDC) sign-in/sign-up without Clerk as an intermediary.

**Acceptance Criteria:**
- Users can sign in or register using their LinkedIn account
- The OAuth flow uses LinkedIn's OpenID Connect protocol
- On first LinkedIn sign-in, a User record and linked Account record are created
- On subsequent LinkedIn sign-ins, the existing user is matched by provider + providerAccountId
- The user's LinkedIn profile picture and name are stored
- If a user with the same email already exists, the LinkedIn account is linked to the existing user
- Priority: **P1 (High)**

### FR-6: Server-Side Auth Utilities
**Description:** Replace `getUser()` and `requireAuth()` in `$lib/server/auth.ts` with custom implementations, and replace the duplicated `transformUserData()` helper.

**Acceptance Criteria:**
- `getUser(event)` reads the session cookie, validates it, and returns the local User record (with profile fields) from the database
- `requireAuth(event)` redirects to `/sign-in` if no valid session exists
- A shared `transformUserData(userId)` utility reads user profile data from the local `User` table (no external API calls)
- All API routes (`/api/posts`, `/api/posts/[id]`, `/api/comments`, `/api/comments/[id]`, `/vote`) use the shared utility instead of duplicated Clerk-based helpers
- The `getUser` return shape provides `id`, `email`, `firstName`, `lastName`, `avatarUrl`, `role`, `isAdmin`
- Priority: **P0 (Critical)**

### FR-7: Layout and UI Migration
**Description:** Replace Clerk UI components (`ClerkProvider`, `SignedIn`, `SignedOut`, `UserButton`, `SignOutButton`) with custom auth-aware UI.

**Acceptance Criteria:**
- The root layout (`+layout.svelte`) no longer imports or uses any `svelte-clerk` components
- Authenticated/unauthenticated layout switching uses server-provided session data (passed via `+layout.server.ts`)
- The `UserButton` component is replaced with a custom user avatar/dropdown component
- The sign-out page uses a server-side form action or API call to invalidate the session
- The `+layout.server.ts` returns user profile data from the local database instead of Clerk
- Priority: **P0 (Critical)**

### FR-8: Auth Pages Migration
**Description:** Rewrite sign-in, sign-up, and sign-out pages to use custom auth endpoints instead of Clerk's client SDK.

**Acceptance Criteria:**
- Sign-in page submits credentials to a server-side form action or API endpoint
- Sign-up page's 3-step flow submits to server-side endpoints
- Social auth buttons redirect to custom OAuth endpoints (`/auth/google`, `/auth/linkedin`)
- The SSO callback page (`/sso-callback`) is replaced with provider-specific callback routes (`/auth/google/callback`, `/auth/linkedin/callback`)
- Sign-out invalidates the server session and clears the session cookie
- All pages no longer reference `window.Clerk` or any Clerk client-side SDK
- Priority: **P0 (Critical)**

### FR-9: Clerk Package Removal
**Description:** Completely remove Clerk from the project dependencies and configuration.

**Acceptance Criteria:**
- `svelte-clerk` is removed from `package.json` dependencies
- `@clerk/backend` imports are removed from all files
- `CLERK_SECRET_KEY` and any Clerk-related environment variables are documented as deprecated
- `src/lib/clerk.d.ts` is deleted
- No file in the project imports from `svelte-clerk`, `@clerk/backend`, or `@clerk/types`
- The `check-email` API endpoint is rewritten to check the local database
- Priority: **P0 (Critical)**

### FR-10: Auth Store Update
**Description:** Update the client-side auth store to work with the new session-based authentication.

**Acceptance Criteria:**
- `authStore.ts` derives its state from server-provided data (no Clerk SDK dependency)
- `signOut()` calls the server-side sign-out endpoint
- Protected route checking (`shouldRedirectToSignIn`) still functions correctly
- The auth store provides: `isAuthenticated`, `isLoading`, `user` (with profile data)
- Priority: **P1 (High)**

## Non-Functional Requirements

### NFR-1: Security
- Passwords must be hashed with bcrypt (cost factor >= 10) or argon2
- Session tokens must be cryptographically random (crypto.randomBytes, minimum 32 bytes)
- Session cookies must be HTTP-only, Secure (in production), SameSite=Lax
- OAuth state parameters must be validated to prevent CSRF
- No plaintext passwords stored or logged anywhere
- Rate limiting on login/registration endpoints (stretch goal, not blocking)

### NFR-2: Performance
- User profile lookups must come from the local database (eliminating Clerk API latency)
- Session validation on each request must add less than 5ms overhead (single DB query with indexed lookup)
- The `transformUserData` function must not make external API calls

### NFR-3: Data Integrity
- The database migration must be reversible (down migration provided)
- Existing user data must be preserved during migration
- All foreign key relationships must remain intact after the ID scheme change

### NFR-4: Test Coverage
- All new auth modules must have >70% code coverage
- Password hashing, session management, and OAuth flows must have unit tests
- Integration tests must cover the full sign-in and sign-up flows

## User Stories

### US-1: Email/Password Registration
**As a** new user
**I want to** create an account with my email and password
**So that** I can participate in civic engagement on Votist

**Scenarios:**
- **Given** I am on the sign-up page, **When** I enter a valid email, password, and my name across the 3 steps, **Then** my account is created and I am signed in
- **Given** I try to register with an email that already exists, **When** I submit the form, **Then** I see an error message indicating the email is taken
- **Given** I enter a password shorter than 8 characters, **When** I try to proceed, **Then** I see a validation error

### US-2: Email/Password Sign-In
**As a** registered user
**I want to** sign in with my email and password
**So that** I can access my account and continue participating

**Scenarios:**
- **Given** I have an account, **When** I enter my correct email and password, **Then** I am signed in and redirected to the home page
- **Given** I enter incorrect credentials, **When** I submit the form, **Then** I see a generic "Invalid credentials" error
- **Given** I am already signed in, **When** I visit the sign-in page, **Then** I am redirected to the home page

### US-3: Google Sign-In
**As a** user
**I want to** sign in with my Google account
**So that** I can access Votist without creating a separate password

**Scenarios:**
- **Given** I click "Sign in with Google", **When** I authorize the app in Google's OAuth screen, **Then** I am signed in and redirected to the home page
- **Given** I have never used Votist before, **When** I sign in with Google, **Then** a new account is created using my Google profile

### US-4: Sign Out
**As a** signed-in user
**I want to** sign out of my account
**So that** my session is securely terminated

**Scenarios:**
- **Given** I am signed in, **When** I click "Sign Out" and confirm, **Then** my session is invalidated and I am redirected to the sign-in page
- **Given** I have signed out, **When** I try to access a protected page, **Then** I am redirected to the sign-in page

### US-5: LinkedIn Sign-In
**As a** user
**I want to** sign in with my LinkedIn account
**So that** I can use my professional identity on Votist

**Scenarios:**
- **Given** I click "Sign in with LinkedIn", **When** I authorize the app in LinkedIn's OAuth screen, **Then** I am signed in and redirected to the home page

## Technical Considerations

### Password Hashing
Use `bcrypt` via the `bcryptjs` npm package (pure JS, no native dependencies) or `@node-rs/bcrypt` for better performance. Cost factor of 12 recommended.

### Session Token Generation
Use Node.js `crypto.randomBytes(32).toString('hex')` for generating 64-character hex session tokens. Store the token hash in the database (not the raw token) for defense in depth.

### OAuth Implementation
- Google: Use Google's OAuth 2.0 endpoints directly. Register the app at Google Cloud Console. Redirect URI: `{ORIGIN}/auth/google/callback`.
- LinkedIn: Use LinkedIn's OpenID Connect. Register at LinkedIn Developer Portal. Redirect URI: `{ORIGIN}/auth/linkedin/callback`.
- Store OAuth state in a short-lived HTTP-only cookie to validate the callback.

### Database Migration Strategy
Since `clerkId` is the current primary key and all relations reference it:
1. Add new `id` column to `User` with default cuid values
2. Add new profile columns (`firstName`, `lastName`, `avatarUrl`, `passwordHash`, `role`)
3. Create `Session` and `Account` tables
4. Update all foreign key references to point to `User.id` instead of `User.clerkId`
5. Make `id` the new primary key
6. Keep `clerkId` as a nullable column temporarily for rollback safety
7. Drop `clerkId` in a later migration once stable

### SvelteKit Integration Pattern
- Use SvelteKit's `hooks.server.ts` `handle` function for session validation middleware
- Use `event.locals.user` to pass the authenticated user to all server-side handlers
- Use `+layout.server.ts` to pass auth state to client-side layouts
- Use SvelteKit form actions for sign-in/sign-up (progressive enhancement)

### Shared User Transform
The duplicated `transformUserData()` function exists in 5 files. Consolidate into a single `$lib/server/users.ts` utility that reads from the local User table.

## Out of Scope

- Email verification / confirmation flow (can be added later)
- Password reset / forgot password flow (can be added later)
- Multi-factor authentication (MFA)
- Rate limiting on auth endpoints (stretch goal)
- Account deletion / GDPR data export
- Migration of existing Clerk user data (new users only; existing production data migration is a separate operations task)
- Phone number verification (Step 3 of sign-up will collect phone but not verify via SMS)
- hCaptcha integration (will be preserved in the UI but not deeply modified)

## Open Questions

1. **Existing user migration**: Are there existing production users in Clerk that need their data migrated to the local database, or is this a fresh start? (Assumption: fresh start for now; migration script provided as utility)
2. **Session duration**: Is 30 days an acceptable default session lifetime, or should it be shorter for a civic platform?
3. **LinkedIn priority**: Is LinkedIn OAuth required for the initial launch, or can it be deferred to a fast-follow? (Classified as P1 in this spec)
4. **Avatar storage**: Should user avatars from OAuth be proxied/cached locally, or is storing the external URL sufficient?
5. **Admin role assignment**: How will admins be designated in the new system? Direct database flag? Separate admin invite flow?
