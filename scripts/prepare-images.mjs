// One-time, reproducible crops of the source photos/logos in raw/ into src/assets/.
import sharp from 'sharp';

const crops = [
  // Plate of chocolate chunk cookies: cut the toaster, glass and floor tiles.
  { src: 'raw/cookies-plate-orig.png', out: 'src/assets/products/chocolate-chip.jpg', box: { left: 78, top: 226, width: 500, height: 456 }, warm: [1.02, 1, 0.97] },
  // S'mores on the rack: drop the spatula and the last row.
  // The rack shot is cooler (grey counter): warm it to match the plate.
  { src: 'raw/smores-rack-orig.png', out: 'src/assets/products/smores.jpg', box: { left: 108, top: 10, width: 484, height: 574 }, warm: [1.07, 1.01, 0.88] },
];

for (const c of crops) {
  await sharp(c.src)
    .extract(c.box)
    .recomb([[c.warm[0], 0, 0], [0, c.warm[1], 0], [0, 0, c.warm[2]]])
    .modulate({ brightness: 1.04, saturation: 1.05 })
    .linear(1.05, -5)
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(c.out);
  console.log('wrote', c.out);
}

// Trim the transparent margin so the mark fills the header slot.
await sharp('raw/logo-house.png').trim({ threshold: 1 }).resize({ height: 240 }).png({ compressionLevel: 9 }).toFile('src/assets/brand/logo-house.png');
await sharp('raw/logo-badge.png').resize({ width: 480 }).png({ compressionLevel: 9 }).toFile('src/assets/brand/logo-badge.png');
console.log('wrote logos');
