import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Cpu, Gpu } from '@/types/hardware';
import { getItem, isCpuItem, getCpu, getGpu, allCpus, allGpus, priceHistory } from '@/lib/db';
import { useAppStore } from '@/store/useAppStore';
import { cn, fmtPrice, toCSV, download, printSpecSheet, copyToClipboard, hashHref } from '@/lib/utils';
import { Section, Badge } from '@/components/ui';
import { EmptyState } from '@/components/Skeleton';
import { BarsChart, PriceHistoryChart } from '@/components/charts';
import { useSeo } from '@/lib/seo';
import { ScaleIcon, XIcon, ShareIcon, PrinterIcon, DownloadIcon, HeartIcon, PlusIcon, SearchIcon, TrophyIcon, ZapIcon } from '@/components/icons';

type Item = Cpu | Gpu;

/* ---------- spec rows shared by CPU/GPU columns ---------- */
interface RowDef { label: string; get: (i: Item) => number | string | null | undefined; better?: 'high' | 'low'; fmt?: (v: number) => string; group: string; }

const num = (v: number | null | undefined) => (v == null ? null : v);

const ROWS: RowDef[] = [
  { group: 'General', label: 'Brand', get: (i) => i.brand },
  { group: 'General', label: 'Category', get: (i) => i.category },
  { group: 'General', label: 'Architecture', get: (i) => i.architecture },
  { group: 'General', label: 'Released', get: (i) => i.releaseDate },
  { group: 'General', label: 'Launch MSRP', get: (i) => num(i.launchPrice), better: 'low', fmt: (v) => `$${v}` },
  { group: 'General', label: 'Street price', get: (i) => num(i.price), better: 'low', fmt: (v) => `$${v}` },
  // CPU
  { group: 'CPU', label: 'Socket', get: (i) => (isCpuItem(i) ? i.socket : null) },
  { group: 'CPU', label: 'Cores', get: (i) => (isCpuItem(i) ? i.cores : null), better: 'high' },
  { group: 'CPU', label: 'Threads', get: (i) => (isCpuItem(i) ? i.threads : null), better: 'high' },
  { group: 'CPU', label: 'Base clock', get: (i) => (isCpuItem(i) ? i.baseClock : null), better: 'high', fmt: (v) => `${v} GHz` },
  { group: 'CPU', label: 'Boost clock', get: (i) => (isCpuItem(i) ? i.boostClock : null), better: 'high', fmt: (v) => `${v} GHz` },
  { group: 'CPU', label: 'L3 cache', get: (i) => (isCpuItem(i) ? i.cacheL3 : null), better: 'high', fmt: (v) => `${v} MB` },
  { group: 'CPU', label: 'Process node', get: (i) => (isCpuItem(i) ? i.processNode : null), better: 'low', fmt: (v) => `${v} nm` },
  { group: 'CPU', label: 'Integrated graphics', get: (i) => (isCpuItem(i) ? i.iGPU ?? 'None' : null) },
  { group: 'CPU', label: 'Overclockable', get: (i) => (isCpuItem(i) ? (i.overclockable ? 'Yes' : 'No') : null) },
  { group: 'CPU', label: 'Memory support', get: (i) => (isCpuItem(i) ? i.memoryTypes.join(', ') : null) },
  // GPU
  { group: 'GPU', label: 'Chip', get: (i) => (!isCpuItem(i) ? i.chip : null) },
  { group: 'GPU', label: 'Shaders', get: (i) => (!isCpuItem(i) ? i.shaders : null), better: 'high', fmt: (v) => v.toLocaleString() },
  { group: 'GPU', label: 'VRAM', get: (i) => (!isCpuItem(i) ? i.vram : null), better: 'high', fmt: (v) => `${v} GB` },
  { group: 'GPU', label: 'Memory type', get: (i) => (!isCpuItem(i) ? i.memoryType : null) },
  { group: 'GPU', label: 'Bus width', get: (i) => (!isCpuItem(i) ? i.memoryBus : null), better: 'high', fmt: (v) => `${v}-bit` },
  { group: 'GPU', label: 'Bandwidth', get: (i) => (!isCpuItem(i) ? i.bandwidth : null), better: 'high', fmt: (v) => `${v} GB/s` },
  { group: 'GPU', label: 'Ray tracing', get: (i) => (!isCpuItem(i) ? (i.raytracing ? 'Yes' : 'No') : null) },
  { group: 'GPU', label: 'DLSS / FSR / XeSS', get: (i) => (!isCpuItem(i) ? `${i.dlss ? 'DLSS' : '—'} / ${i.fsr ? 'FSR' : '—'} / ${i.xess ? 'XeSS' : '—'}` : null) },
  { group: 'GPU', label: 'Form factor', get: (i) => (!isCpuItem(i) ? i.formFactor : null) },
  // Common
  { group: 'Power', label: 'TDP', get: (i) => i.tdp, better: 'low', fmt: (v) => `${v} W` },
];

