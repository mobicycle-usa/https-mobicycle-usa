import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), alpinejs(), sitemap()]
});

// import cloudflare from "@astrojs/cloudflare";
// import partytown from "@astrojs/partytown";
// import sitemap from "@astrojs/sitemap";
// import tailwind from "@astrojs/tailwind";

// https://astro.build/config
// export default defineConfig({
//   site: "https-mobicycle-usa.pages.dev/",
//   output: "server",
//   adapter: cloudflare(),
//   integrations: [partytown(), sitemap(), tailwind()]
// });