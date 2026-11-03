// axe-core accessibility scan of every page at desktop and phone sizes.
//   node scripts/qa/axe.mjs
import { createRequire } from 'node:module';
import AxeBuilder from '@axe-core/playwright';
import { startPreview } from './shoot.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const BASE = 'http://localhost:4321/goodneighborbakehouse';
const pages = ['/', '/faq/', '/404.html'];
const sizes = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];

const srv = await startPreview();
const browser = await chromium.launch();
let total = 0;
try {
  for (const size of sizes) {
    const ctx = await browser.newContext({ viewport: size });
    const page = await ctx.newPage();
    for (const p of pages) {
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      total += res.violations.length;
      console.log(`${size.width}px ${p}: ${res.violations.length} violations, ${res.incomplete.length} to review`);
      for (const v of res.violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
        for (const n of v.nodes.slice(0, 4)) console.log(`     ${n.target.join(' ')} :: ${n.failureSummary?.split('\n')[1]?.trim()}`);
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.kill();
}
process.exitCode = total ? 1 : 0;
