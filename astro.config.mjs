import { defineConfig } from 'astro/config';

export default defineConfig({
  // статический сайт, без SSR
  output: 'static',
  build: {
    inlineStylesheets: 'never',
  },
  server: { host: true },
});
