import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://hieunguyen7337.github.io',
  base: '/hieu-nguyen.github.io',
  integrations: [tailwind()],
});
