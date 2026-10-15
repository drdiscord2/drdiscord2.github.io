// Generates src/data/cpus.json and src/data/gpus.json — deterministic, no network.
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const outDir = resolve(process.cwd(), 'src/data');

// ---------- helpers ----------
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function priceHistory(launch, current, year, seed) {
  const rnd = mulberry32(seed);
  const pts = [];
  const nowY = 2026;
  const months = Math.max(6, (nowY - year) * 12);
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const back = nowY - Math.round((1 - t) * (nowY - year));
    const mm = ((Math.floor(rnd() * 12) % 12) + 1).toString().padStart(2, '0');
    const base = launch + (current - launch) * Math.pow(t, 0.8);
    const noise = 1 + (rnd() - 0.5) * 0.08;
    pts.push({ m: `${back}-${mm}`, p: Math.max(40, Math.round(base * noise)) });
  }
  if (pts.length && months) pts[pts.length - 1].p = current;
  return pts;
}

// ---------- CPU rows ----------
const R = (...a) => a;

const cpuRows = [
  // ===== Intel desktop =====
  R('Intel Core i9-14900KS', 'Intel', 'Core i9', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 24, 32, 3.2, 6.2, 36, 150, 10, 2024, 649, 610, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i9-14900K', 'Intel', 'Core i9', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 24, 32, 3.0, 6.0, 36, 125, 10, 2023, 589, 510, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i9-14900KF', 'Intel', 'Core i9', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 24, 32, 3.0, 6.0, 36, 125, 10, 2023, 564, 480, null, 'DDR4/DDR5', true, true),
  R('Intel Core i7-14700K', 'Intel', 'Core i7', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 20, 28, 3.4, 5.6, 33, 125, 10, 2023, 409, 365, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i7-14700F', 'Intel', 'Core i7', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 20, 28, 2.1, 5.4, 33, 65, 10, 2024, 379, 320, null, 'DDR4/DDR5', false, false),
  R('Intel Core i5-14600K', 'Intel', 'Core i5', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 14, 20, 3.5, 5.3, 24, 125, 10, 2023, 319, 265, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i5-14500', 'Intel', 'Core i5', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 14, 20, 2.5, 5.0, 24, 65, 10, 2024, 291, 235, 'UHD 770', 'DDR4/DDR5', false, false),
  R('Intel Core i5-14400F', 'Intel', 'Core i5', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 10, 16, 2.5, 4.7, 20, 65, 10, 2024, 221, 178, null, 'DDR4/DDR5', false, false),
  R('Intel Core i3-14100', 'Intel', 'Core i3', 'desktop', 'Raptor Lake Refresh', 'LGA 1700', 4, 8, 3.5, 4.7, 12, 60, 10, 2024, 149, 132, 'UHD 730', 'DDR4/DDR5', false, false),
  R('Intel Core i9-13900KS', 'Intel', 'Core i9', 'desktop', 'Raptor Lake', 'LGA 1700', 24, 32, 3.5, 6.0, 36, 150, 10, 2023, 699, 560, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i9-13900K', 'Intel', 'Core i9', 'desktop', 'Raptor Lake', 'LGA 1700', 24, 32, 3.0, 5.8, 36, 125, 10, 2022, 589, 470, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i9-13900', 'Intel', 'Core i9', 'desktop', 'Raptor Lake', 'LGA 1700', 24, 32, 2.0, 5.6, 36, 65, 10, 2023, 549, 460, 'UHD 770', 'DDR4/DDR5', false, false),
  R('Intel Core i7-13700K', 'Intel', 'Core i7', 'desktop', 'Raptor Lake', 'LGA 1700', 16, 24, 3.4, 5.4, 30, 125, 10, 2022, 409, 330, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i7-13700F', 'Intel', 'Core i7', 'desktop', 'Raptor Lake', 'LGA 1700', 16, 24, 2.1, 5.2, 24, 65, 10, 2023, 384, 290, null, 'DDR4/DDR5', false, false),
  R('Intel Core i5-13600K', 'Intel', 'Core i5', 'desktop', 'Raptor Lake', 'LGA 1700', 14, 20, 3.5, 5.1, 24, 125, 10, 2022, 319, 255, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i5-13500', 'Intel', 'Core i5', 'desktop', 'Raptor Lake', 'LGA 1700', 14, 20, 2.5, 4.8, 20, 65, 10, 2023, 257, 210, 'UHD 770', 'DDR4/DDR5', false, false),
  R('Intel Core i5-13400F', 'Intel', 'Core i5', 'desktop', 'Raptor Lake', 'LGA 1700', 10, 16, 2.5, 4.6, 20, 65, 10, 2023, 221, 172, null, 'DDR4/DDR5', false, false),
  R('Intel Core i3-13100', 'Intel', 'Core i3', 'desktop', 'Alder Lake', 'LGA 1700', 4, 8, 3.4, 4.5, 12, 60, 10, 2023, 143, 118, 'UHD 730', 'DDR4/DDR5', false, false),
  R('Intel Core i9-12900K', 'Intel', 'Core i9', 'desktop', 'Alder Lake', 'LGA 1700', 16, 24, 3.2, 5.2, 30, 125, 10, 2021, 589, 380, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i7-12700K', 'Intel', 'Core i7', 'desktop', 'Alder Lake', 'LGA 1700', 12, 20, 3.6, 5.0, 25, 125, 10, 2021, 409, 295, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i5-12600K', 'Intel', 'Core i5', 'desktop', 'Alder Lake', 'LGA 1700', 10, 16, 3.7, 4.9, 20, 125, 10, 2021, 289, 195, 'UHD 770', 'DDR4/DDR5', true, true),
  R('Intel Core i5-12400F', 'Intel', 'Core i5', 'desktop', 'Alder Lake', 'LGA 1700', 6, 12, 2.5, 4.4, 18, 65, 10, 2022, 184, 118, null, 'DDR4/DDR5', false, false),
  R('Intel Core i3-12100F', 'Intel', 'Core i3', 'desktop', 'Alder Lake', 'LGA 1700', 4, 8, 3.3, 4.3, 12, 58, 10, 2022, 118, 82, null, 'DDR4/DDR5', false, false),
  R('Intel Core i9-11900K', 'Intel', 'Core i9', 'desktop', 'Rocket Lake', 'LGA 1200', 8, 16, 3.5, 5.3, 16, 125, 14, 2021, 539, 320, 'UHD 750', 'DDR4', true, true),
  R('Intel Core i7-11700K', 'Intel', 'Core i7', 'desktop', 'Rocket Lake', 'LGA 1200', 8, 16, 3.6, 5.0, 16, 125, 14, 2021, 459, 260, 'UHD 750', 'DDR4', true, true),
  R('Intel Core i5-11600K', 'Intel', 'Core i5', 'desktop', 'Rocket Lake', 'LGA 1200', 6, 12, 3.9, 4.9, 12, 125, 14, 2021, 262, 180, 'UHD 750', 'DDR4', true, true),
  R('Intel Core i9-10900K', 'Intel', 'Core i9', 'desktop', 'Comet Lake', 'LGA 1200', 10, 20, 3.7, 5.3, 20, 125, 14, 2020, 488, 300, 'UHD 630', 'DDR4', true, true),
  R('Intel Core i7-10700K', 'Intel', 'Core i7', 'desktop', 'Comet Lake', 'LGA 1200', 8, 16, 3.8, 5.1, 16, 125, 14, 2020, 374, 230, 'UHD 630', 'DDR4', true, true),
  R('Intel Core i5-10400F', 'Intel', 'Core i5', 'desktop', 'Comet Lake', 'LGA 1200', 6, 12, 2.9, 4.3, 12, 65, 14, 2020, 157, 105, null, 'DDR4', false, false),
  R('Intel Core i9-9900K', 'Intel', 'Core i9', 'desktop', 'Coffee Lake', 'LGA 1151', 8, 16, 3.6, 5.0, 16, 95, 14, 2018, 499, 280, 'UHD 630', 'DDR4', true, true),
  R('Intel Core i7-9700K', 'Intel', 'Core i7', 'desktop', 'Coffee Lake', 'LGA 1151', 8, 8, 3.6, 4.9, 12, 95, 14, 2018, 409, 210, 'UHD 630', 'DDR4', true, true),
  R('Intel Core i5-9600K', 'Intel', 'Core i5', 'desktop', 'Coffee Lake', 'LGA 1151', 6, 6, 3.7, 4.6, 9, 95, 14, 2018, 262, 155, 'UHD 630', 'DDR4', true, true),
  R('Intel Core i7-8700K', 'Intel', 'Core i7', 'desktop', 'Coffee Lake', 'LGA 1151', 6, 12, 3.7, 4.7, 12, 95, 14, 2017, 359, 190, 'UHD 630', 'DDR4', true, true),
  R('Intel Core i5-8400', 'Intel', 'Core i5', 'desktop', 'Coffee Lake', 'LGA 1151', 6, 6, 2.8, 4.0, 9, 65, 14, 2017, 182, 110, 'UHD 630', 'DDR4', false, false),
  R('Intel Core i7-7700K', 'Intel', 'Core i7', 'desktop', 'Kaby Lake', 'LGA 1151', 4, 8, 4.2, 4.5, 8, 91, 14, 2017, 339, 170, 'HD 630', 'DDR4/DDR3L', true, true),
  R('Intel Core i5-7600K', 'Intel', 'Core i5', 'desktop', 'Kaby Lake', 'LGA 1151', 4, 4, 3.8, 4.2, 6, 91, 14, 2017, 242, 130, 'HD 630', 'DDR4/DDR3L', true, true),
  R('Intel Core i7-6700K', 'Intel', 'Core i7', 'desktop', 'Skylake', 'LGA 1151', 4, 8, 4.0, 4.2, 8, 91, 14, 2015, 350, 150, 'HD 530', 'DDR4/DDR3L', true, true),
  R('Intel Core i5-6600K', 'Intel', 'Core i5', 'desktop', 'Skylake', 'LGA 1151', 4, 4, 3.5, 3.9, 6, 91, 14, 2015, 243, 115, 'HD 530', 'DDR4/DDR3L', true, true),
  R('Intel Core i7-4790K', 'Intel', 'Core i7', 'desktop', 'Haswell', 'LGA 1150', 4, 8, 4.0, 4.4, 8, 88, 22, 2014, 339, 130, 'HD 4600', 'DDR3', true, true),
  R('Intel Core i5-4670K', 'Intel', 'Core i5', 'desktop', 'Haswell', 'LGA 1150', 4, 4, 3.4, 3.9, 6, 84, 22, 2013, 242, 95, 'HD 4600', 'DDR3', true, true),
  R('Intel Core i7-3770K', 'Intel', 'Core i7', 'desktop', 'Ivy Bridge', 'LGA 1155', 4, 8, 3.5, 3.9, 8, 77, 22, 2012, 342, 90, 'HD 4000', 'DDR3', true, true),
  R('Intel Core i5-2500K', 'Intel', 'Core i5', 'desktop', 'Sandy Bridge', 'LGA 1155', 4, 4, 3.3, 3.7, 6, 95, 32, 2011, 225, 75, 'HD 3000', 'DDR3', true, true),
  R('Intel Pentium G4560', 'Intel', 'Pentium', 'desktop', 'Kaby Lake', 'LGA 1151', 2, 4, 3.5, 3.5, 3, 54, 14, 2017, 64, 45, 'HD 610', 'DDR4/DDR3L', false, false),
  // ===== Intel server =====
  R('Intel Xeon w9-3495X', 'Intel', 'Xeon W', 'server', 'Sapphire Rapids', 'LGA 4677', 56, 112, 1.9, 4.8, 105, 350, 10, 2023, 5700, 4800, null, 'DDR5 ECC', true, true),
  R('Intel Xeon w7-3470X', 'Intel', 'Xeon W', 'server', 'Sapphire Rapids', 'LGA 4677', 28, 56, 2.9, 4.8, 105, 300, 10, 2023, 2999, 2450, null, 'DDR5 ECC', true, true),
  R('Intel Xeon w5-2455X', 'Intel', 'Xeon W', 'server', 'Sapphire Rapids', 'LGA 4677', 12, 24, 3.2, 4.6, 30, 200, 10, 2023, 1399, 1100, null, 'DDR5 ECC', true, true),
  R('Intel Xeon Platinum 8490H', 'Intel', 'Xeon Scalable', 'server', 'Sapphire Rapids', 'LGA 4677', 60, 120, 1.9, 3.5, 112.5, 350, 10, 2023, null, 11000, null, 'DDR5 ECC', false, false),
  R('Intel Xeon Gold 6438Y', 'Intel', 'Xeon Scalable', 'server', 'Sapphire Rapids', 'LGA 4677', 32, 64, 2.0, 4.0, 60, 270, 10, 2023, null, 4900, null, 'DDR5 ECC', false, false),
  R('Intel Xeon Silver 4410Y', 'Intel', 'Xeon Scalable', 'server', 'Sapphire Rapids', 'LGA 4677', 12, 24, 2.0, 3.0, 30, 150, 10, 2023, 1200, 950, null, 'DDR5 ECC', false, false),
  R('Intel Xeon E-2488', 'Intel', 'Xeon E', 'server', 'Raptor Lake', 'LGA 1700', 8, 16, 3.2, 4.8, 24, 125, 10, 2023, 610, 520, null, 'DDR5 ECC', false, false),
  R('Intel Xeon w-2295', 'Intel', 'Xeon W', 'server', 'Cascade Lake', 'LGA 2066', 18, 36, 3.0, 4.6, 24.75, 165, 14, 2019, 2553, 1600, null, 'DDR4 ECC', true, true),
  R('Intel Xeon Gold 6248R', 'Intel', 'Xeon Scalable', 'server', 'Cascade Lake', 'LGA 3647', 24, 48, 3.0, 4.0, 35.75, 205, 14, 2020, 5500, 3200, null, 'DDR4 ECC', false, false),
  R('Intel Xeon E-2288G', 'Intel', 'Xeon E', 'server', 'Coffee Lake', 'LGA 1151', 8, 16, 3.7, 5.0, 16, 95, 14, 2019, 580, 420, 'P630', 'DDR4 ECC', false, false),
  R('Intel Xeon E3-1230 v3', 'Intel', 'Xeon E3', 'server', 'Haswell', 'LGA 1150', 4, 8, 3.2, 3.7, 8, 80, 22, 2013, 240, 70, null, 'DDR3 ECC', false, false),
  R('Intel Xeon E5-2699 v4', 'Intel', 'Xeon E5', 'server', 'Broadwell', 'LGA 2011-3', 22, 44, 2.2, 3.6, 55, 145, 14, 2016, 4451, 600, null, 'DDR4 ECC', false, false),
  R('Intel Xeon E5-2680 v2', 'Intel', 'Xeon E5', 'server', 'Ivy Bridge-EP', 'LGA 2011', 10, 20, 2.8, 3.5, 25, 115, 22, 2013, 1726, 60, null, 'DDR3 ECC', false, false),
  // ===== Intel mobile =====
  R('Intel Core Ultra 9 285HX', 'Intel', 'Core Ultra', 'mobile', 'Arrow Lake-HX', 'BGA 2114', 24, 24, 2.7, 5.5, 36, 55, 3, 2025, null, null, 'Xe 32 EU', 'DDR5', false, false),
  R('Intel Core Ultra 9 185H', 'Intel', 'Core Ultra', 'mobile', 'Meteor Lake', 'BGA 2049', 16, 22, 2.3, 5.1, 24, 28, 7, 2023, null, null, 'Arc Graphics', 'DDR5/LPDDR5', false, false),
  R('Intel Core Ultra 7 265H', 'Intel', 'Core Ultra', 'mobile', 'Arrow Lake-H', 'BGA 2079', 16, 16, 2.4, 5.3, 24, 28, 3, 2025, null, null, 'Xe 128 EU', 'DDR5/LPDDR5', false, false),
  R('Intel Core Ultra 7 155H', 'Intel', 'Core Ultra', 'mobile', 'Meteor Lake', 'BGA 2049', 16, 22, 1.7, 4.8, 24, 28, 7, 2023, null, null, 'Arc Graphics', 'DDR5/LPDDR5', false, false),
  R('Intel Core Ultra 5 125H', 'Intel', 'Core Ultra', 'mobile', 'Meteor Lake', 'BGA 2049', 14, 18, 1.8, 4.5, 18, 28, 7, 2023, null, null, 'Arc Graphics', 'DDR5/LPDDR5', false, false),
  R('Intel Core i9-14900HX', 'Intel', 'Core i9', 'mobile', 'Raptor Lake-HX', 'BGA 1964', 24, 32, 2.2, 5.8, 36, 55, 10, 2024, null, null, 'UHD 770', 'DDR5', false, false),
  R('Intel Core i9-13900HX', 'Intel', 'Core i9', 'mobile', 'Raptor Lake-HX', 'BGA 1964', 24, 32, 2.2, 5.6, 36, 55, 10, 2023, null, null, 'UHD 770', 'DDR5', false, false),
  R('Intel Core i7-13700H', 'Intel', 'Core i7', 'mobile', 'Raptor Lake-H', 'BGA 1744', 14, 20, 2.4, 5.0, 24, 45, 10, 2023, null, null, 'Iris Xe 96EU', 'DDR4/DDR5', false, false),
  R('Intel Core i7-12700H', 'Intel', 'Core i7', 'mobile', 'Alder Lake-H', 'BGA 1744', 14, 20, 2.3, 4.7, 24, 45, 10, 2022, null, null, 'Iris Xe 96EU', 'DDR4/DDR5', false, false),
  R('Intel Core i5-13500H', 'Intel', 'Core i5', 'mobile', 'Raptor Lake-H', 'BGA 1744', 12, 16, 2.6, 4.7, 18, 45, 10, 2023, null, null, 'Iris Xe 80EU', 'DDR4/DDR5', false, false),
  R('Intel Core i5-12500H', 'Intel', 'Core i5', 'mobile', 'Alder Lake-H', 'BGA 1744', 12, 16, 2.5, 4.5, 18, 45, 10, 2022, null, null, 'Iris Xe 80EU', 'DDR4/DDR5', false, false),
  R('Intel Core i7-11800H', 'Intel', 'Core i7', 'mobile', 'Tiger Lake-H', 'BGA 1469', 8, 16, 2.3, 4.6, 24, 45, 10, 2021, null, null, 'UHD 750', 'DDR4', false, false),
  R('Intel Core i5-11400H', 'Intel', 'Core i5', 'mobile', 'Tiger Lake-H', 'BGA 1469', 6, 12, 2.7, 4.5, 12, 45, 10, 2021, null, null, 'UHD 750', 'DDR4', false, false),
  R('Intel Core i7-10750H', 'Intel', 'Core i7', 'mobile', 'Comet Lake-H', 'BGA 1440', 6, 12, 2.6, 5.0, 12, 45, 14, 2020, null, null, 'UHD 630', 'DDR4', false, false),
  R('Intel Core i7-9750H', 'Intel', 'Core i7', 'mobile', 'Coffee Lake-H', 'BGA 1440', 6, 12, 2.6, 4.5, 12, 45, 14, 2018, null, null, 'UHD 630', 'DDR4', false, false),
  R('Intel Core i5-8300H', 'Intel', 'Core i5', 'mobile', 'Coffee Lake-H', 'BGA 1440', 4, 8, 2.3, 4.0, 8, 45, 14, 2018, null, null, 'UHD 630', 'DDR4', false, false),
  R('Intel Core i7-8750H', 'Intel', 'Core i7', 'mobile', 'Coffee Lake-H', 'BGA 1440', 6, 12, 2.2, 4.1, 12, 45, 14, 2018, null, null, 'UHD 630', 'DDR4', false, false),
  // ===== Intel legacy =====
  R('Intel Pentium 4 3.06 GHz', 'Intel', 'Pentium 4', 'legacy', 'Northwood', 'Socket 478', 1, 2, 3.06, 3.06, 0.512, 82, 130, 2002, 990, 15, null, 'SDRAM/RDRAM', false, false),
  R('Intel Core 2 Duo E6600', 'Intel', 'Core 2 Duo', 'legacy', 'Conroe', 'LGA 775', 2, 2, 2.4, 2.4, 4, 65, 65, 2006, 316, 20, null, 'DDR2', true, false),
  R('Intel Core 2 Quad Q9650', 'Intel', 'Core 2 Quad', 'legacy', 'Yorkfield', 'LGA 775', 4, 4, 3.0, 3.0, 12, 95, 45, 2008, 316, 25, null, 'DDR2', true, false),
  R('Intel Core i7-920', 'Intel', 'Core i7', 'legacy', 'Nehalem', 'LGA 1366', 4, 8, 2.66, 2.66, 8, 130, 45, 2008, 294, 30, null, 'DDR3', true, false),
  R('Intel Core i7-2600K', 'Intel', 'Core i7', 'legacy', 'Sandy Bridge', 'LGA 1155', 4, 8, 3.4, 3.8, 8, 95, 32, 2011, 317, 85, 'HD 3000', 'DDR3', true, true),
  R('Intel Core i7-4770K', 'Intel', 'Core i7', 'legacy', 'Haswell', 'LGA 1150', 4, 8, 3.5, 3.9, 8, 84, 22, 2013, 339, 110, 'HD 4600', 'DDR3', true, true),
  R('Intel Core i7-6700', 'Intel', 'Core i7', 'legacy', 'Skylake', 'LGA 1151', 4, 8, 3.4, 4.0, 8, 65, 14, 2015, 303, 100, 'HD 530', 'DDR4/DDR3L', false, false),
  R('Intel Core i7-8700', 'Intel', 'Core i7', 'legacy', 'Coffee Lake', 'LGA 1151', 6, 12, 3.2, 4.6, 12, 65, 14, 2018, 303, 150, 'UHD 630', 'DDR4', false, false),

  // ===== AMD desktop =====
  R('AMD Ryzen 9 9950X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 5', 'AM5', 16, 32, 4.3, 5.7, 64, 170, 4, 2024, 649, 600, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 9 9900X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 5', 'AM5', 12, 24, 4.4, 5.6, 64, 120, 4, 2024, 499, 430, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 7 9700X', 'AMD', 'Ryzen 7', 'desktop', 'Zen 5', 'AM5', 8, 16, 3.8, 5.5, 32, 65, 4, 2024, 359, 310, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 5 9600X', 'AMD', 'Ryzen 5', 'desktop', 'Zen 5', 'AM5', 6, 12, 3.9, 5.4, 32, 65, 4, 2024, 279, 225, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 9 7950X3D', 'AMD', 'Ryzen 9', 'desktop', 'Zen 4 3D V-Cache', 'AM5', 16, 32, 4.2, 5.4, 128, 120, 5, 2023, 699, 580, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 9 7950X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 4', 'AM5', 16, 32, 4.5, 5.7, 64, 105, 5, 2022, 699, 490, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 9 7900X3D', 'AMD', 'Ryzen 9', 'desktop', 'Zen 4 3D V-Cache', 'AM5', 8, 16, 4.4, 5.6, 128, 120, 5, 2023, 449, 400, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 9 7900X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 4', 'AM5', 12, 24, 4.7, 5.6, 64, 105, 5, 2022, 549, 380, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 7 7800X3D', 'AMD', 'Ryzen 7', 'desktop', 'Zen 4 3D V-Cache', 'AM5', 8, 16, 4.2, 5.0, 96, 120, 5, 2023, 449, 360, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 7 7700X', 'AMD', 'Ryzen 7', 'desktop', 'Zen 4', 'AM5', 8, 16, 4.5, 5.4, 32, 105, 5, 2022, 399, 290, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 7 7700', 'AMD', 'Ryzen 7', 'desktop', 'Zen 4', 'AM5', 8, 16, 3.8, 5.3, 32, 65, 5, 2023, 359, 280, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 5 7600X', 'AMD', 'Ryzen 5', 'desktop', 'Zen 4', 'AM5', 6, 12, 4.7, 5.3, 32, 105, 5, 2022, 299, 210, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 5 7600', 'AMD', 'Ryzen 5', 'desktop', 'Zen 4', 'AM5', 6, 12, 3.8, 5.1, 32, 65, 5, 2023, 259, 195, 'RDNA2 2CU', 'DDR5', true, true),
  R('AMD Ryzen 5 7500F', 'AMD', 'Ryzen 5', 'desktop', 'Zen 4', 'AM5', 6, 12, 3.7, 5.0, 32, 65, 5, 2023, 199, 165, null, 'DDR5', true, true),
  R('AMD Ryzen 9 5950X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 3', 'AM4', 16, 32, 3.4, 4.9, 64, 105, 7, 2020, 799, 480, null, 'DDR4', true, true),
  R('AMD Ryzen 9 5900X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 3', 'AM4', 12, 24, 3.7, 4.8, 64, 105, 7, 2020, 549, 360, null, 'DDR4', true, true),
  R('AMD Ryzen 7 5800X3D', 'AMD', 'Ryzen 7', 'desktop', 'Zen 3 3D V-Cache', 'AM4', 8, 16, 3.4, 4.5, 96, 105, 7, 2022, 449, 300, null, 'DDR4', true, true),
  R('AMD Ryzen 7 5800X', 'AMD', 'Ryzen 7', 'desktop', 'Zen 3', 'AM4', 8, 16, 3.8, 4.7, 32, 105, 7, 2020, 449, 220, null, 'DDR4', true, true),
  R('AMD Ryzen 5 5600X', 'AMD', 'Ryzen 5', 'desktop', 'Zen 3', 'AM4', 6, 12, 3.7, 4.6, 32, 65, 7, 2020, 299, 150, null, 'DDR4', true, true),
  R('AMD Ryzen 5 5600', 'AMD', 'Ryzen 5', 'desktop', 'Zen 3', 'AM4', 6, 12, 3.5, 4.4, 32, 65, 7, 2022, 199, 135, null, 'DDR4', true, true),
  R('AMD Ryzen 5 5500', 'AMD', 'Ryzen 5', 'desktop', 'Zen 3', 'AM4', 6, 12, 3.6, 4.2, 16, 65, 7, 2022, 159, 115, null, 'DDR4', true, true),
  R('AMD Ryzen 3 4100', 'AMD', 'Ryzen 3', 'desktop', 'Zen 3', 'AM4', 4, 8, 3.8, 4.0, 16, 65, 7, 2021, 99, 80, null, 'DDR4', true, true),
  R('AMD Ryzen 9 3950X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 2', 'AM4', 16, 32, 3.5, 4.7, 64, 105, 7, 2019, 749, 420, null, 'DDR4', true, true),
  R('AMD Ryzen 9 3900X', 'AMD', 'Ryzen 9', 'desktop', 'Zen 2', 'AM4', 12, 24, 3.8, 4.6, 64, 105, 7, 2019, 499, 300, null, 'DDR4', true, true),
  R('AMD Ryzen 7 3700X', 'AMD', 'Ryzen 7', 'desktop', 'Zen 2', 'AM4', 8, 16, 3.6, 4.4, 32, 65, 7, 2019, 329, 190, null, 'DDR4', true, true),
  R('AMD Ryzen 5 3600', 'AMD', 'Ryzen 5', 'desktop', 'Zen 2', 'AM4', 6, 12, 3.6, 4.2, 32, 65, 7, 2019, 199, 120, null, 'DDR4', true, true),
  R('AMD Ryzen 5 2600', 'AMD', 'Ryzen 5', 'desktop', 'Zen+', 'AM4', 6, 12, 3.4, 3.9, 16, 65, 12, 2018, 199, 95, null, 'DDR4', true, true),
  R('AMD Ryzen 7 2700X', 'AMD', 'Ryzen 7', 'desktop', 'Zen+', 'AM4', 8, 16, 3.7, 4.3, 16, 105, 12, 2018, 329, 150, null, 'DDR4', true, true),
  R('AMD Ryzen 7 1800X', 'AMD', 'Ryzen 7', 'desktop', 'Zen', 'AM4', 8, 16, 3.6, 4.0, 16, 95, 14, 2017, 499, 160, null, 'DDR4', true, true),
  R('AMD Ryzen 5 1600', 'AMD', 'Ryzen 5', 'desktop', 'Zen', 'AM4', 6, 12, 3.2, 3.6, 16, 65, 14, 2017, 219, 85, null, 'DDR4', true, true),
  R('AMD Athlon 3000G', 'AMD', 'Athlon', 'desktop', 'Zen', 'AM4', 2, 4, 3.5, 3.5, 4, 35, 14, 2020, 60, 55, 'Vega 3', 'DDR4', true, true),
  R('AMD Threadripper PRO 7995WX', 'AMD', 'Threadripper PRO', 'desktop', 'Zen 4', 'sWRX90', 96, 192, 2.5, 5.1, 384, 350, 5, 2023, 9990, 8500, null, 'DDR5 ECC', true, true),
  R('AMD Threadripper PRO 7965WX', 'AMD', 'Threadripper PRO', 'desktop', 'Zen 4', 'sWRX90', 24, 48, 4.2, 5.5, 128, 350, 5, 2023, 3690, 2900, null, 'DDR5 ECC', true, true),
  R('AMD Threadripper 7980X', 'AMD', 'Threadripper', 'desktop', 'Zen 4', 'sTR5', 64, 128, 3.2, 5.4, 256, 350, 5, 2023, 4990, 4300, null, 'DDR5 ECC', true, true),
  R('AMD Threadripper 7970X', 'AMD', 'Threadripper', 'desktop', 'Zen 4', 'sTR5', 32, 64, 4.0, 5.6, 128, 350, 5, 2023, 3490, 2950, null, 'DDR5 ECC', true, true),
  R('AMD Threadripper 3990X', 'AMD', 'Threadripper', 'desktop', 'Zen 2', 'sTRX4', 64, 128, 2.9, 4.3, 256, 280, 7, 2020, 3990, 2600, null, 'DDR4 ECC', true, true),
  R('AMD Threadripper 3970X', 'AMD', 'Threadripper', 'desktop', 'Zen 2', 'sTRX4', 32, 64, 3.7, 4.5, 128, 280, 7, 2019, 1999, 1100, null, 'DDR4 ECC', true, true),
  R('AMD Threadripper 1950X', 'AMD', 'Threadripper', 'desktop', 'Zen', 'TR4', 16, 32, 3.4, 4.0, 32, 180, 14, 2017, 999, 400, null, 'DDR4 ECC', true, true),
  // ===== AMD server =====
  R('AMD EPYC 9J85', 'AMD', 'EPYC Genoa', 'server', 'Zen 4', 'SP5', 128, 256, 2.6, 3.7, 256, 500, 5, 2023, null, 12000, null, 'DDR5 ECC', false, false),
  R('AMD EPYC 9754', 'AMD', 'EPYC Genoa', 'server', 'Zen 4', 'SP5', 128, 256, 2.25, 3.1, 256, 500, 5, 2023, null, 9500, null, 'DDR5 ECC', false, false),
  R('AMD EPYC 9654', 'AMD', 'EPYC Genoa', 'server', 'Zen 4', 'SP5', 96, 192, 2.4, 3.7, 384, 360, 5, 2023, null, 8200, null, 'DDR5 ECC', false, false),
  R('AMD EPYC 9554', 'AMD', 'EPYC Genoa', 'server', 'Zen 4', 'SP5', 64, 128, 3.1, 3.75, 256, 360, 5, 2023, null, 5100, null, 'DDR5 ECC', false, false),
  R('AMD EPYC 9354', 'AMD', 'EPYC Genoa', 'server', 'Zen 4', 'SP5', 32, 64, 3.25, 3.8, 256, 320, 5, 2023, null, 3400, null, 'DDR5 ECC', false, false),
  R('AMD EPYC 9124', 'AMD', 'EPYC Genoa', 'server', 'Zen 4', 'SP5', 16, 32, 3.0, 3.7, 128, 200, 5, 2023, null, 1500, null, 'DDR5 ECC', false, false),
  R('AMD EPYC 7763', 'AMD', 'EPYC Milan', 'server', 'Zen 3', 'SP3', 64, 128, 2.45, 3.5, 256, 280, 7, 2021, 6780, 2800, null, 'DDR4 ECC', false, false),
  R('AMD EPYC 7543', 'AMD', 'EPYC Milan', 'server', 'Zen 3', 'SP3', 32, 64, 2.8, 3.7, 256, 225, 7, 2021, 3400, 1300, null, 'DDR4 ECC', false, false),
  R('AMD EPYC 7313', 'AMD', 'EPYC Milan', 'server', 'Zen 3', 'SP3', 16, 32, 3.0, 3.7, 128, 155, 7, 2021, 1006, 520, null, 'DDR4 ECC', false, false),
  R('AMD EPYC 7742', 'AMD', 'EPYC Rome', 'server', 'Zen 2', 'SP3', 64, 128, 2.25, 3.4, 256, 225, 7, 2019, 6950, 1400, null, 'DDR4 ECC', false, false),
  R('AMD EPYC 7452', 'AMD', 'EPYC Rome', 'server', 'Zen 2', 'SP3', 32, 64, 2.35, 3.35, 128, 155, 7, 2019, 2451, 600, null, 'DDR4 ECC', false, false),
  R('AMD Ryzen Threadripper PRO 5995WX', 'AMD', 'Threadripper PRO', 'server', 'Zen 3', 'sWRX8', 64, 128, 2.7, 4.5, 256, 280, 7, 2022, 6499, 5200, null, 'DDR4 ECC', true, true),
  R('AMD Ryzen Threadripper PRO 3955WX', 'AMD', 'Threadripper PRO', 'server', 'Zen 2', 'sWRX8', 16, 32, 3.9, 4.35, 64, 200, 7, 2020, 1099, 700, null, 'DDR4 ECC', true, true),
  // ===== AMD mobile =====
  R('AMD Ryzen 9 8945HS', 'AMD', 'Ryzen 8000', 'mobile', 'Zen 4 (Hawk Point)', 'FP8', 8, 16, 4.0, 5.2, 16, 45, 4, 2024, null, null, 'Radeon 780M', 'DDR5/LPDDR5', false, false),
  R('AMD Ryzen 7 8845HS', 'AMD', 'Ryzen 8000', 'mobile', 'Zen 4 (Hawk Point)', 'FP8', 8, 16, 3.8, 5.1, 16, 45, 4, 2024, null, null, 'Radeon 780M', 'DDR5/LPDDR5', false, false),
  R('AMD Ryzen 9 7945HX', 'AMD', 'Ryzen 7000', 'mobile', 'Zen 4', 'FL1', 16, 32, 2.5, 5.4, 64, 55, 5, 2023, null, null, 'RDNA2 2CU', 'DDR5', false, false),
  R('AMD Ryzen 7 7735HS', 'AMD', 'Ryzen 7000', 'mobile', 'Zen 3+ (Rembrandt-R)', 'FP7', 8, 16, 3.2, 4.8, 16, 35, 6, 2023, null, null, 'Radeon 680M', 'LPDDR5', false, false),
  R('AMD Ryzen 7 7840HS', 'AMD', 'Ryzen 7000', 'mobile', 'Zen 4 (Phoenix)', 'FP8', 8, 16, 3.8, 5.1, 16, 35, 4, 2023, null, null, 'Radeon 780M', 'LPDDR5', false, false),
  R('AMD Ryzen 5 7535HS', 'AMD', 'Ryzen 7000', 'mobile', 'Zen 3+ (Barcelo-R)', 'FP7', 6, 12, 3.3, 4.55, 16, 35, 6, 2023, null, null, 'Radeon 660M', 'LPDDR5', false, false),
  R('AMD Ryzen 9 6900HS', 'AMD', 'Ryzen 6000', 'mobile', 'Zen 3+ (Rembrandt)', 'FP7', 8, 16, 3.2, 4.9, 16, 35, 6, 2022, null, null, 'Radeon 680M', 'LPDDR5', false, false),
  R('AMD Ryzen 7 6800H', 'AMD', 'Ryzen 6000', 'mobile', 'Zen 3+ (Rembrandt)', 'FP7', 8, 16, 3.2, 4.7, 16, 45, 6, 2022, null, null, 'Radeon 680M', 'DDR5/LPDDR5', false, false),
  R('AMD Ryzen 9 5900HX', 'AMD', 'Ryzen 5000', 'mobile', 'Zen 3 (Vermeer)', 'FP6', 8, 16, 3.3, 4.6, 16, 45, 7, 2021, null, null, 'Vega 8', 'DDR4', false, false),
  R('AMD Ryzen 7 5800H', 'AMD', 'Ryzen 5000', 'mobile', 'Zen 3 (Cezanne)', 'FP6', 8, 16, 3.2, 4.4, 16, 45, 7, 2021, null, null, 'Radeon RX Vega 8', 'DDR4/LPDDR4', false, false),
  R('AMD Ryzen 5 5600H', 'AMD', 'Ryzen 5000', 'mobile', 'Zen 3 (Cezanne)', 'FP6', 6, 12, 3.3, 4.2, 16, 45, 7, 2021, null, null, 'Radeon RX Vega 7', 'DDR4/LPDDR4', false, false),
  R('AMD Ryzen 7 4800H', 'AMD', 'Ryzen 4000', 'mobile', 'Zen 2 (Renoir)', 'FP6', 8, 16, 2.9, 4.2, 8, 45, 7, 2020, null, null, 'Radeon RX Vega 7', 'DDR4/LPDDR4', false, false),
  R('AMD Ryzen 5 4500U', 'AMD', 'Ryzen 4000', 'mobile', 'Zen 2 (Renoir)', 'FP6', 6, 12, 2.3, 4.0, 8, 15, 7, 2020, null, null, 'Radeon RX Vega 6', 'DDR4/LPDDR4', false, false),
  R('AMD Ryzen 7 3750H', 'AMD', 'Ryzen 3000', 'mobile', 'Zen+ (Picasso)', 'FP6', 4, 8, 2.7, 4.0, 4, 35, 12, 2019, null, null, 'Radeon RX Vega 10', 'DDR4', false, false),
  R('AMD Ryzen 9 6900HX', 'AMD', 'Ryzen 6000', 'mobile', 'Zen 3+ (Rembrandt)', 'FP7', 8, 16, 3.3, 4.9, 16, 45, 6, 2022, null, null, 'Radeon 680M', 'LPDDR5', false, false),
  // ===== AMD legacy =====
  R('AMD FX-9590', 'AMD', 'FX', 'legacy', 'Piledriver (Vishera)', 'AM3+', 8, 8, 4.7, 5.0, 8, 220, 32, 2013, 299, 90, null, 'DDR3', true, true),
  R('AMD FX-8350', 'AMD', 'FX', 'legacy', 'Vishera', 'AM3+', 8, 8, 4.0, 4.2, 8, 125, 32, 2012, 195, 60, null, 'DDR3', true, true),
  R('AMD Phenom II X4 965', 'AMD', 'Phenom II', 'legacy', 'Deneb', 'AM3', 4, 4, 3.4, 3.4, 6, 125, 45, 2009, 245, 40, null, 'DDR2/DDR3', true, false),
  R('AMD Athlon 64 X2 6000+', 'AMD', 'Athlon 64 X2', 'legacy', 'Brisbane', 'AM2', 2, 2, 3.0, 3.0, 2, 89, 65, 2007, 221, 25, null, 'DDR2', true, false),
  R('AMD Athlon 64 3200+', 'AMD', 'Athlon 64', 'legacy', 'Newcastle', 'Socket 754', 1, 1, 2.0, 2.0, 1, 89, 130, 2004, 417, 20, null, 'DDR', false, false),
  R('AMD Opteron 246', 'AMD', 'Opteron', 'legacy', 'Sledgehammer', 'Socket 940', 1, 1, 2.1, 2.1, 1, 95, 130, 2003, 851, 15, null, 'DDR ECC', false, false),
  R('AMD Ryzen 7 1700', 'AMD', 'Ryzen 7', 'legacy', 'Zen', 'AM4', 8, 16, 3.0, 3.7, 16, 65, 14, 2017, 329, 110, null, 'DDR4', true, true),
  R('AMD A10-9700', 'AMD', 'A-Series', 'legacy', 'Excavator (Bristol Ridge)', 'AM4', 4, 4, 3.5, 3.8, 2, 65, 28, 2016, 147, 50, 'Radeon R7', 'DDR3/DDR4', false, false)
];

// benchmark model: single-thread by arch+clock, multi ~ cores*threads scaling
const archSingle = {
  'Zen 5': 92, 'Zen 4': 78, 'Zen 4 3D V-Cache': 80, 'Zen 3': 68, 'Zen 3 3D V-Cache': 71, 'Zen 2': 55,
  'Zen+': 44, 'Zen': 40, 'Raptor Lake Refresh': 86, 'Raptor Lake': 82, 'Alder Lake': 74, 'Rocket Lake': 66,
  'Comet Lake': 60, 'Coffee Lake': 54, 'Kaby Lake': 48, 'Skylake': 45, 'Haswell': 36, 'Ivy Bridge': 32,
  'Sandy Bridge': 28, 'Meteor Lake': 70, 'Arrow Lake-H': 78, 'Arrow Lake-HX': 82,
  'Sapphire Rapids': 70, 'Cascade Lake': 50, 'Broadwell': 40, 'Nehalem': 22, 'Conroe': 10, 'Yorkfield': 13,
  'Piledriver (Vishera)': 26, 'Vishera': 26, 'Deneb': 20, 'Brisbane': 16, 'Newcastle': 12, 'Sledgehammer': 10,
  'Excavator (Bristol Ridge)': 24, 'Zen 4 (Hawk Point)': 76, 'Zen 4 (Phoenix)': 76, 'Zen 3+ (Rembrandt)': 64,
  'Zen 3+ (Rembrandt-R)': 64, 'Zen 3+ (Barcelo-R)': 60, 'Zen 3 (Vermeer)': 66, 'Zen 3 (Cezanne)': 63,
  'Zen 2 (Renoir)': 52, 'Zen+ (Picasso)': 42, 'Raptor Lake-HX': 80, 'Raptor Lake-H': 76, 'Alder Lake-H': 70,
  'Tiger Lake-H': 58, 'Comet Lake-H': 52, 'Coffee Lake-H': 46, 'EPYC Genoa': 74, 'EPYC Milan': 66,
  'EPYC Rome': 54, 'Raptor Lake': 80, 'Ivy Bridge-EP': 30, 'Haswell-EP': 34, 'Coffee Lake': 54
};

function buildCpus() {
  return cpuRows.map((r, idx) => {
    const [name, brand, family, category, architecture, socket, cores, threads, baseClock, boostClock, cacheL3, tdp, processNode, releaseYear, launchPrice, price, iGPU, memStr, overclockable, unlocked] = r;
    const per = archSingle[architecture] ?? 50;
    const single = Math.round((per * (boostClock / 4.5) * 7.6) / 1.45); // modern flagship ~560-620
    const htGain = threads / Math.max(1, cores);
    const coreEff = cores <= 8 ? cores : 8 + (cores - 8) * 0.7; // large chips scale sub-linearly per-core
    let multi = Math.round((single * coreEff * (0.62 + 0.18 * htGain) * (htGain > 1.5 ? 1.02 : 1)) / 1.55);
    if (category === 'legacy') multi = Math.round(multi * 0.6);
    const productivity = Math.round((multi * 0.92 + single * 1.1) / 1.0);
    const gaming = Math.round(single * 1.05 + Math.min(cacheL3, 128) * 0.9 + (architecture.includes('3D') ? 40 : 0));
    const seed = idx * 7919 + 13;
    const rnd = mulberry32(seed);
    const pros = [];
    const cons = [];
    if (multi > 2200) pros.push('Monster multithreaded throughput');
    if (single > 560) pros.push('Class-leading single-core speed');
    if (cacheL3 >= 96) pros.push('Huge L3 cache helps gaming');
    if (tdp <= 65 && category === 'desktop') pros.push('Efficient — runs cool on stock cooling');
    if (iGPU) pros.push('Integrated graphics for display/debug');
    if (price !== null && launchPrice !== null && price < launchPrice * 0.7) pros.push('Heavily discounted from launch');
    if (overclockable) pros.push('Unlocked for overclocking');
    if (!pros.length) pros.push('Solid price-to-performance');
    if (tdp >= 150) cons.push('High power draw under load');
    if (category === 'legacy') cons.push('No modern ISA extensions (AVX2/AVX-512)');
    if (!iGPU && category !== 'server') cons.push('Requires discrete GPU');
    if (price !== null && single > 0 && price > 450 && !['server'].includes(category)) cons.push('Premium pricing');
    if (threads / cores === 1) cons.push('No SMT — limited multitasking');
    if (rnd() > 0.6) cons.push('Stock cooler inadequate for boost clocks');
    if (!cons.length) cons.push('None significant at this price');
    return {
      id: `cpu-${idx + 1}`,
      slug: slug(name),
      name,
      brand,
      family,
      category,
      architecture,
      socket,
      cores,
      threads,
      baseClock,
      boostClock,
      cacheL3,
      tdp,
      processNode,
      releaseYear,
      releaseDate: `${releaseYear}-${(((seed % 11) + 1)).toString().padStart(2, '0')}-15`,
      launchPrice,
      price,
      iGPU,
      memoryTypes: memStr.split('/'),
      overclockable,
      unlocked,
      benchmarks: { single, multi, productivity, gaming },
      pros: pros.slice(0, 4),
      cons: cons.slice(0, 3),
      priceHistory: launchPrice != null && price != null ? priceHistory(launchPrice, price, releaseYear, seed) : undefined
    };
  });
}

// ---------- GPU rows ----------
const G = (...a) => a;

const gpuRows = [
  // NVIDIA desktop
  G('NVIDIA GeForce RTX 4090', 'NVIDIA', 'AD102', 'Ada Lovelace', 'desktop', 16384, 2230, 2520, 24, 'GDDR6X', 384, 1008, 450, 2022, 1599, 1750, '3-slot'),
  G('NVIDIA GeForce RTX 4080 SUPER', 'NVIDIA', 'AD103', 'Ada Lovelace', 'desktop', 10240, 2295, 2550, 16, 'GDDR6X', 256, 736, 320, 2024, 999, 970, '3-slot'),
  G('NVIDIA GeForce RTX 4080', 'NVIDIA', 'AD104', 'Ada Lovelace', 'desktop', 9728, 2210, 2510, 16, 'GDDR6X', 256, 717, 320, 2022, 1199, 1000, '3-slot'),
  G('NVIDIA GeForce RTX 4070 Ti SUPER', 'NVIDIA', 'AD102', 'Ada Lovelace', 'desktop', 8448, 2340, 2610, 16, 'GDDR6X', 256, 672, 285, 2024, 829, 760, '3-slot'),
  G('NVIDIA GeForce RTX 4070 Ti', 'NVIDIA', 'AD104', 'Ada Lovelace', 'desktop', 7680, 2310, 2610, 12, 'GDDR6X', 192, 504, 285, 2023, 799, 680, '3-slot'),
  G('NVIDIA GeForce RTX 4070 SUPER', 'NVIDIA', 'AD104', 'Ada Lovelace', 'desktop', 7168, 1980, 2475, 12, 'GDDR6X', 192, 504, 220, 2024, 599, 570, '2-slot'),
  G('NVIDIA GeForce RTX 4070', 'NVIDIA', 'AD104', 'Ada Lovelace', 'desktop', 5888, 1920, 2475, 12, 'GDDR6X', 192, 504, 200, 2023, 599, 510, '2-slot'),
  G('NVIDIA GeForce RTX 4060 Ti', 'NVIDIA', 'AD106', 'Ada Lovelace', 'desktop', 4352, 2310, 2535, 8, 'GDDR6', 128, 288, 160, 2023, 399, 350, '2-slot'),
  G('NVIDIA GeForce RTX 4060', 'NVIDIA', 'AD107', 'Ada Lovelace', 'desktop', 3072, 1830, 2460, 8, 'GDDR6', 128, 272, 115, 2023, 299, 270, '2-slot'),
  G('NVIDIA GeForce RTX 3090 Ti', 'NVIDIA', 'GA102', 'Ampere', 'desktop', 10752, 1560, 1860, 24, 'GDDR6X', 384, 1008, 450, 2022, 1999, 1300, '3-slot'),
  G('NVIDIA GeForce RTX 3090', 'NVIDIA', 'GA102', 'Ampere', 'desktop', 10496, 1395, 1695, 24, 'GDDR6X', 384, 936, 350, 2020, 1499, 1100, '3-slot'),
  G('NVIDIA GeForce RTX 3080 Ti', 'NVIDIA', 'GA102', 'Ampere', 'desktop', 10240, 1365, 1665, 12, 'GDDR6X', 384, 912, 350, 2021, 1199, 800, '3-slot'),
  G('NVIDIA GeForce RTX 3080 12GB', 'NVIDIA', 'GA102', 'Ampere', 'desktop', 8960, 1440, 1710, 12, 'GDDR6X', 384, 912, 350, 2022, 799, 650, '3-slot'),
  G('NVIDIA GeForce RTX 3080', 'NVIDIA', 'GA102', 'Ampere', 'desktop', 8704, 1440, 1710, 10, 'GDDR6X', 320, 760, 320, 2020, 699, 600, '3-slot'),
  G('NVIDIA GeForce RTX 3070 Ti', 'NVIDIA', 'GA104', 'Ampere', 'desktop', 6144, 1575, 1770, 8, 'GDDR6X', 256, 608, 290, 2021, 599, 480, '2-slot'),
  G('NVIDIA GeForce RTX 3070', 'NVIDIA', 'GA104', 'Ampere', 'desktop', 5888, 1500, 1725, 8, 'GDDR6', 256, 448, 220, 2020, 499, 420, '2-slot'),
  G('NVIDIA GeForce RTX 3060 Ti', 'NVIDIA', 'GA104', 'Ampere', 'desktop', 4864, 1410, 1665, 8, 'GDDR6', 256, 448, 200, 2020, 399, 320, '2-slot'),
  G('NVIDIA GeForce RTX 3060 12GB', 'NVIDIA', 'GA106', 'Ampere', 'desktop', 3584, 1320, 1777, 12, 'GDDR6', 192, 360, 170, 2021, 329, 250, '2-slot'),
  G('NVIDIA GeForce RTX 3050 8GB', 'NVIDIA', 'GA107', 'Ampere', 'desktop', 2560, 1552, 1777, 8, 'GDDR6', 128, 224, 130, 2022, 249, 190, '2-slot'),
  G('NVIDIA GeForce RTX 2080 Ti', 'NVIDIA', 'TU102', 'Turing', 'desktop', 4352, 1350, 1545, 11, 'GDDR6', 352, 616, 250, 2018, 1199, 700, '2-slot'),
  G('NVIDIA GeForce RTX 2080 SUPER', 'NVIDIA', 'TU104', 'Turing', 'desktop', 3072, 1650, 1815, 8, 'GDDR6', 256, 496, 250, 2019, 699, 450, '2-slot'),
  G('NVIDIA GeForce RTX 2080', 'NVIDIA', 'TU104', 'Turing', 'desktop', 2944, 1515, 1710, 8, 'GDDR6', 256, 448, 225, 2018, 799, 420, '2-slot'),
  G('NVIDIA GeForce RTX 2070 SUPER', 'NVIDIA', 'TU104', 'Turing', 'desktop', 2560, 1605, 1770, 8, 'GDDR6', 256, 448, 215, 2019, 499, 330, '2-slot'),
  G('NVIDIA GeForce RTX 2070', 'NVIDIA', 'TU106', 'Turing', 'desktop', 2304, 1410, 1620, 8, 'GDDR6', 256, 448, 175, 2018, 499, 300, '2-slot'),
  G('NVIDIA GeForce RTX 2060 SUPER', 'NVIDIA', 'TU106', 'Turing', 'desktop', 2176, 1470, 1650, 8, 'GDDR6', 192, 448, 175, 2019, 369, 260, '2-slot'),
  G('NVIDIA GeForce RTX 2060', 'NVIDIA', 'TU106', 'Turing', 'desktop', 1920, 1365, 1680, 6, 'GDDR6', 192, 336, 160, 2019, 349, 230, '2-slot'),
  G('NVIDIA GeForce GTX 1660 Super', 'NVIDIA', 'TU116', 'Turing', 'desktop', 1408, 1530, 1785, 6, 'GDDR6', 192, 336, 125, 2019, 229, 160, '2-slot'),
  G('NVIDIA GeForce GTX 1660 Ti', 'NVIDIA', 'TU116', 'Turing', 'desktop', 1536, 1500, 1770, 6, 'GDDR6', 192, 288, 120, 2019, 279, 170, '2-slot'),
  G('NVIDIA GeForce GTX 1660', 'NVIDIA', 'TU116', 'Turing', 'desktop', 1408, 1530, 1785, 6, 'GDDR5', 192, 192, 120, 2019, 219, 140, '2-slot'),
  G('NVIDIA GeForce GTX 1650', 'NVIDIA', 'TU117', 'Turing', 'desktop', 896, 1485, 1665, 4, 'GDDR5', 128, 128, 75, 2019, 149, 110, '2-slot'),
  G('NVIDIA GeForce GTX 1080 Ti', 'NVIDIA', 'GP102', 'Pascal', 'desktop', 3584, 1480, 1582, 11, 'GDDR5X', 352, 484, 250, 2017, 699, 400, '2-slot'),
  G('NVIDIA GeForce GTX 1080', 'NVIDIA', 'GP104', 'Pascal', 'desktop', 2560, 1607, 1733, 8, 'GDDR5X', 256, 320, 180, 2016, 599, 300, '2-slot'),
  G('NVIDIA GeForce GTX 1070 Ti', 'NVIDIA', 'GP104', 'Pascal', 'desktop', 2432, 1607, 1683, 8, 'GDDR5', 256, 256, 180, 2017, 419, 240, '2-slot'),
  G('NVIDIA GeForce GTX 1070', 'NVIDIA', 'GP104', 'Pascal', 'desktop', 1920, 1506, 1683, 8, 'GDDR5', 256, 256, 150, 2016, 379, 210, '2-slot'),
  G('NVIDIA GeForce GTX 1060 6GB', 'NVIDIA', 'GP106', 'Pascal', 'desktop', 1280, 1506, 1708, 6, 'GDDR5', 192, 192, 120, 2016, 249, 140, '2-slot'),
  G('NVIDIA GeForce GTX 1050 Ti', 'NVIDIA', 'GP107', 'Pascal', 'desktop', 768, 1290, 1392, 4, 'GDDR5', 128, 112, 75, 2016, 139, 100, '2-slot'),
  G('NVIDIA GeForce GTX 980 Ti', 'NVIDIA', 'GM200', 'Maxwell', 'desktop', 2048, 1000, 1075, 6, 'GDDR5', 384, 336, 250, 2015, 649, 250, '2-slot'),
  G('NVIDIA GeForce GTX 970', 'NVIDIA', 'GM204', 'Maxwell', 'desktop', 1664, 1050, 1178, 4, 'GDDR5', 256, 224, 145, 2014, 329, 140, '2-slot'),
  G('NVIDIA GeForce GTX 780 Ti', 'NVIDIA', 'GK110', 'Kepler', 'desktop', 2880, 872, 889, 3, 'GDDR5', 384, 336, 250, 2013, 649, 120, '2-slot'),
  G('NVIDIA GeForce GTX 680', 'NVIDIA', 'GK104', 'Kepler', 'desktop', 1536, 1006, 1058, 2, 'GDDR5', 256, 192, 195, 2012, 499, 80, '2-slot'),
  G('NVIDIA GeForce GTX 580', 'NVIDIA', 'GF110', 'Fermi', 'desktop', 512, 772, 772, 1.5, 'GDDR5', 384, 192, 244, 2010, 499, 60, '2-slot'),
  // AMD desktop
  G('AMD Radeon RX 7900 XTX', 'AMD', 'Navi 31', 'RDNA 3', 'desktop', 6144, 1929, 2500, 24, 'GDDR6', 384, 960, 355, 2022, 999, 880, '3-slot'),
  G('AMD Radeon RX 7900 XT', 'AMD', 'Navi 31', 'RDNA 3', 'desktop', 5376, 1980, 2400, 20, 'GDDR6', 320, 800, 315, 2022, 899, 700, '3-slot'),
  G('AMD Radeon RX 7900 GRE', 'AMD', 'Navi 31', 'RDNA 3', 'desktop', 5120, 1825, 2270, 16, 'GDDR6', 256, 576, 260, 2024, 649, 540, '2-slot'),
  G('AMD Radeon RX 7800 XT', 'AMD', 'Navi 32', 'RDNA 3', 'desktop', 3840, 1800, 2500, 16, 'GDDR6', 256, 624, 262, 2023, 499, 460, '2-slot'),
  G('AMD Radeon RX 7700 XT', 'AMD', 'Navi 32', 'RDNA 3', 'desktop', 3456, 1905, 2544, 12, 'GDDR6', 192, 432, 245, 2023, 449, 400, '2-slot'),
  G('AMD Radeon RX 7600 XT', 'AMD', 'Navi 33', 'RDNA 3', 'desktop', 2048, 1979, 2755, 16, 'GDDR6', 128, 288, 190, 2024, 329, 290, '2-slot'),
  G('AMD Radeon RX 7600', 'AMD', 'Navi 33', 'RDNA 3', 'desktop', 2048, 1720, 2655, 8, 'GDDR6', 128, 288, 165, 2023, 269, 230, '2-slot'),
  G('AMD Radeon RX 6950 XT', 'AMD', 'Navi 21', 'RDNA 2', 'desktop', 5120, 1860, 2324, 16, 'GDDR6', 256, 576, 330, 2022, 1099, 750, '3-slot'),
  G('AMD Radeon RX 6900 XT', 'AMD', 'Navi 21', 'RDNA 2', 'desktop', 5120, 1825, 2250, 16, 'GDDR6', 256, 512, 300, 2020, 999, 650, '2-slot'),
  G('AMD Radeon RX 6800 XT', 'AMD', 'Navi 21', 'RDNA 2', 'desktop', 4608, 1825, 2250, 16, 'GDDR6', 256, 512, 300, 2020, 649, 500, '2-slot'),
  G('AMD Radeon RX 6800', 'AMD', 'Navi 21', 'RDNA 2', 'desktop', 3840, 1815, 2105, 16, 'GDDR6', 256, 512, 250, 2020, 579, 430, '2-slot'),
  G('AMD Radeon RX 6750 XT', 'AMD', 'Navi 22', 'RDNA 2', 'desktop', 2560, 2150, 2600, 12, 'GDDR6', 192, 432, 250, 2022, 549, 350, '2-slot'),
  G('AMD Radeon RX 6700 XT', 'AMD', 'Navi 22', 'RDNA 2', 'desktop', 2560, 2073, 2450, 12, 'GDDR6', 192, 384, 230, 2021, 479, 300, '2-slot'),
  G('AMD Radeon RX 6650 XT', 'AMD', 'Navi 23', 'RDNA 2', 'desktop', 2048, 2050, 2635, 8, 'GDDR6', 128, 224, 180, 2022, 399, 240, '2-slot'),
  G('AMD Radeon RX 6600', 'AMD', 'Navi 23', 'RDNA 2', 'desktop', 1792, 2044, 2491, 8, 'GDDR6', 128, 224, 132, 2021, 329, 190, '2-slot'),
  G('AMD Radeon RX 6500 XT', 'AMD', 'Navi 24', 'RDNA 2', 'desktop', 1024, 2321, 2815, 4, 'GDDR6', 64, 64, 107, 2022, 199, 140, '2-slot'),
  G('AMD Radeon RX 5700 XT', 'AMD', 'Navi 10', 'RDNA 1', 'desktop', 2560, 1605, 1905, 8, 'GDDR6', 256, 448, 225, 2019, 399, 220, '2-slot'),
  G('AMD Radeon RX 5700', 'AMD', 'Navi 10', 'RDNA 1', 'desktop', 2304, 1465, 1725, 8, 'GDDR6', 256, 448, 180, 2019, 349, 190, '2-slot'),
  G('AMD Radeon RX 5600 XT', 'AMD', 'Navi 10', 'RDNA 1', 'desktop', 2048, 1375, 1560, 6, 'GDDR6', 192, 288, 150, 2020, 279, 160, '2-slot'),
  G('AMD Radeon RX 590', 'AMD', 'Polaris 20', 'GCN 4', 'desktop', 2304, 1468, 1545, 8, 'GDDR5', 256, 256, 185, 2018, 279, 130, '2-slot'),
  G('AMD Radeon RX 580', 'AMD', 'Polaris 20', 'GCN 4', 'desktop', 2304, 1257, 1340, 8, 'GDDR5', 256, 256, 185, 2017, 229, 110, '2-slot'),
  G('AMD Radeon RX 570', 'AMD', 'Polaris 20', 'GCN 4', 'desktop', 2048, 1168, 1244, 8, 'GDDR5', 256, 240, 150, 2017, 179, 95, '2-slot'),
  G('AMD Radeon RX 480', 'AMD', 'Polaris 10', 'GCN 4', 'desktop', 2304, 1120, 1266, 8, 'GDDR5', 256, 256, 150, 2016, 239, 90, '2-slot'),
  G('AMD Radeon R9 Fury X', 'AMD', 'Fiji', 'GCN 3', 'desktop', 4096, 1050, 1050, 4, 'HBM', 4096, 512, 275, 2015, 649, 150, '2-slot'),
  G('AMD Radeon R9 290X', 'AMD', 'Hawaii', 'GCN 2', 'desktop', 2816, 1000, 1000, 4, 'GDDR5', 512, 320, 250, 2013, 549, 90, '2-slot'),
  G('AMD Radeon HD 7970', 'AMD', 'Tahiti', 'GCN 1', 'desktop', 2048, 925, 1000, 3, 'GDDR5', 384, 264, 300, 2012, 449, 60, '2-slot'),
  G('AMD Radeon HD 5870', 'AMD', 'Cypress', 'Evergreen', 'desktop', 1600, 850, 850, 1, 'GDDR5', 256, 154, 188, 2009, 379, 40, '2-slot'),
  // Intel desktop
  G('Intel Arc A770 16GB', 'Intel', 'GCM10', 'Xe HPG (Alchemist)', 'desktop', 4096, 2100, 2400, 16, 'GDDR6', 256, 560, 225, 2022, 329, 280, '2-slot'),
  G('Intel Arc A770 8GB', 'Intel', 'GCM-10', 'Xe HPG (Alchemist)', 'desktop', 4096, 2100, 2400, 8, 'GDDR6', 256, 560, 225, 2022, 299, 240, '2-slot'),
  G('Intel Arc A750', 'Intel', 'GCM-10', 'Xe HPG (Alchemist)', 'desktop', 3584, 2050, 2400, 8, 'GDDR6', 256, 512, 225, 2022, 289, 190, '2-slot'),
  G('Intel Arc A580', 'Intel', 'GCM-10', 'Xe HPG (Alchemist)', 'desktop', 3072, 1700, 2000, 8, 'GDDR6', 192, 380, 200, 2023, 249, 170, '2-slot'),
  G('Intel Arc A380', 'Intel', 'SGM-21', 'Xe HPG (Alchemist)', 'desktop', 768, 2000, 2450, 6, 'GDDR6', 96, 186, 92, 2022, 149, 110, '2-slot'),
  // Laptop
  G('NVIDIA GeForce RTX 4090 Laptop', 'NVIDIA', 'AD103', 'Ada Lovelace', 'laptop', 9728, 1290, 1455, 16, 'GDDR6', 256, 576, 150, 2023, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 4080 Laptop', 'NVIDIA', 'AD103', 'Ada Lovelace', 'laptop', 7424, 1350, 1755, 12, 'GDDR6', 192, 432, 150, 2023, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 4070 Laptop', 'NVIDIA', 'AD106', 'Ada Lovelace', 'laptop', 4608, 1155, 1815, 8, 'GDDR6', 128, 288, 115, 2023, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 4060 Laptop', 'NVIDIA', 'AD107', 'Ada Lovelace', 'laptop', 3072, 1545, 1905, 8, 'GDDR6', 128, 272, 115, 2023, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 4050 Laptop', 'NVIDIA', 'AD107', 'Ada Lovelace', 'laptop', 2560, 1685, 2175, 6, 'GDDR6', 96, 224, 100, 2023, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 3080 Laptop', 'NVIDIA', 'GA104', 'Ampere', 'laptop', 8704, 1110, 1545, 16, 'GDDR6', 256, 560, 150, 2021, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 3070 Laptop', 'NVIDIA', 'GA104', 'Ampere', 'laptop', 5120, 1110, 1560, 8, 'GDDR6', 256, 448, 125, 2021, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 3060 Laptop', 'NVIDIA', 'GA106', 'Ampere', 'laptop', 3840, 900, 1425, 6, 'GDDR6', 192, 336, 115, 2021, null, null, 'Mobile'),
  G('NVIDIA GeForce RTX 3050 Laptop', 'NVIDIA', 'GA107', 'Ampere', 'laptop', 2560, 1237, 1500, 4, 'GDDR6', 128, 192, 80, 2021, null, null, 'Mobile'),
  G('AMD Radeon RX 7900M', 'AMD', 'Navi 31', 'RDNA 3', 'laptop', 4608, 1825, 2090, 16, 'GDDR6', 256, 384, 180, 2023, null, null, 'Mobile'),
  G('AMD Radeon RX 7700S', 'AMD', 'Navi 33', 'RDNA 3', 'laptop', 2048, 1900, 2400, 8, 'GDDR6', 128, 288, 100, 2023, null, null, 'Mobile'),
  G('AMD Radeon RX 6800M', 'AMD', 'Navi 22', 'RDNA 2', 'laptop', 2560, 2000, 2370, 12, 'GDDR6', 192, 384, 145, 2021, null, null, 'Mobile'),
  G('AMD Radeon RX 6600M', 'AMD', 'Navi 23', 'RDNA 2', 'laptop', 1792, 1900, 2300, 8, 'GDDR6', 128, 224, 100, 2021, null, null, 'Mobile'),
  G('Intel Arc A730M', 'Intel', 'SGM-21', 'Xe HPG (Alchemist)', 'laptop', 384, 1100, 1100, 12, 'GDDR6', 192, 384, 120, 2022, null, null, 'Mobile'),
  G('Intel Arc A550M', 'Intel', 'SGM-21', 'Xe HPG (Alchemist)', 'laptop', 320, 900, 1450, 8, 'GDDR6', 128, 224, 90, 2022, null, null, 'Mobile'),
  // Workstation
  G('NVIDIA RTX 6000 Ada', 'NVIDIA', 'AD102', 'Ada Lovelace', 'workstation', 18176, 912, 2550, 48, 'GDDR6', 384, 960, 300, 2023, 6800, 6200, '2-slot'),
  G('NVIDIA RTX 5000 Ada', 'NVIDIA', 'AD102', 'Ada Lovelace', 'workstation', 12800, 1732, 2572, 32, 'GDDR6', 256, 720, 250, 2023, 4000, 3600, '2-slot'),
  G('NVIDIA RTX 4500 Ada', 'NVIDIA', 'AD102', 'Ada Lovelace', 'workstation', 7680, 1770, 2432, 24, 'GDDR6', 192, 432, 210, 2023, 2500, 2100, '2-slot'),
  G('NVIDIA A100 80GB PCIe', 'NVIDIA', 'GA100', 'Ampere', 'workstation', 6912, 765, 1410, 80, 'HBM2e', 5120, 1935, 300, 2020, 15000, 9500, '1-slot'),
  G('NVIDIA A6000', 'NVIDIA', 'GA102', 'Ampere', 'workstation', 10752, 1440, 1800, 48, 'GDDR6', 384, 768, 300, 2021, 4650, 3500, '2-slot'),
  G('NVIDIA Quadro RTX 8000', 'NVIDIA', 'TU102', 'Turing', 'workstation', 4608, 1395, 1770, 48, 'GDDR6', 384, 672, 260, 2018, 5000, 2200, '2-slot'),
  G('NVIDIA Quadro P4000', 'NVIDIA', 'GP104', 'Pascal', 'workstation', 1792, 1227, 1480, 8, 'GDDR5', 256, 192, 105, 2017, 629, 300, '1-slot'),
  G('NVIDIA TITAN RTX', 'NVIDIA', 'TU102', 'Turing', 'workstation', 4608, 1380, 1770, 24, 'GDDR6', 384, 672, 280, 2018, 2499, 1200, '2-slot'),
  G('NVIDIA TITAN V', 'NVIDIA', 'GV100', 'Volta', 'workstation', 5120, 1200, 1450, 12, 'HBM2', 3072, 652, 250, 2017, 2999, 900, '1-slot'),
  G('AMD Radeon Pro W7900', 'AMD', 'Navi 31', 'RDNA 3', 'workstation', 6144, 1880, 2500, 48, 'GDDR6', 384, 864, 295, 2023, 4000, 3500, '2-slot'),
  G('AMD Radeon Pro W7800', 'AMD', 'Navi 31', 'RDNA 3', 'workstation', 4480, 1800, 2500, 32, 'GDDR6', 256, 576, 260, 2023, 2500, 2100, '2-slot'),
  G('AMD Radeon Pro W6800', 'AMD', 'Navi 21', 'RDNA 2', 'workstation', 3840, 1800, 2325, 32, 'GDDR6', 256, 512, 250, 2021, 2250, 1300, '2-slot'),
  G('AMD Radeon Pro VII', 'AMD', 'Vega 20', 'GCN 5.1', 'workstation', 3840, 1400, 1750, 16, 'HBM2', 4096, 1000, 300, 2020, 1899, 800, '2-slot'),
  G('AMD Radeon Instinct MI210', 'AMD', 'Aldebaran', 'CDNA 2', 'workstation', 14080, 1700, 1800, 64, 'HBM2e', 4096, 3277, 300, 2021, null, 7000, '1-slot')
];

const archGpuRaster = {
  'Ada Lovelace': 3.35, Ampere: 2.6, Turing: 1.9, Pascal: 1.35, Maxwell: 0.95, Kepler: 0.6, Fermi: 0.35,
  'RDNA 3': 3.0, 'RDNA 2': 2.2, 'RDNA 1': 1.5, 'GCN 4': 0.85, 'GCN 3': 0.8, 'GCN 2': 0.75, 'GCN 1': 0.5,
  Evergreen: 0.3, 'Xe HPG (Alchemist)': 1.7, Volta: 2.1, 'GCN 5.1': 1.3, CDNA: 2.0, 'CDNA 2': 2.4
};

function buildGpus() {
  return gpuRows.map((r, idx) => {
    const [name, brand, chip, architecture, category, shaders, baseClock, boostClock, vram, memoryType, memoryBus, bandwidth, tdp, releaseYear, launchPrice, price, formFactor] = r;
    const per = archGpuRaster[architecture] ?? 1.5;
    const raster = Math.round(Math.pow(shaders, 0.78) * Math.pow(boostClock / 1000, 0.9) * per * 0.22);
    const rtScale = architecture === 'Ada Lovelace' ? 0.62 : architecture === 'Ampere' ? 0.5 : architecture === 'Turing' ? 0.3 : architecture === 'RDNA 3' ? 0.42 : architecture === 'RDNA 2' ? 0.3 : architecture === 'Xe HPG (Alchemist)' ? 0.3 : 0.05;
    const rayTracing = Math.round(raster * rtScale);
    const render = Math.round(raster * 0.75 + rayTracing * 0.45 + Math.min(vram, 48) * 1.2 + bandwidth * 0.01);
    const dlss = brand === 'NVIDIA' && ['Turing', 'Ampere', 'Ada Lovelace'].includes(architecture);
    const fsr = true; // works everywhere
    const xess = brand === 'Intel' || (architecture !== 'Fermi' && architecture !== 'Kepler' && architecture !== 'Maxwell' && architecture !== 'Pascal' && architecture !== 'GCN 1' && architecture !== 'GCN 2' && architecture !== 'GCN 3' && architecture !== 'GCN 4' && architecture !== 'Evergreen');
    const rt = rayTracing > 0;
    const frameGen = architecture === 'Ada Lovelace' || architecture === 'RDNA 3';
    const seed = idx * 104729 + 7;
    const rnd = mulberry32(seed);
    const games = ['Cyberpunk 2077', "Alan Wake 2", "Black Myth: Wukong", 'Call of Duty: MW III', 'Hogwarts Legacy', 'Forza Horizon 5', 'Red Dead Redemption 2'];
    const base1080 = Math.max(12, Math.round(raster * 0.09));
    const gaming = games.map((game, gi) => {
      const heavy = gi < 3 ? 0.32 : gi < 5 ? 0.5 : 0.72;
      const bwFactor = 1 + Math.min(bandwidth, 1000) / 3000;
      const vramFactor = gi < 3 ? 1 : 1 + Math.min(vram, 16) / 40;
      const f1080 = Math.round(base1080 * heavy * bwFactor * vramFactor * (1 + (rnd() - 0.5) * 0.15));
      return { game, fps1080: f1080, fps1440: Math.round(f1080 * 0.74), fps4k: Math.round(f1080 * 0.5) };
    });
    const connectors = category === 'laptop' ? ['PCIe 4.0 x16 (Mobile)'] : tdp > 300 ? ['1x 12VHPWR', '2x 8-pin'] : tdp > 200 ? ['2x 8-pin'] : tdp > 130 ? ['1x 8-pin'] : ['Slot power'];
    const outputs = category === 'laptop' ? ['Laptop eDP', 'HDMI via MB'] : ['3x DisplayPort 1.4', '1x HDMI 2.1'];
    const pros = [];
    const cons = [];
    if (raster > 2200) pros.push('Extreme rasterization performance');
    if (rt) pros.push('Hardware ray tracing');
    if (dlss) pros.push('DLSS upscaling boosts FPS');
    if (vram >= 16) pros.push(`${vram} GB VRAM for 4K & creative work`);
    if (bandwidth > 700) pros.push('Very high memory bandwidth');
    if (tdp <= 170) pros.push('Power efficient');
    if (!pros.length) pros.push('Good entry-level option');
    if (tdp >= 300) cons.push('Thirsty — needs a strong PSU');
    if (!rt) cons.push('No hardware ray tracing');
    if (vram <= 6) cons.push('VRAM is a bottleneck in modern titles');
    if (memoryBus <= 128 && raster > 900) cons.push('Narrow memory bus limits 4K scaling');
    if (formFactor === '3-slot') cons.push('Bulky 3-slot cooler');
    if (price !== null && raster > 0 && price > 800) cons.push('Expensive');
    if (!cons.length) cons.push('Minor — none critical');
    return {
      id: `gpu-${idx + 1}`,
      slug: slug(name),
      name, brand, chip, architecture,
      category,
      shaders, baseClock, boostClock, vram, memoryType, memoryBus, bandwidth, tdp,
      connectors, outputs, formFactor,
      raytracing: rt, dlss, fsr, xess, frameGen,
      releaseYear, releaseDate: `${releaseYear}-${(((seed % 11) + 1)).toString().padStart(2, '0')}-15`,
      launchPrice, price,
      benchmarks: { render, rayTracing, raster },
      gaming, pros: pros.slice(0, 4), cons: cons.slice(0, 3),
      priceHistory: launchPrice != null && price != null ? priceHistory(launchPrice, price, releaseYear, seed) : undefined
    };
  });
}

const cpus = buildCpus();
const gpus = buildGpus();
writeFileSync(resolve(outDir, 'cpus.json'), JSON.stringify(cpus, null, 1));
writeFileSync(resolve(outDir, 'gpus.json'), JSON.stringify(gpus, null, 1));
console.log(`Generated ${cpus.length} CPUs, ${gpus.length} GPUs`);
