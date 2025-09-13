import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { renderHomePage } from './pages/home';
import { renderLayout } from './layouts/layout';

const app = new Hono();

app.use('*', cors());

// Routes
app.get('/', (c) => {
  const html = renderHomePage();
  return c.html(html);
});

app.get('/about', (c) => {
  const content = `<div class="container mx-auto px-4 py-20">
    <h1 class="text-4xl font-bold mb-8">About MobiCycle USA</h1>
    <p class="text-lg">We help organizations manage their Scope 3 emissions from electronics and electricals.</p>
  </div>`;
  const html = renderLayout('MobiCycle USA | About', content);
  return c.html(html);
});

app.get('/services', (c) => {
  const content = `<div class="container mx-auto px-4 py-20">
    <h1 class="text-4xl font-bold mb-8">Our Services</h1>
    <p class="text-lg">Comprehensive Scope 3 emissions management for your organization.</p>
  </div>`;
  const html = renderLayout('MobiCycle USA | Services', content);
  return c.html(html);
});

app.get('/contact', (c) => {
  const content = `<div class="container mx-auto px-4 py-20">
    <h1 class="text-4xl font-bold mb-8">Contact Us</h1>
    <p class="text-lg">Get in touch to learn more about our services.</p>
    <p class="mt-4">Email: info@mobicycle-usa.com</p>
  </div>`;
  const html = renderLayout('MobiCycle USA | Contact', content);
  return c.html(html);
});

// Newsletter signup endpoint
app.post('/api/newsletter', async (c) => {
  const formData = await c.req.formData();
  const email = formData.get('email');
  
  // Forward to your signup service
  const response = await fetch('https://signups.mobicycle.workers.dev/', {
    method: 'POST',
    body: formData
  });
  
  if (response.ok) {
    return c.redirect('/?success=true');
  } else {
    return c.redirect('/?error=true');
  }
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  const content = `<div class="container mx-auto px-4 py-20 text-center">
    <h1 class="text-6xl font-bold mb-4">404</h1>
    <p class="text-xl mb-8">Page not found</p>
    <a href="/" class="text-purple-400 hover:underline">Return to home</a>
  </div>`;
  const html = renderLayout('MobiCycle USA | Page Not Found', content);
  return c.html(html, 404);
});

export default app;