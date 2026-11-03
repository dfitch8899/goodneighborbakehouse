// Renders public/og.png (1200x630 link preview) with Playwright from brand assets.
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');

const b64 = async (p) => (await readFile(new URL(`../${p}`, import.meta.url))).toString('base64');
const [fr, fri, dm, photo, logo] = await Promise.all([
  b64('src/assets/fonts/fraunces.woff2'), b64('src/assets/fonts/fraunces-italic.woff2'), b64('src/assets/fonts/dm-sans.woff2'),
  b64('src/assets/products/chocolate-chip.jpg'), b64('src/assets/brand/logo-house.png'),
]);
const html = `<!doctype html><html><head><style>
@font-face{font-family:F;src:url(data:font/woff2;base64,${fr})}
@font-face{font-family:F;font-style:italic;src:url(data:font/woff2;base64,${fri})}
@font-face{font-family:D;src:url(data:font/woff2;base64,${dm})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F8F2E8;color:#4D352C;font-family:D;display:grid;grid-template-columns:1fr 470px;align-items:center;gap:40px;padding:0 70px;overflow:hidden}
.logo{height:96px;margin-bottom:34px}
h1{font-family:F;font-weight:400;font-size:84px;line-height:1;letter-spacing:-.02em}
em{color:#96553D}
p{margin-top:28px;font-size:28px;color:#6B5248}
.arch{width:440px;height:520px;border-radius:999px 999px 24px 24px;overflow:hidden;outline:2px solid #4D352C;outline-offset:12px;margin-top:50px}
.arch img{width:100%;height:100%;object-fit:cover}
</style></head><body>
<div><img class="logo" src="data:image/png;base64,${logo}"><h1>A little sweetness, <em>close to home.</em></h1><p>Small-batch cookies · Athens, Ohio</p></div>
<div class="arch"><img src="data:image/jpeg;base64,${photo}"></div>
</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await createRequire(import.meta.url)('sharp')('public/og.png').png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer().then((b) => import('node:fs').then((fs) => fs.writeFileSync('public/og.png', b)));
await browser.close();
console.log('wrote public/og.png');
