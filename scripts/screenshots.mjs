// Full-page screenshots of the built site. Usage: npm run build && npm run preview & npm run screenshots
import { chromium } from 'playwright';
const base = process.env.BASE_URL || 'http://localhost:4173';
const shots = [
  { name: 'desktop-1440', width: 1440, height: 900, path: '/' },
  { name: 'mobile-390', width: 390, height: 844, path: '/', mobile: true },
  { name: 'privacy-desktop-1440', width: 1440, height: 900, path: '/privacy.html' },
  { name: 'terms-mobile-390', width: 390, height: 844, path: '/terms.html', mobile: true },
];
const browser = await chromium.launch();
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.mobile ? 2 : 1, isMobile: !!s.mobile, hasTouch: !!s.mobile });
  const page = await ctx.newPage();
  await page.goto(base + s.path, { waitUntil: 'networkidle' });
  // scroll through the page so lazy images load, then wait for every image to decode
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  // full-page captures misplace sticky elements; pin the header to the top for the capture
  await page.addStyleTag({ content: '.site-header{position:relative!important}' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `screenshots/${s.name}.png`, fullPage: true });
  console.log('saved', `screenshots/${s.name}.png`);
  await ctx.close();
}
// Pricing section close-ups: yearly (default) and monthly toggle states.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/#pricing', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.site-header{position:relative!important}' });
  const sec = page.locator('#pricing');
  await sec.screenshot({ path: 'screenshots/pricing-yearly-1440.png' });
  console.log('saved screenshots/pricing-yearly-1440.png');
  await page.click('[data-billing="monthly"]');
  await page.waitForTimeout(200);
  await sec.screenshot({ path: 'screenshots/pricing-monthly-1440.png' });
  console.log('saved screenshots/pricing-monthly-1440.png');
  await page.goto(base + '/#faq', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.site-header{position:relative!important}' });
  for (const d of await page.locator('#faq details').all()) {
    const t = await d.locator('summary').textContent();
    if (/own keys|hosted minutes|AI keys/i.test(t ?? '')) await d.evaluate((el) => (el.open = true));
  }
  await page.locator('#faq').screenshot({ path: 'screenshots/faq-pricing-1440.png' });
  console.log('saved screenshots/faq-pricing-1440.png');
  await ctx.close();
}
await browser.close();
