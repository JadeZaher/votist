# VOTIST  
    Votist is seeking forward-thinking partners—impact investors, civic leaders, creatives, and
    engaged citizens who share our vision for a better model of digital discourse. Whether you
    want to support the platform, provide feedback, or help shape its development, we invite you
    to connect with us. Let's create a smarter, more solution-driven future together.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Using Docker for Development

If you prefer to use Docker for development, you can run the following command in the root of your project:

```bash
docker compose up --build -d
```

Then, run the following command to get the Prisma zod stuff working:

```bash
npx prisma generate
```

Then, using something like [Docker Desktop](https://www.docker.com/products/docker-desktop), you can go into the `votist` container and run the following command to get the database set up:

```bash
npx prisma migrate dev
```

This command initializes the Prisma database and applies the initial migration. Make sure you have your database connection string set up in the `.env` file. This will set up your database schema and apply any migrations.

Now, you can then access your application at `http://localhost:5173`.

## Clerk

We are using the package here for Clerk: https://svelte-clerk.netlify.app/

You'll ne4d to add your keys to the `.env` file in the root of the project. The keys can be found in your Clerk dashboard. You can see the example `.env.example` file for reference.

### Adding an Admin User

To add an admin user to your Clerk application, follow these steps:

1. Go to the Clerk dashboard.
2. Click on "Users" in the sidebar.
3. Click on "Add User".
4. Fill in the required fields (username, password, etc.).
5. Click "Create User".
6. Once the user is created, click on the user to view their details.
7. In the user details page, scroll down to the Metadata section.
8. On Public, edit it and add this JSON:

```json
{
	"role": "admin"
}
```

9. Click "Save" to update the user's metadata.
