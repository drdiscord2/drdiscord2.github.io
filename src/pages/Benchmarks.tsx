import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allCpus, allGpus, getCpu, getGpu, gameList, gamesForCpu, gamesForGpu } from '@/lib/db';
import type { Cpu, Gpu } from '@/types/hardware';
import { Section, Badge, Select } from '@/components/ui';
import { BarsChart } from '@/components/charts';
import { VirtualList } from '@/components/VirtualList';
import { useSeo } from '@/lib/seo';
import { cn, fmtPrice } from '@/lib/utils';
import { toCSV, download } from '@/lib/utils';
import { TrophyIcon, DownloadIcon } from '@/components/icons';

type Row = { slug: string; name: string; brand: string; category: string; price: number | null; metric: number; tdp: number };

export default function Benchmarks() {
  const [pool, setPool] = useState<'cpu' | 'gpu'>('cpu');
  const [metric, setMetric] = useState('multi');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [game, setGame] = useState(gameList[0]);
  const cpu = pool === 'cpu';
  const metrics = cpu
    ? [['multi', 'Multi-core index'], ['single', 'Single-core index'], ['gaming', 'Gaming index']]
    : [['raster', 'Raster index'], ['rt', 'Ray tracing index'], ['render', 'Render index']];

  const rows = useMemo<Row[]>(() => {
    const base = (cpu ? allCpus : allGpus).filter((i) => (!category || i.category === category) && (!brand || i.brand === brand));
    if (cpu) return (base as Cpu[]).map((c) => ({ slug: c.slug, name: c.name, brand: c.brand, category: c.category, price: c.price, tdp: c.tdp, metric: metric === 'game' ? Math.round(gamesForCpu(c.slug).find((g) => g.game === game)?.fps1080 ?? 0) : c.benchmarks[metric as keyof Cpu['benchmarks']] }));
    return (base as Gpu[]).map((g) => ({ slug: g.slug, name: g.name, brand: g.brand, category: g.category, price: g.price, tdp: g.tdp, metric: metric === 'game' ? Math.round(gamesForGpu(g.slug).find((x) => x.game === game)?.fps1080 ?? 0) : (g.benchmarks as unknown as Record<string, number>)[metric] }));
  }, [cpu, metric, category, brand, game]);

  const sorted = useMemo(() => [...rows].sort((a, b) => b.metric - a.metric), [rows]);
  const maxV = sorted[0]?.metric ?? 1;
  const brands = Array.from(new Set((cpu ? allCpus : allGpus).map((i) => i.brand))).sort();

  const exportCsv = () => {
    download(`infomachine-benchmarks-${pool}-${metric}.csv`, toCSV([['Rank', 'Name', 'Brand', 'Category', 'Value', 'TDP', 'Price'], ...sorted.map((r, i) => [i + 1, r.name, r.brand, r.category, r.metric, r.tdp, r.price ?? ''])]), 'text/csv');
  };

  useSeo({ title: `${cpu ? 'CPU' : 'GPU'} Benchmarks — ${metrics.find((m) => m[0] === metric)?.[1] ?? 'Gaming FPS'}`, description: `Leaderboard of ${cpu ? 'processor' : 'graphics card'} benchmark results with filters and CSV export.` });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2"><TrophyIcon size={24} /> Benchmark leaderboards</h1>
          <p className="mt-1 text-sm text-ink-400">{sorted.length} components ranked by the selected metric. Relative indices where the market leader = 100.</p>
        </div>
        <button onClick={exportCsv} className="btn-secondary !py-1.5 text-xs"><DownloadIcon size={13} /> Export CSV</button>
      </div>

      <div className="glass mb-6 grid gap-3 rounded-xl p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Select label="Database" value={pool} onChange={(v) => { setPool(v as 'cpu' | 'gpu'); setMetric(v === 'cpu' ? 'multi' : 'raster'); }} options={[{ value: 'cpu', label: 'CPUs' }, { value: 'gpu', label: 'GPUs' }]} />
        <Select label="Metric" value={metric} onChange={setMetric} options={[...metrics.map(([value, label]) => ({ value, label })), { value: 'game', label: 'Game FPS (1080p)' }]} />
        {metric === 'game' && <Select label="Game" value={game} onChange={setGame} options={gameList.map((g) => ({ value: g, label: g }))} />}
        <Select label="Category" value={category} onChange={setCategory} options={(cpu ? ['desktop', 'mobile', 'server', 'legacy'] : ['desktop', 'laptop', 'workstation', 'legacy']).map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }))} allLabel="All categories" />
        <Select label="Brand" value={brand} onChange={setBrand} options={brands.map((b) => ({ value: b, label: b }))} allLabel="All brands" />
      </div>

      <Section title={`${metrics.find((m) => m[0] === metric)?.[1] ?? `${game} FPS`} — top 15`}>
        <BarsChart height={320} xKey="name" data={sorted.slice(0, 15).map((r) => ({ name: r.name.replace(/^(AMD|Intel Core|NVIDIA GeForce) /, ''), val: r.metric }))} bars={[{ key: 'val', label: metric === 'game' ? 'FPS' : 'Index' }]} />
      </Section>

      <Section title="Full table" sub={`Sorted descending · showing all ${sorted.length} matching rows (virtualized for smooth scrolling)`}>
        <div className="glass overflow-hidden rounded-xl">
          <div className="grid grid-cols-[40px_1fr_90px_70px_70px_80px] gap-2 border-b border-white/10 px-4 py-2 text-[11px] uppercase tracking-wide text-ink-500">
            <span>#</span><span>Component</span><span>Result</span><span>TDP</span><span>Price</span><span></span>
          </div>
          <VirtualList items={sorted} itemHeight={44} className="h-[60vh]" keyOf={(r) => r.slug} renderItem={(r, idx) => (
            <div className="grid h-full grid-cols-[40px_1fr_90px_70px_70px_80px] items-center gap-2 border-b border-white/5 px-4 text-sm">
              <span className={cn('tabular-nums font-bold', idx < 3 ? 'text-accent' : 'text-ink-500')}>{idx + 1}</span>
              <Link to={`/${pool}/${r.slug}`} className="truncate font-medium text-ink-100 hover:text-accent">{r.name} <Badge tone="slate" className="ml-1 hidden md:inline-flex">{r.category}</Badge></Link>
              <span className="relative hidden sm:block">
                <span className="absolute inset-y-1.5 left-0 rounded bg-accent/15" style={{ width: `${Math.round((r.metric / maxV) * 100)}%` }} aria-hidden />
                <span className="relative tabular-nums text-accent">{r.metric}</span>
              </span>
              <span className="tabular-nums text-ink-400">{r.tdp}W</span>
              <span className="tabular-nums text-ink-300">{fmtPrice(r.price)}</span>
              <Link to={`/compare?items=${pool}:${r.slug}`} className="link text-xs">Compare →</Link>
            </div>
          )} />
        </div>
      </Section>
    </div>
  );
}
