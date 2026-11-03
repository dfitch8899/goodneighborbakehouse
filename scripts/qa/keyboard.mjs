// Tabs through the home page and checks each focused element is visible,
// has a focus outline and isn't hidden under the sticky header or order bar.
import { createRequire } from 'node:module';
import { startPreview } from './shoot.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const srv = await startPreview();
const browser = await chromium.launch();
let problems = 0;
try {
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: vp, reducedMotion: 'reduce' });
    await page.goto('http://localhost:4321/goodneighborbakehouse/', { waitUntil: 'networkidle' });
    const stops = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(150);
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const header = document.querySelector('[data-header]').getBoundingClientRect();
        const bar = document.querySelector('[data-order-bar][data-show]')?.getBoundingClientRect();
        const covered = !el.closest('[data-header]') && !el.closest('[data-order-bar]') && !el.classList.contains('skip-link') && (r.top < header.bottom - 2 || (bar && bar.height > 0 && r.bottom > bar.top + 2));
        return {
          label: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 38),
          visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
          outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
          covered,
          small: r.height < 24 || r.width < 24,
        };
      });
      if (!info) continue;
      stops.push(info);
      const bad = !info.visible || !info.outline || info.covered;
      if (bad) problems++;
      if (bad || i < 8) console.log(`${vp.width}px #${i + 1} ${bad ? 'PROBLEM' : 'ok'} "${info.label}" visible=${info.visible} outline=${info.outline} covered=${info.covered}`);
    }
    console.log(`${vp.width}px: ${stops.length} stops checked`);
    await page.close();
  }
} finally {
  await browser.close();
  srv.kill();
}
console.log(problems ? `${problems} problems` : 'keyboard walk clean');
