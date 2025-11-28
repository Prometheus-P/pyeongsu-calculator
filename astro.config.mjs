import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://pyeongsu-calculator.kr',

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  output: 'static',

  build: {
    inlineStylesheets: 'auto',
    format: 'file',
  },

  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
});
