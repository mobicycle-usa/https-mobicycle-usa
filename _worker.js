import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { renderHomePage } from './src/pages/home';

const app = new Hono();

// Enable CORS
app.use('/*', cors());

// Serve static assets
app.get('/favicon.svg', async (c) => {
  const response = await c.env.ASSETS.fetch(new URL('/favicon.svg', c.req.url));
  return response;
});

app.get('/output.css', async (c) => {
  const response = await c.env.ASSETS.fetch(new URL('/output.css', c.req.url));
  return response;
});

app.get('/logo.png', async (c) => {
  const response = await c.env.ASSETS.fetch(new URL('/logo.png', c.req.url));
  return response;
});

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
    return app.fetch(request, { ...env, ASSETS: env.ASSETS });
  }
};