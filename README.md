# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

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

