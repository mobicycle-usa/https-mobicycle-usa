import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://https-mobicycle-usa.pages.dev/",
  output: "server",
  adapter: cloudflare(),
  integrations: [tailwind(), sitemap()]
});