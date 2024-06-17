import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://https-mobicycle-usa.pages.dev/",
  output: "server",
  adapter: cloudflare({platformProxy: {enabled: true,},}),
  integrations: [tailwind(), sitemap()]
});