const BENCH_ROWS: RowDef[] = [
  { group: 'Benchmarks', label: 'Single-core index', get: (i) => (isCpuItem(i) ? i.benchmarks.single : null), better: 'high' },
  { group: 'Benchmarks', label: 'Multi-core index', get: (i) => (isCpuItem(i) ? i.benchmarks.multi : null), better: 'high' },
  { group: 'Benchmarks', label: 'Productivity index', get: (i) => (isCpuItem(i) ? i.benchmarks.productivity : null), better: 'high' },
  { group: 'Benchmarks', label: 'Gaming index (CPU)', get: (i) => (isCpuItem(i) ? i.benchmarks.gaming : null), better: 'high' },
  { group: 'Benchmarks', label: 'Raster index (GPU)', get: (i) => (!isCpuItem(i) ? i.benchmarks.raster : null), better: 'high' },
  { group: 'Benchmarks', label: 'Ray-tracing index (GPU)', get: (i) => (!isCpuItem(i) ? i.benchmarks.rayTracing : null), better: 'high' },
  { group: 'Benchmarks', label: 'Render index (GPU)', get: (i) => (!isCpuItem(i) ? i.benchmarks.render : null), better: 'high' },
];

function perfOf(i: Item): number { return isCpuItem(i) ? i.benchmarks.multi : i.benchmarks.raster; }
function ppdOf(i: Item): number | null { return i.price ? perfOf(i) / i.price : null; }
function effOf(i: Item): number { return perfOf(i) / Math.max(15, i.tdp); }

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const compareList = useAppStore((s) => s.compareList);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toast = useAppStore((s) => s.toast);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pq, setPq] = useState('');

  // URL sharing: ?a=cpu:slug&b=gpu:slug... — import once on mount / explicit change
  useEffect(() => {
    const keys = ['a', 'b', 'c', 'd'].map((k) => params.get(k)).filter(Boolean) as string[];
    if (keys.length && !keys.every((k) => compareList.includes(k))) {
      keys.forEach((k) => { if (getItem(k) && !compareList.includes(k)) toggleCompare(k); });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  // keep URL in sync for shareable links
  useEffect(() => {
    const p = new URLSearchParams();
    ['a', 'b', 'c', 'd'].forEach((k, idx) => { if (compareList[idx]) p.set(k, compareList[idx]); });
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareList.join('|')]);

  const items = useMemo(() => compareList.map(getItem).filter(Boolean) as Item[], [compareList]);
  const keys = compareList;

  useSeo({
    title: items.length >= 2 ? `Compare ${items.map((i) => i.name).join(' vs ')}` : 'Comparison tool',
    description: 'Side-by-side hardware comparison with winner highlighting, percentage deltas, performance charts and automatic verdict.',
  });

  const url = () => location.href;
  const share = async () => {
    const ok = await copyToClipboard(url());
    toast(ok ? 'Comparison link copied!' : 'Copy failed — select the URL manually', ok ? 'success' : 'error');
  };

  const exportCsv = () => {
    const rows: (string | number | null)[][] = [['Specification', ...items.map((i) => i.name)]];
    [...ROWS, ...BENCH_ROWS].forEach((r) => {
      if (!items.some((i) => r.get(i) != null)) return;
      rows.push([r.label, ...items.map((i) => { const v = r.get(i); return typeof v === 'number' ? v : v ?? ''; })]);
    });
    rows.push(['Value (perf per $)', ...items.map((i) => ppdOf(i)?.toFixed(2) ?? '')]);
    rows.push(['Efficiency (perf per W)', ...items.map((i) => effOf(i).toFixed(2))]);
    download('drdiscord2-comparison.csv', toCSV(rows), 'text/csv');
    toast('CSV exported', 'success');
  };

  const exportPdf = () => {
    if (items.length < 2) return;
    printSpecSheet(`Comparison: ${items.map((i) => i.name).join(' vs ')}`, [
      { heading: 'Specifications', rows: [...ROWS, ...BENCH_ROWS].map((r) => [r.label, items.map((i) => String(r.get(i) ?? '—')).join('  |  ')]) },
      { heading: 'Summary', rows: [['Winner (performance)', best(items).name], ['Best value', bestValue(items)?.name ?? 'n/a'], ['Most efficient', bestEff(items).name]] },
    ], `<p style="font-size:12px;color:#555">${verdictText(items)}</p>`);
  };

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <Section title="Comparison tool" sub="Pick up to four CPUs or GPUs and compare them side by side.">
          <EmptyState icon={<ScaleIcon size={40} />} title="Nothing selected yet"
            body="Add hardware from the catalogs using the scale button, or start below."
            action={<div className="flex gap-2"><Link to="/cpu" className="btn btn-primary">Browse CPUs</Link><Link to="/gpu" className="btn btn-ghost">Browse GPUs</Link></div>} />
        </Section>
      </div>
    );
  }

  const perfBars = [{ key: 'perf', label: 'Performance index', color: '#22d3ee' }];
  const clean = (i: Item) => i.name.replace(/^(Intel|AMD|NVIDIA) /, '');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-50 md:text-3xl">Head-to-head comparison</h1>
          <p className="mt-1 text-sm text-ink-400">{items.length} of 4 parts · winners highlighted · deltas computed automatically</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.length >= 2 && <button className="btn btn-ghost" onClick={share}><ShareIcon size={15} /> Share URL</button>}
          {items.length >= 2 && <button className="btn btn-ghost" onClick={() => { items.forEach((i) => { const k = `${i.type}:${i.slug}`; if (!favorites.includes(k)) toggleFavorite(k); }); toast('Comparison saved to favorites', 'success'); }}><HeartIcon size={15} /> Save</button>}
          {items.length >= 2 && <button className="btn btn-ghost" onClick={exportPdf}><PrinterIcon size={15} /> PDF</button>}
          {items.length >= 2 && <button className="btn btn-ghost" onClick={exportCsv}><DownloadIcon size={15} /> CSV</button>}
          <button className="btn btn-ghost" onClick={() => setPickerOpen(true)}><PlusIcon size={15} /> Add part</button>
          <button className="btn btn-ghost text-red-400" onClick={clearCompare}><XIcon size={15} /> Clear</button>
        </div>
      </div>

      {/* Column headers */}
      <div className="glass mb-4 grid gap-2 rounded-xl p-3" style={{ gridTemplateColumns: `minmax(140px,180px) repeat(${items.length}, minmax(0,1fr))` }}>
        <div className="hidden items-center px-2 text-xs uppercase tracking-wide text-ink-500 sm:flex">Specification</div>
        {items.map((i, idx) => (
          <div key={keys[idx]} className="rounded-lg bg-ink-800/60 p-3 text-center">
            <Badge tone={i.type === 'cpu' ? 'cyan' : 'violet'}>{i.type.toUpperCase()}</Badge>
            <Link to={`/${i.type}/${i.slug}`} className="mt-1 block truncate font-display text-sm font-bold text-ink-50 hover:text-accent">{i.name}</Link>
            <div className="mt-1 text-xs text-ink-400">{fmtPrice(i.price)}</div>
            <button onClick={() => toggleCompare(keys[idx])} className="mt-1 text-[11px] text-ink-500 hover:text-red-400">remove ✕</button>
          </div>
        ))}
      </div>

      {/* Spec table with winner highlight + % delta */}
      <div className="space-y-4">
        {['General', 'CPU', 'GPU', 'Power', 'Benchmarks'].map((group) => {
          const rows = [...ROWS, ...BENCH_ROWS].filter((r) => r.group === group && items.some((i) => r.get(i) != null));
          if (!rows.length) return null;
          return (
            <div key={group} className="glass overflow-hidden rounded-xl">
              <div className="border-b border-ink-700/50 bg-ink-800/50 px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-accent">{group}</div>
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((r) => <SpecRow key={r.label} row={r} items={items} />)}
                  {(group === 'Power' || group === 'Benchmarks') && group === 'Benchmarks' && (
                    <>
                      <DerivedRow label="Perf per dollar" values={items.map(ppdOf)} better="high" fmt={(v) => v.toFixed(2)} items={items} />
                      <DerivedRow label="Perf per watt" values={items.map((i) => effOf(i))} better="high" fmt={(v) => v.toFixed(2)} items={items} />
                    </>
                  )}
                  {group === 'Power' && (
                    <DerivedRow label="Est. system load draw (W)" values={items.map((i) => Math.round(perfOf(i) * 0.02 + i.tdp + 150))} better="low" fmt={(v) => `${Math.round(v)} W`} items={items} />
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {items.length >= 2 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Section title="Performance delta" sub="Percentage difference relative to the leader.">
            <DeltaBars items={items} metric={perfOf} label="Overall performance" color="#22d3ee" />
          </Section>
          <Section title="Price / performance" sub="Lower bars are cheaper per unit of performance.">
            <BarsChart height={240} xKey="name" bars={[{ key: 'cost', label: '$ per 100 perf points', color: '#fb923c' }]}
              data={items.map((i) => ({ name: clean(i), cost: i.price ? Math.round((i.price / perfOf(i)) * 100) : 0 }))} />
          </Section>
          <Section title="Power consumption" >
            <BarsChart height={220} xKey="name" bars={[{ key: 'tdp', label: 'TDP, W', color: '#f87171' }]} data={items.map((i) => ({ name: clean(i), tdp: i.tdp }))} />
          </Section>
          <Section title="Efficiency (perf per watt)">
            <BarsChart height={220} xKey="name" bars={perfBars.map((b) => ({ ...b, color: '#34d399' }))} data={items.map((i) => ({ name: clean(i), perf: Math.round(effOf(i) * 100) }))} />
          </Section>
          <div className="lg:col-span-2 glass rounded-xl p-5">
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-ink-50"><TrophyIcon size={16} className="text-accent" /> Automatic verdict</h3>
            <p className="text-sm leading-relaxed text-ink-200">{verdictText(items)}</p>
          </div>
          {items.every((i) => i.price != null) && items.length === 2 && (
            <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
              {items.map((i) => (
                <div key={i.slug} className="glass rounded-xl p-5">
                  <h4 className="mb-2 text-sm font-semibold text-ink-300">Price history — {i.name}</h4>
                  <PriceHistoryChart series={priceHistory(i.releaseDate, i.launchPrice, i.price)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-ink-500">Tip: this page is fully shareable — the current selection lives in the URL. Print-friendly layout included.</p>

      {/* Picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setPickerOpen(false)}>
          <div className="glass-strong w-full max-w-xl rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-ink-50">Add a part to compare</h3>
            <div className="relative mt-3">
              <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input autoFocus className="input pl-9" placeholder="Search CPUs & GPUs…" value={pq} onChange={(e) => setPq(e.target.value)} />
            </div>
            <ul className="mt-3 max-h-80 space-y-1 overflow-auto">
              {[...allCpus, ...allGpus]
                .filter((x) => !pq || x.name.toLowerCase().includes(pq.toLowerCase()))
                .slice(0, 20)
                .map((x) => {
                  const k = `${x.type}:${x.slug}`;
                  const active = compareList.includes(k);
                  return (
                    <li key={k}>
                      <button disabled={!active && compareList.length >= 4} className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-700/50 disabled:opacity-40', active && 'ring-1 ring-accent/60')}
                        onClick={() => { toggleCompare(k); }}>
                        <span className="truncate text-ink-100">{x.name}</span>
                        <span className="ml-2 flex shrink-0 items-center gap-2 text-xs text-ink-400">
                          <Badge tone={x.type === 'cpu' ? 'cyan' : 'violet'}>{x.type.toUpperCase()}</Badge>
                          {active ? 'in compare ✓' : '+ add'}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <Link to={hashHref('/benchmarks')} className="btn btn-ghost">Benchmarks DB</Link>
              <button className="btn btn-primary" onClick={() => setPickerOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SpecRow({ row, items }: { row: RowDef; items: Item[] }) {
  const vals = items.map((i) => row.get(i));
  let winnerIdx = -1;
  if (row.better && vals.some((v) => typeof v === 'number')) {
    const nums = vals.map((v) => (typeof v === 'number' ? v : NaN));
    const target = row.better === 'high' ? Math.max(...nums) : Math.min(...nums.filter((n) => !Number.isNaN(n)));
    winnerIdx = nums.indexOf(target);
  }
  const leadVal = winnerIdx >= 0 && typeof vals[winnerIdx] === 'number' ? (vals[winnerIdx] as number) : null;
  return (
    <tr className="border-b border-ink-700/30 last:border-0">
      <td className="w-40 px-4 py-2 text-ink-400 sm:w-48">{row.label}</td>
      {vals.map((v, idx) => {
        const isNum = typeof v === 'number';
        const delta = isNum && leadVal != null && idx !== winnerIdx && leadVal !== 0 ? ((v - leadVal) / leadVal) * 100 : null;
        return (
          <td key={idx} className={cn('px-4 py-2 text-center tabular-nums', idx === winnerIdx && 'bg-accent/10 font-bold text-accent')}>
            {v == null ? <span className="text-ink-600">—</span> : (
              <>
                {isNum ? (row.fmt ? row.fmt(v) : v.toLocaleString()) : String(v)}
                {delta != null && Math.abs(delta) >= 0.5 && (
                  <span className={cn('ml-1.5 text-[11px]', delta > 0 ? 'text-emerald-400' : 'text-red-400')}>{delta > 0 ? '+' : ''}{delta.toFixed(0)}%</span>
                )}
              </>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function DerivedRow({ label, values, better, fmt, items }: { label: string; values: (number | null)[]; better: 'high' | 'low'; fmt: (v: number) => string; items: Item[] }) {
  const valid = values.filter((v): v is number => v != null && !Number.isNaN(v));
  if (valid.length === 0) return null;
  const target = better === 'high' ? Math.max(...valid) : Math.min(...valid);
  return (
    <tr className="border-b border-ink-700/30 bg-ink-800/30 last:border-0">
      <td className="px-4 py-2 text-ink-400">{label}</td>
      {values.map((v, idx) => (
        <td key={idx} className={cn('px-4 py-2 text-center tabular-nums', v === target && 'bg-accent/10 font-bold text-accent')}>
          {v == null ? '—' : fmt(v)}
        </td>
      ))}
    </tr>
  );
}

function DeltaBars({ items, metric, label, color }: { items: Item[]; metric: (i: Item) => number; label: string; color: string }) {
  const max = Math.max(...items.map(metric));
  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-3 text-xs uppercase tracking-wide text-ink-400">{label}</div>
      <div className="space-y-3">
        {items.map((i) => {
          const v = metric(i);
          const d = ((v - max) / max) * 100;
          return (
            <div key={i.slug}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="truncate pr-2 text-ink-200">{i.name}</span>
                <span className={cn('tabular-nums', d === 0 ? 'font-bold text-accent' : 'text-red-400')}>{d === 0 ? 'leader' : `${d.toFixed(1)}%`}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-ink-700/60">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(4, (v / max) * 100)}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function best(items: Item[]): Item { return [...items].sort((a, b) => perfOf(b) - perfOf(a))[0]; }
function bestValue(items: Item[]): Item | undefined { return [...items].sort((a, b) => (ppdOf(b) ?? 0) - (ppdOf(a) ?? 0)).find((i) => i.price != null); }
function bestEff(items: Item[]): Item { return [...items].sort((a, b) => effOf(b) - effOf(a))[0]; }

function verdictText(items: Item[]): string {
  const perfWinner = best(items);
  const value = bestValue(items);
  const eff = bestEff(items);
  const second = [...items].sort((a, b) => perfOf(b) - perfOf(a))[1];
  const gap = second ? (((perfOf(perfWinner) - perfOf(second)) / perfOf(second)) * 100) : 0;
  const cheapest = [...items].filter((i) => i.price != null).sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];
  const mixed = new Set(items.map((i) => i.type)).size > 1;
  const parts = [
    `<b>${perfWinner.name}</b> wins on raw performance`,
    second ? gap >= 100 ? `(about ${Math.round(gap)}% ahead of ${second.name})` : `(narrow margin over ${second.name}, ${gap.toFixed(1)}%)` : '',
    value ? <> while <b>{value.name}</b> offers the best performance-per-dollar at {fmtPrice(value.price)}</> : '',
    eff !== perfWinner && eff !== value ? <> and <b>{eff.name}</b> is the efficiency champion ({effOf(eff).toFixed(2)} idx/W)</> : '',
    cheapest && cheapest !== value ? <> The lowest entry price is <b>{cheapest.name}</b> at {fmtPrice(cheapest.price)}</> : '',
    mixed ? ' Note: you are comparing different hardware classes — CPU indices measure compute throughput, GPU indices measure rendering throughput.' : '',
  ].filter(Boolean);
  return `${parts.join('; ')}.`;
}

// render helper to allow JSX fragments inside verdict builder above
export function VerdictRender() { return null; }
