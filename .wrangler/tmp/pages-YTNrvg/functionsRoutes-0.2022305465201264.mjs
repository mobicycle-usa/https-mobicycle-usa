import { onRequestPost as __api_submit_js_onRequestPost } from "/Users/mobicycle/Github/websites/country/https-mobicycle-usa/functions/api/submit.js"

export const routes = [
    {
      routePath: "/api/submit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_submit_js_onRequestPost],
    },
  ]