import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Cpu, Gpu } from '@/types/hardware';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmtPrice = (p: number | null | undefined): string =>
  p == null ? '—' : `$${p.toLocaleString('en-US')}`;

export const fmtNum = (n: number, digits = 0): string =>
  n.toLocaleString('en-US', { maximumFractionDigits: digits });

export const pct = (a: number, b: number): number => (b === 0 ? 0 : ((a - b) / b) * 100);

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** value-for-money index */
export const perfPerDollarCpu = (c: Cpu): number | null =>
  c.price && c.price > 0 ? c.benchmarks.multi / c.price : null;
export const perfPerDollarGpu = (g: Gpu): number | null =>
  g.price && g.price > 0 ? g.benchmarks.render / g.price : null;

/** FPS per watt proxy */
export const effCpu = (c: Cpu): number => c.benchmarks.multi / Math.max(15, c.tdp);
export const effGpu = (g: Gpu): number => g.benchmarks.raster / Math.max(25, g.tdp);

export function cpuTier(c: Cpu): string {
  if (c.category === 'server') return 'Server';
  if (c.category === 'mobile') return 'Laptop';
  if (c.category === 'legacy') return 'Legacy';
  const m = c.benchmarks.multi;
  if (m >= 2600) return 'HEDT/Flagship';
  if (m >= 1400) return 'High-end';
  if (m >= 700) return 'Mid-range';
  return 'Entry-level';
}

export function gpuTier(g: Gpu): string {
  if (g.category === 'workstation') return 'Workstation';
  if (g.category === 'laptop') return 'Laptop';
  if (g.category === 'legacy') return 'Legacy';
  const r = g.benchmarks.raster;
  if (r >= 3800) return 'Enthusiast';
  if (r >= 2300) return 'High-end';
  if (r >= 1200) return 'Mid-range';
  if (r >= 600) return 'Mainstream';
  return 'Entry-level';
}

export const brandColor = (brand: string): string => {
  switch (brand) {
    case 'Intel': return 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30';
    case 'AMD': return 'bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30';
    case 'NVIDIA': return 'bg-lime-500/15 text-lime-600 dark:text-lime-300 border-lime-500/30';
    default: return 'bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30';
  }
};

export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let t: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  }) as unknown as T;
}

/** Estimated gaming FPS for a GPU at given resolution & title weight */
export function estimateFps(g: Gpu, resolution: '1080p' | '1440p' | '4K', quality: 'low' | 'medium' | 'high' | 'ultra'): number {
  const resMul = resolution === '1080p' ? 1 : resolution === '1440p' ? 0.74 : 0.5;
  const qMul = quality === 'low' ? 1.9 : quality === 'medium' ? 1.35 : quality === 'high' ? 1.0 : 0.72;
  return Math.round(Math.max(5, g.benchmarks.raster * 0.032 * resMul * qMul));
}

/** CPU score contribution to gaming FPS cap in a pairing */
export function cpuCap(c: Cpu, resolution: '1080p' | '1440p' | '4K'): number {
  const base = c.benchmarks.gaming * 1.15 + c.benchmarks.single * 0.35;
  const mul = resolution === '1080p' ? 1 : resolution === '1440p' ? 1.25 : 1.6;
  return Math.round(base * mul);
}

export interface CompatIssue {
  level: 'error' | 'warning' | 'info';
  message: string;
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function download(filename: string, text: string, mime = 'text/plain') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function toCSV(rows: (string | number | null | undefined)[][]): string {
  return rows
    .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

/** Build an HTML spec sheet and open print dialog (PDF via browser "Save as PDF") */
export function printSpecSheet(title: string, sections: { heading: string; rows: [string, string][] }[], extraHtml = '') {
  const w = window.open('', '_blank', 'width=800,height=900');
  if (!w) return;
  const html = `<!doctype html><html><head><title>${title}</title><style>
    body{font-family:Inter,Arial,sans-serif;color:#111;margin:32px;}
    h1{font-size:22px;border-bottom:3px solid #0891b2;padding-bottom:8px;}
    h2{font-size:15px;margin-top:22px;color:#0e7490;text-transform:uppercase;letter-spacing:.06em;}
    table{width:100%;border-collapse:collapse;font-size:13px;}
    td{padding:6px 8px;border-bottom:1px solid #ddd;}
    td:first-child{color:#555;width:45%;}
    .foot{margin-top:28px;font-size:11px;color:#888;}
  </style></head><body>
  <h1>${title}</h1>
  ${sections
    .map(
      (s) => `<h2>${s.heading}</h2><table>${s.rows
        .map(([k, v]) => `<tr><td>${k}</td><td><b>${v}</b></td></tr>`)
        .join('')}</table>`
    )
    .join('')}
  ${extraHtml}
  <div class="foot">Generated by DrDiscord2 Hardware DB — drdiscord2.github.io · ${new Date().toISOString().slice(0, 10)}</div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
  </body></html>`;
  w.document.write(html);
  w.document.close();
}

export function shareUrl(): string {
  return window.location.href;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

export const hashHref = (path: string) => `#${path}`;
