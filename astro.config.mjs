// @ts-check
/* global process */
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Skip Cloudflare adapter during vitest runs to avoid Vite plugin conflicts.
// Vitest sets VITEST=true automatically; CF_PAGES=1 during Cloudflare builds.
const isTest = process.env.VITEST === 'true';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  ...(isTest ? {} : { adapter: (await import('@astrojs/cloudflare')).default() }),
});
