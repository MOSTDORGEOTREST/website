import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mdgt.ru',
  output: 'static',
  build: {
    inlineStylesheets: 'never',
  },
  server: { host: true },
});
