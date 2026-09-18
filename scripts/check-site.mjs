const production = 'https://garden.cos02.top';
const target = new URL(process.argv[2] || production);
if (!['https:', 'http:'].includes(target.protocol)) {
  throw new Error('Only HTTP(S) site URLs are supported.');
}
const routes = ['/', '/blog', '/thoughts', '/robots.txt', '/sitemap.xml',
  '/_vercel/insights/script.js', '/_vercel/speed-insights/script.js'];
let failed = false;
await Promise.all(routes.map(async (route) => {
  const started = performance.now();
  try {
    const response = await fetch(new URL(route, target), {
      signal: AbortSignal.timeout(15000),
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (route.endsWith('script.js') && !/javascript/.test(response.headers.get('content-type') || '')) {
      throw new Error('Expected JavaScript, possibly an authentication or error page');
    }
    if (['/', '/blog', '/thoughts'].includes(route)) {
      const canonical = [...body.matchAll(/<link\b[^>]*>/gi)].find(([tag]) => /\brel=["']canonical["']/i.test(tag))?.[0];
      const href = canonical?.match(/\bhref=["']([^"']+)["']/i)?.[1];
      if (!href || new URL(href).href !== new URL(route, production).href) throw new Error(`Incorrect canonical: ${href || 'missing'}`);
    }
    if (route === '/sitemap.xml') {
      const locations = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
      if (!locations.length || locations.some((url) => new URL(url).origin !== production)) {
        throw new Error('Sitemap must use the production domain');
      }
    }
    if (route === '/robots.txt' && !body.includes(`${production}/sitemap.xml`)) {
      throw new Error('Incorrect sitemap URL in robots.txt');
    }
    console.log(`OK ${route} (${Math.round(performance.now() - started)}ms)`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${route}: ${error.message}`);
  }
}));
console.log('Timings are single requests from this machine, not Web Vitals scores.');
if (failed) process.exitCode = 1;
