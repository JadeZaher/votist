import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      $com: './src/lib/components',
      '$com/*': './src/lib/components/*',
      $api: './src/lib/server/trpc/api',
      '$api/*': './src/lib/server/trpc/api/*',
      $tf: './src/lib/trpc',
      '$tf/*': './src/lib/trpc/*',
      $tb: './src/lib/server/trpc',
      '$tb/*': './src/lib/server/trpc/*',
      $tIn: './prisma/generated/zod/inputTypeSchemas',
      '$tIn/*': './prisma/generated/zod/inputTypeSchemas/*',
      $tOut: './prisma/generated/zod/outputTypeSchemas',
      '$tOut/*': './prisma/generated/zod/outputTypeSchemas/*',
      $tModel: './prisma/generated/zod/modelSchema',
      '$tModel/*': './prisma/generated/zod/modelSchema/*',
      $util: './src/util',
      '$util/*': './src/util/*',
      $z: './src/lib/types/zod',
      '$z/*': './src/lib/types/zod/*'
    }
  }
};

export default config;
