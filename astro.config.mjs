import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site. If a custom domain is added later, set SITE_URL and
// BASE_PATH=/ in the deploy workflow (and add public/CNAME).
export default defineConfig({
  site: process.env.SITE_URL || 'https://dfitch8899.github.io',
  base: process.env.BASE_PATH || '/goodneighborbakehouse',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
