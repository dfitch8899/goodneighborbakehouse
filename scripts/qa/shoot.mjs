// Full-page and viewport screenshots of the built site at several sizes.
//   node scripts/qa/shoot.mjs <round-name> [path ...]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const round = process.argv[2] || 'latest';
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/faq/', '/404.html'];
const BASE = 'http://localhost:4321/goodneighborbakehouse';
const sizes = [
  { name: 'desktop-1440', width: 1440, height: 900, dpr: 1 },
  { name: 'laptop-1280', width: 1280, height: 800, dpr: 1 },
  { name: 'tablet-768', width: 768, height: 1024, dpr: 1 },
  { name: 'phone-390', width: 390, height: 844, dpr: 2, mobile: true },
  { name: 'phone-375', width: 375, height: 667, dpr: 2, mobile: true },
];

export async function startPreview() {
  const srv = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', '4321'], { stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('preview did not start')), 30000);
    srv.stdout.on('data', (d) => { if (String(d).includes('localhost:4321')) { clearTimeout(t); resolve(); } });
  });
  return srv;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = `qa/shots/${round}`;
  await mkdir(out, { recursive: true });
  const srv = await startPreview();
  const browser = await chromium.launch();
  try {
    for (const s of sizes) {
      const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.dpr, isMobile: !!s.mobile, hasTouch: !!s.mobile });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('requestfailed', (r) => errors.push(`FAILED ${r.url()}`));
      page.on('response', (r) => r.status() >= 400 && !r.url().endsWith('404.html') && errors.push(`${r.status()} ${r.url()}`));
      for (const p of paths) {
        await page.goto(BASE + p, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        // Scroll through once so lazy images load before the full-page shot.
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
        await page.waitForTimeout(900);
        const slug = p === '/' ? 'home' : p.replace(/\W+/g, '');
        await page.screenshot({ path: `${out}/${slug}-${s.name}-fold.png`, animations: 'disabled' });
        await page.screenshot({ path: `${out}/${slug}-${s.name}-full.png`, fullPage: true, animations: 'disabled' });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 0) errors.push(`horizontal overflow ${overflow}px on ${p}`);
      }
      if (errors.length) console.log(s.name, 'ISSUES:', [...new Set(errors)].join('\n  '));
      await ctx.close();
    }
  } finally {
    await browser.close();
    srv.kill();
  }
  console.log('shots in', out);
}
