import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Set `site` to the production domain before deployment (used for sitemap + canonical URLs)
export default defineConfig({
  site: 'https://kadali.example.org',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
