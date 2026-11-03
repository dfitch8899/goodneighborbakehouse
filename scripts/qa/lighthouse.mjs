// Lighthouse (mobile + desktop) for every page against `astro preview`.
//   CHROME_PATH=/path/to/chrome node scripts/qa/lighthouse.mjs
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { startPreview } from './shoot.mjs';

const BASE = 'http://localhost:4321/goodneighborbakehouse';
const pages = ['/', '/faq/'];
const localChrome = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const chromePath = process.env.CHROME_PATH || (existsSync(localChrome) ? localChrome : undefined);
const MIN = Number(process.env.LH_MIN || 95);

await mkdir('qa/lighthouse', { recursive: true });
const srv = await startPreview();
const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const rows = [];
try {
  for (const formFactor of ['mobile', 'desktop']) {
    for (const p of pages) {
      const config = formFactor === 'desktop'
        ? (await import('lighthouse/core/config/desktop-config.js')).default
        : undefined;
      const result = await lighthouse(BASE + p, { port: chrome.port, output: 'json', logLevel: 'error' }, config);
      const lhr = result.lhr;
      const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
      const row = { page: p, formFactor, performance: score('performance'), accessibility: score('accessibility'), 'best-practices': score('best-practices'), seo: score('seo'),
        LCP: lhr.audits['largest-contentful-paint'].displayValue, CLS: lhr.audits['cumulative-layout-shift'].displayValue, TBT: lhr.audits['total-blocking-time'].displayValue };
      rows.push(row);
      await writeFile(`qa/lighthouse/${formFactor}-${p === '/' ? 'home' : p.replace(/\W+/g, '')}.json`, result.report);
      const failing = Object.values(lhr.audits).filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'manual');
      if (failing.length) console.log(`${formFactor} ${p} flagged:`, failing.map((a) => `${a.id}(${a.displayValue || a.score})`).join(', '));
    }
  }
} finally {
  await chrome.kill();
  srv.kill();
}
console.table(rows);
const low = rows.filter((r) => ['performance', 'accessibility', 'best-practices', 'seo'].some((k) => r[k] < MIN));
if (low.length) {
  console.error(`Below ${MIN}:`, low.map((r) => `${r.formFactor} ${r.page}`).join(', '));
  process.exitCode = 1;
}
