import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { renderHomePage } from './src/pages/home';

const app = new Hono();

// Enable CORS
app.use('/*', cors());

// Main route
app.get('/', (c) => {
  const html = renderHomePage();
  return c.html(html);
});

// Catch all for 404
app.all('*', (c) => {
  return c.text('Not Found', 404);
});

export default {
  async fetch(request, env, ctx) {
    // Check if ASSETS binding exists
    if (env.ASSETS) {
      // Try to serve static assets first
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status !== 404) {
          return response;
        }
      } catch (e) {
        // If error, fall through to app
      }
    }
    
    // Handle with Hono app
    return app.fetch(request, env, ctx);
  }
};