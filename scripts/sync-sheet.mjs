// Pulls Mia's published Google Sheet (or local fixtures) into src/data/menu.json.
// On any fetch or validation error the existing snapshot is kept, so a bad edit
// in the sheet can never take the site down.
//
//   SHEET_SOURCE=fixture node scripts/sync-sheet.mjs            (default; uses scripts/fixtures)
//   SHEET_SOURCE=live SHEET_ID=<id from the sheet's URL> node scripts/sync-sheet.mjs
//
// The sheet must be shared as "Anyone with the link: Viewer". Tabs are read by name
// (menu, bundles, settings) through Google's CSV export, so their order doesn't matter.
import { readFile, writeFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { MenuData } from '../src/data/schema.mjs';

const OUT = new URL('../src/data/menu.json', import.meta.url);
const source = process.env.SHEET_SOURCE || 'fixture';

async function loadCsv(tab) {
  if (source === 'fixture') {
    const dir = process.env.FIXTURE_DIR || new URL('./fixtures/', import.meta.url).pathname;
    return readFile(`${dir.replace(/\/?$/, '/')}${tab}.csv`, 'utf8');
  }
  const id = process.env.SHEET_ID;
  if (!id) throw new Error('Missing SHEET_ID');
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${tab}: HTTP ${res.status} from Google Sheets. Is the sheet shared as "Anyone with the link"?`);
  const body = await res.text();
  if (/^\s*<(!doctype|html)/i.test(body)) throw new Error(`${tab}: got a sign-in page, not CSV. Share the sheet as "Anyone with the link: Viewer".`);
  return body;
}

const rows = (csv) =>
  parse(csv, { columns: (h) => h.map((c) => c.trim().toLowerCase()), skip_empty_lines: true, trim: true, bom: true })
    // Ignore fully blank rows Mia might leave between items.
    .filter((r) => Object.values(r).some((v) => String(v).trim() !== ''));

async function main() {
  const [menuCsv, bundlesCsv, settingsCsv] = await Promise.all(['menu', 'bundles', 'settings'].map(loadCsv));
  const settings = Object.fromEntries(rows(settingsCsv).map((r) => [String(r.key).trim().toLowerCase(), r.value ?? '']));
  const candidate = {
    updatedAt: new Date().toISOString(),
    source,
    menu: rows(menuCsv),
    bundles: rows(bundlesCsv),
    settings,
  };

  const parsed = MenuData.safeParse(candidate);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => {
      const [tab, row, field] = i.path;
      const where = typeof row === 'number' ? `${tab} tab, row ${row + 2}${field ? `, column "${field}"` : ''}` : i.path.join('.');
      return `  - ${where}: ${i.message}`;
    });
    throw new Error(`The sheet has a problem, so the site kept the last good menu:\n${lines.join('\n')}`);
  }

  const data = parsed.data;
  data.menu.sort((a, b) => a.sort - b.sort);
  data.bundles.sort((a, b) => a.sort - b.sort);
  await syncPhotos(data.menu);

  // Only rewrite when content changed, so scheduled runs don't create empty commits.
  let previous = null;
  try { previous = JSON.parse(await readFile(OUT, 'utf8')); } catch {}
  const strip = ({ updatedAt, source, ...rest }) => JSON.stringify(rest);
  if (previous && strip(previous) === strip(data)) {
    console.log('Menu unchanged.');
    return;
  }
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`Wrote ${data.menu.length} menu items, ${data.bundles.length} bundles from ${source}.`);
}

// The sheet's "image" column can hold a Google Drive share link (the file shared as
// "Anyone with the link"). Each linked photo is downloaded, turned upright, resized
// and saved as src/assets/products/<id>.jpg, so it stays attached to its row's item.
// A photo that can't be fetched keeps whatever is already in the repo.
const PHOTOS = new URL('../src/assets/products/', import.meta.url);

function driveFileId(link) {
  const m = link.match(/\/d\/([\w-]{20,})/) || link.match(/[?&]id=([\w-]{20,})/);
  return m ? m[1] : null;
}

async function syncPhotos(items) {
  const linked = items.filter((m) => /^https?:\/\//i.test(m.image));
  if (!linked.length) return;
  if (source !== 'live') {
    console.log(`Skipping ${linked.length} photo link(s) outside the live sync.`);
    return;
  }
  const { default: sharp } = await import('sharp');
  for (const item of linked) {
    try {
      const id = driveFileId(item.image);
      if (!id) throw new Error('not a Google Drive file link');
      const res = await fetch(`https://drive.google.com/uc?export=download&id=${id}`, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
      const type = res.headers.get('content-type') || '';
      if (!res.ok || !type.startsWith('image/')) throw new Error(`got ${res.status} ${type.split(';')[0]}; is the photo shared as "Anyone with the link"?`);
      const jpg = await sharp(Buffer.from(await res.arrayBuffer()))
        .rotate()
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 86, mozjpeg: true })
        .toBuffer();
      const file = new URL(`${item.id}.jpg`, PHOTOS);
      let current = null;
      try { current = await readFile(file); } catch {}
      if (current && current.equals(jpg)) continue;
      await writeFile(file, jpg);
      console.log(`Saved photo for ${item.id}.`);
    } catch (err) {
      console.error(`::warning::Photo for "${item.name}" (menu tab) wasn't updated: ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error(`::warning::${err.message.split('\n')[0]}`);
  console.error(err.message);
  // Exit 0: keeping the previous snapshot is the intended fallback.
  process.exit(0);
});
