import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { allCpus, allGpus, useAsyncData } from '@/lib/db';
import type { Cpu, Gpu } from '@/types/hardware';
import { CpuCard, GpuCard, CpuRow, GpuRow } from '@/components/HardwareCard';
import { Select, RangeInput, Badge, CardActions } from '@/components/ui';
import { GridSkeleton, EmptyState } from '@/components/Skeleton';
import { VirtualList } from '@/components/VirtualList';
import { SearchIcon, GridIcon, ListIcon, TableIcon, DownloadIcon, FilterIcon, RefreshIcon, SaveIcon, TrashIcon, XIcon } from '@/components/icons';
import { cn, fmtPrice, toCSV, download } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useSeo } from '@/lib/seo';

type Item = Cpu | Gpu;
const isCpu = (i: Item): i is Cpu => 'cores' in i && !('chip' in i);

const SORTS_CPU = [
  { value: 'multi-desc', label: 'Multicore ↓' }, { value: 'multi-asc', label: 'Multicore ↑' }, { value: 'single-desc', label: 'Single-core ↓' },
  { value: 'gaming-desc', label: 'Gaming ↓' }, { value: 'price-asc', label: 'Price ↑' }, { value: 'price-desc', label: 'Price ↓' },
  { value: 'ppd-desc', label: 'Perf/$ ↓' }, { value: 'tdp-asc', label: 'TDP ↑' }, { value: 'release-desc', label: 'Newest' }
];
const SORTS_GPU = [
  { value: 'raster-desc', label: 'Raster ↓' }, { value: 'rt-desc', label: 'Ray tracing ↓' }, { value: 'render-desc', label: 'Render ↓' },
  { value: 'price-asc', label: 'Price ↑' }, { value: 'price-desc', label: 'Price ↓' }, { value: 'ppd-desc', label: 'Perf/$ ↓' },
  { value: 'tdp-asc', label: 'TDP ↑' }, { value: 'vram-desc', label: 'VRAM ↓' }, { value: 'release-desc', label: 'Newest' }
];

function applySort(list: Item[], sort: string): Item[] {
  const arr = [...list];
  const priceOf = (i: Item) => i.price ?? Number.MAX_SAFE_INTEGER;
  const perfOf = (i: Item) => (isCpu(i) ? i.benchmarks.multi : i.benchmarks.render);
  const ppd = (i: Item) => (i.price ? perfOf(i) / i.price : 0);
  const multi = (i: Item) => (isCpu(i) ? i.benchmarks.multi : 0);
  const single = (i: Item) => (isCpu(i) ? i.benchmarks.single : 0);
  const gaming = (i: Item) => (isCpu(i) ? i.benchmarks.gaming : 0);
  const raster = (i: Item) => (isCpu(i) ? 0 : i.benchmarks.raster);
  const rt = (i: Item) => (isCpu(i) ? 0 : i.benchmarks.rayTracing);
  const render = (i: Item) => (isCpu(i) ? 0 : i.benchmarks.render);
  switch (sort) {
    case 'multi-desc': return arr.sort((a, b) => multi(b) - multi(a));
    case 'multi-asc': return arr.sort((a, b) => multi(a) - multi(b));
    case 'single-desc': return arr.sort((a, b) => single(b) - single(a));
    case 'gaming-desc': return arr.sort((a, b) => gaming(b) - gaming(a));
    case 'raster-desc': return arr.sort((a, b) => raster(b) - raster(a));
    case 'rt-desc': return arr.sort((a, b) => rt(b) - rt(a));
    case 'render-desc': return arr.sort((a, b) => render(b) - render(a));
    case 'vram-desc': return arr.sort((a, b) => (b as Gpu).vram - (a as Gpu).vram);
    case 'price-asc': return arr.sort((a, b) => priceOf(a) - priceOf(b));
    case 'price-desc': return arr.sort((a, b) => priceOf(b) - priceOf(a));
    case 'ppd-desc': return arr.sort((a, b) => ppd(b) - ppd(a));
    case 'tdp-asc': return arr.sort((a, b) => a.tdp - b.tdp);
    case 'release-desc': return arr.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    default: return arr;
  }
}

export function HardwareList({ kind }: { kind: 'cpu' | 'gpu' }) {
  const cpu = kind === 'cpu';
  const [params, setParams] = useSearchParams();
  const { loading } = useAsyncData(() => true, [kind]);

  const base = useMemo<Item[]>(() => (cpu ? allCpus : allGpus), [cpu]);
  const defaults = useMemo(() => {
    const prices = base.map((b) => b.price ?? 0);
    return { pmin: 0, pmax: Math.ceil(Math.max(...prices, 100) / 50) * 50 };
  }, [base]);

  const [q, setQ] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(q);
  const initialPmax = +(params.get('pmax') ?? 0) || undefined;
  const [brand, setBrand] = useState(params.get('brand') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [arch, setArch] = useState(params.get('arch') ?? '');
  const [socket, setSocket] = useState(params.get('socket') ?? '');
  const [price, setPrice] = useState<[number, number]>([+(params.get('pmin') ?? 0), initialPmax ?? defaults.pmax]);
  const [tdp, setTdp] = useState<[number, number]>([+(params.get('tmin') ?? 0), +(params.get('tmax') ?? 500)]);
  const [year, setYear] = useState<[number, number]>([+(params.get('ymin') ?? 2004), +(params.get('ymax') ?? 2026)]);
  const [onlyInStock, setOnlyInStock] = useState(params.get('stock') === '1');
  // CPU-only filters
  const [cores, setCores] = useState<[number, number]>([+(params.get('cmin') ?? 0), +(params.get('cmax') ?? 128)]);
  const [threads, setThreads] = useState<[number, number]>([+(params.get('thmin') ?? 0), +(params.get('thmax') ?? 256)]);
  const [baseClock, setBaseClock] = useState<[number, number]>([+(params.get('bcmin') ?? 0), +(params.get('bcmax') ?? 6)]);
  const [boostClock, setBoostClock] = useState<[number, number]>([+(params.get('bkmin') ?? 0), +(params.get('bkmax') ?? 7)]);
  const [node, setNode] = useState<[number, number]>([+(params.get('nmin') ?? 3), +(params.get('nmax') ?? 90)]);
  const [igpu, setIgpu] = useState(params.get('igpu') ?? ''); // '' | 'yes' | 'no'
  const [oc, setOc] = useState(params.get('oc') ?? ''); // '' | 'yes' | 'no'
  const [memSupport, setMemSupport] = useState(params.get('mems') ?? ''); // '' | DDR4 | DDR5 | LPDDR5X ...
  // GPU-only filters
  const [vram, setVram] = useState<[number, number]>([+(params.get('vmin') ?? 0), +(params.get('vmax') ?? 48)]);
  const [memType, setMemType] = useState(params.get('mem') ?? '');
  const [bus, setBus] = useState<[number, number]>([+(params.get('bmin') ?? 0), +(params.get('bmax') ?? 4096)]);
  const [features, setFeatures] = useState<string[]>(() => { const f = params.get('feat'); return f ? f.split(',') : []; });
  const [formFactor, setFormFactor] = useState(params.get('ff') ?? '');
  const [sort, setSort] = useState(params.get('sort') ?? (cpu ? 'multi-desc' : 'raster-desc'));
  const [view, setView] = useState<'grid' | 'list' | 'table'>(params.get('view') === 'list' ? 'list' : params.get('view') === 'table' ? 'table' : 'grid');
  const [page, setPage] = useState<number>(+(params.get('page') ?? 1) || 1);
  const [mode, setMode] = useState<'pagination' | 'infinite'>((params.get('mode') as 'pagination' | 'infinite') ?? 'pagination');
  const [visible, setVisible] = useState(36); // infinite-scroll window
  const PAGE_SIZE = 24;
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setDebounced(q), 200); return () => clearTimeout(t); }, [q]);

  const presets = useAppStore((s) => s.presets.filter((p) => p.kind === kind));
  const savePreset = useAppStore((s) => s.savePreset);
  const deletePreset = useAppStore((s) => s.deletePreset);
  const toast = useAppStore((s) => s.toast);

  // URL <-> state sync
  useEffect(() => {
    const p = new URLSearchParams();
    if (debounced) p.set('q', debounced);
    if (brand) p.set('brand', brand);
    if (category) p.set('category', category);
    if (arch) p.set('arch', arch);
    if (socket) p.set('socket', socket);
    if (price[0] !== 0) p.set('pmin', String(price[0]));
    if (price[1] !== defaults.pmax) p.set('pmax', String(price[1]));
    if (tdp[0] !== 0) p.set('tmin', String(tdp[0]));
    if (tdp[1] !== 500) p.set('tmax', String(tdp[1]));
    if (year[0] !== 2004) p.set('ymin', String(year[0]));
    if (year[1] !== 2026) p.set('ymax', String(year[1]));
    if (onlyInStock) p.set('stock', '1');
    if (cpu) {
      if (cores[0] > 0 || cores[1] < 128) { p.set('cmin', String(cores[0])); p.set('cmax', String(cores[1])); }
      if (threads[0] > 0 || threads[1] < 256) { p.set('thmin', String(threads[0])); p.set('thmax', String(threads[1])); }
      if (baseClock[0] > 0 || baseClock[1] < 6) { p.set('bcmin', String(baseClock[0])); p.set('bcmax', String(baseClock[1])); }
      if (boostClock[0] > 0 || boostClock[1] < 7) { p.set('bkmin', String(boostClock[0])); p.set('bkmax', String(boostClock[1])); }
      if (node[0] > 3 || node[1] < 90) { p.set('nmin', String(node[0])); p.set('nmax', String(node[1])); }
      if (igpu) p.set('igpu', igpu);
      if (oc) p.set('oc', oc);
      if (memSupport) p.set('mems', memSupport);
    } else {
      if (vram[0] > 0 || vram[1] < 48) { p.set('vmin', String(vram[0])); p.set('vmax', String(vram[1])); }
      if (memType) p.set('mem', memType);
      if (bus[0] > 0 || bus[1] < 4096) { p.set('bmin', String(bus[0])); p.set('bmax', String(bus[1])); }
      if (features.length) p.set('feat', features.join(','));
      if (formFactor) p.set('ff', formFactor);
    }
    if (sort !== (cpu ? 'multi-desc' : 'raster-desc')) p.set('sort', sort);
    if (view !== 'grid') p.set('view', view);
    if (mode === 'infinite') p.set('mode', 'infinite');
    if (page > 1) p.set('page', String(page));
    setParams(p, { replace: true });
  }, [debounced, brand, category, arch, socket, price, tdp, year, onlyInStock, cores, threads, baseClock, boostClock, node, igpu, oc, memSupport, vram, memType, bus, features, formFactor, sort, view, mode, page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setPage(1); setVisible(36); }, [debounced, brand, category, arch, socket, price, tdp, year, onlyInStock, cores, threads, baseClock, boostClock, node, igpu, oc, memSupport, vram, memType, bus, features, formFactor, sort]);

  // infinite scroll: auto-grow window when sentinel enters viewport
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mode !== 'infinite' || view === 'list') return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setVisible((v) => Math.min(v + 36, filtered.length));
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mode, view, filtered.length, visible]);

  const brands = useMemo(() => Array.from(new Set(base.map((b) => b.brand))).sort(), [base]);
  const arches = useMemo(() => Array.from(new Set(base.map((b) => b.architecture))).sort(), [base]);
  const sockets = useMemo(() => cpu ? Array.from(new Set((base as Cpu[]).map((c) => c.socket))).sort() : [], [base, cpu]);
  const cats = cpu ? ['desktop', 'mobile', 'server', 'legacy'] : ['desktop', 'laptop', 'workstation', 'legacy'];

  const filtered = useMemo(() => {
    let list = base.filter((i) => {
      const hay = `${i.name} ${i.brand} ${i.architecture} ${cpu ? '' : (i as Gpu).chip}`.toLowerCase();
      if (debounced && !hay.includes(debounced.toLowerCase())) return false;
      if (brand && i.brand !== brand) return false;
      if (category && i.category !== category) return false;
      if (arch && i.architecture !== arch) return false;
      if (cpu && socket && !(i as Cpu).socket.includes(socket)) return false;
      if (cpu) {
        const c = i as Cpu;
        if (cores[0] > 0 || cores[1] < 128) { if (c.cores < cores[0] || c.cores > cores[1]) return false; }
        if (threads[0] > 0 || threads[1] < 256) { if (c.threads < threads[0] || c.threads > threads[1]) return false; }
        if (baseClock[0] > 0 || baseClock[1] < 6) { if (c.baseClock < baseClock[0] || c.baseClock > baseClock[1]) return false; }
        if (boostClock[0] > 0 || boostClock[1] < 7) { if (c.boostClock < boostClock[0] || c.boostClock > boostClock[1]) return false; }
        if (node[0] > 3 || node[1] < 90) { if (c.processNode < node[0] || c.processNode > node[1]) return false; }
        if (igpu === 'yes' && !c.iGPU) return false;
        if (igpu === 'no' && c.iGPU) return false;
        if (oc === 'yes' && !c.overclockable) return false;
        if (oc === 'no' && c.overclockable) return false;
        if (memSupport && !c.memoryTypes.some((m) => m.includes(memSupport))) return false;
      } else {
        const g = i as Gpu;
        if (vram[0] > 0 || vram[1] < 48) { if (g.vram < vram[0] || g.vram > vram[1]) return false; }
        if (memType && g.memoryType !== memType) return false;
        if (bus[0] > 0 || bus[1] < 4096) { if (g.memoryBus < bus[0] || g.memoryBus > bus[1]) return false; }
        for (const f of features) {
          if (f === 'rt' && !g.raytracing) return false;
          if (f === 'dlss' && !g.dlss) return false;
          if (f === 'fsr' && !g.fsr) return false;
          if (f === 'xess' && !g.xess) return false;
          if (f === 'fg' && !g.frameGen) return false;
        }
        if (formFactor && g.formFactor !== formFactor) return false;
      }
      if (price[0] > 0 && (i.price ?? 0) < price[0]) return false;
      if (price[1] < defaults.pmax && (i.price ?? 0) > price[1]) return false;
      if (tdp[1] < 500 && i.tdp > tdp[1]) return false;
      if (tdp[0] > 0 && i.tdp < tdp[0]) return false;
      const y = +i.releaseDate.slice(0, 4);
      if (y < year[0] || y > year[1]) return false;
      if (onlyInStock && i.price == null) return false;
      return true;
    });
    return applySort(list, sort);
  }, [base, debounced, brand, category, arch, socket, price, tdp, year, onlyInStock, cores, threads, baseClock, boostClock, node, igpu, oc, memSupport, vram, memType, bus, features, formFactor, sort, defaults.pmax, cpu]);

  const reset = () => {
    setQ(''); setBrand(''); setCategory(''); setArch(''); setSocket(''); setPrice([0, defaults.pmax]); setTdp([0, 500]); setYear([2004, 2026]); setOnlyInStock(false);
    setCores([0, 128]); setThreads([0, 256]); setBaseClock([0, 6]); setBoostClock([0, 7]); setNode([3, 90]); setIgpu(''); setOc(''); setMemSupport('');
    setVram([0, 48]); setMemType(''); setBus([0, 4096]); setFeatures([]); setFormFactor('');
    setSort(cpu ? 'multi-desc' : 'raster-desc');
  };

  const exportCsv = () => {
    const head = cpu
      ? ['Name', 'Brand', 'Socket', 'Cores', 'Threads', 'Boost GHz', 'TDP', 'Multi', 'Single', 'Gaming', 'Price']
      : ['Name', 'Brand', 'Chip', 'VRAM GB', 'Type', 'Bus', 'TDP', 'Raster', 'RT', 'Render', 'Price'];
    const rows = filtered.map((i) => isCpu(i)
      ? [i.name, i.brand, i.socket, i.cores, i.threads, i.boostClock, i.tdp, i.benchmarks.multi, i.benchmarks.single, i.benchmarks.gaming, i.price ?? '']
      : [i.name, i.brand, i.chip, i.vram, i.memoryType, i.memoryBus, i.tdp, i.benchmarks.raster, i.benchmarks.raytracing, i.benchmarks.render, i.price ?? '']);
    download(`infomachine-${kind}s.csv`, toCSV([head, ...rows]), 'text/csv');
    toast(`Exported ${rows.length} ${kind.toUpperCase()} rows to CSV`);
  };

  const saveCurrentPreset = () => {
    savePreset({ name: `${debounced || 'All'} ${brand || ''} ${category || ''}`.trim() || 'Custom preset', kind, state: params.toString() });
    toast('Filter preset saved — restore it anytime');
  };

  useSeo({
    title: cpu ? 'CPU Database — Specs, Benchmarks & Prices' : 'GPU Database — Specs, Benchmarks & Prices',
    description: cpu ? `Browse ${allCpus.length} desktop, mobile and server CPUs with benchmarks, specs and price history.` : `Browse ${allGpus.length} desktop, laptop and workstation GPUs with FPS benchmarks, specs and prices.`
  });

  const extraActive = cpu
    ? [cores[0] > 0 || cores[1] < 128, threads[0] > 0 || threads[1] < 256, baseClock[0] > 0 || baseClock[1] < 6, boostClock[0] > 0 || boostClock[1] < 7, node[0] > 3 || node[1] < 90, !!igpu, !!oc, !!memSupport].filter(Boolean).length
    : [vram[0] > 0 || vram[1] < 48, !!memType, bus[0] > 0 || bus[1] < 4096, features.length > 0, !!formFactor].filter(Boolean).length;
  const activeCount = [brand, category, arch, socket].filter(Boolean).length + (price[0] > 0 || price[1] < defaults.pmax ? 1 : 0) + (tdp[1] < 500 ? 1 : 0) + (year[0] > 2004 || year[1] < 2026 ? 1 : 0) + (onlyInStock ? 1 : 0) + extraActive;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">{cpu ? 'CPU Database' : 'GPU Database'}</h1>
          <p className="mt-1 text-sm text-ink-400">{base.length} {cpu ? 'processors' : 'graphics cards'} indexed · {filtered.length} match your filters</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5" role="group" aria-label="View mode">
            <button onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label="Grid view" className={cn('rounded-md p-1.5', view === 'grid' ? 'bg-accent/20 text-accent' : 'text-ink-400')}><GridIcon size={16} /></button>
            <button onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label="List view" className={cn('rounded-md p-1.5', view === 'list' ? 'bg-accent/20 text-accent' : 'text-ink-400')}><ListIcon size={16} /></button>
            <button onClick={() => setView('table')} aria-pressed={view === 'table'} aria-label="Table view" className={cn('rounded-md p-1.5', view === 'table' ? 'bg-accent/20 text-accent' : 'text-ink-400')}><TableIcon size={16} /></button>
          </div>
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5" role="group" aria-label="Load mode">
            <button onClick={() => setMode('pagination')} aria-pressed={mode === 'pagination'} className={cn('rounded-md px-2 py-1 text-xs font-medium', mode === 'pagination' ? 'bg-accent/20 text-accent' : 'text-ink-400')}>Pages</button>
            <button onClick={() => setMode('infinite')} aria-pressed={mode === 'infinite'} className={cn('rounded-md px-2 py-1 text-xs font-medium', mode === 'infinite' ? 'bg-accent/20 text-accent' : 'text-ink-400')}>Infinite</button>
          </div>
          <button onClick={exportCsv} className="btn-secondary !py-1.5 text-xs"><DownloadIcon size={14} /> CSV</button>
          <button onClick={() => setFiltersOpen((o) => !o)} className={cn('btn-secondary !py-1.5 text-xs lg:hidden', filtersOpen && '!border-accent/50')}>
            <FilterIcon size={14} /> Filters {activeCount > 0 && <Badge tone="cyan" className="ml-1">{activeCount}</Badge>}
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* FILTER SIDEBAR */}
        <aside className={cn('space-y-4 lg:block', filtersOpen ? 'block' : 'hidden')} aria-label="Filters">
          <div className="glass sticky top-20 space-y-4 rounded-xl p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${kind === 'cpu' ? 'CPUs' : 'GPUs'}…`} aria-label="Search within database" className="input !pl-9" />
            </div>
            <Select label="Brand" value={brand} onChange={setBrand} options={brands.map((b) => ({ value: b, label: b }))} allLabel="All brands" />
            <Select label="Category" value={category} onChange={setCategory} options={cats.map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }))} allLabel="All categories" />
            <Select label="Architecture" value={arch} onChange={setArch} options={arches.map((a) => ({ value: a, label: a }))} allLabel="All architectures" />
            {cpu && <Select label="Socket" value={socket} onChange={setSocket} options={sockets.map((s) => ({ value: s, label: s }))} allLabel="All sockets" />}
            <RangeInput label="Price ($)" min={0} max={defaults.pmax} step={25} value={price} onChange={setPrice} format={(n) => `$${n}`} />
            <RangeInput label="TDP (W)" min={0} max={500} step={15} value={tdp} onChange={setTdp} format={(n) => `${n}W`} />
            <RangeInput label="Release year" min={2004} max={2026} value={year} onChange={setYear} />
            <label className="flex items-center gap-2 text-sm text-ink-300">
              <input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} className="h-4 w-4 accent-cyan-400" /> Only currently priced parts
            </label>

            {cpu ? (
              <>
                <div className="border-t border-white/5 pt-3 text-xs font-medium uppercase tracking-wide text-ink-400">Advanced (CPU)</div>
                <RangeInput label="Cores" min={0} max={128} value={cores} onChange={setCores} />
                <RangeInput label="Threads" min={0} max={256} step={2} value={threads} onChange={setThreads} />
                <RangeInput label="Base clock (GHz)" min={0} max={6} step={0.1} value={baseClock} onChange={setBaseClock} format={(n) => `${n}GHz`} />
                <RangeInput label="Boost clock (GHz)" min={0} max={7} step={0.1} value={boostClock} onChange={setBoostClock} format={(n) => `${n}GHz`} />
                <RangeInput label="Process node (nm)" min={3} max={90} value={node} onChange={setNode} format={(n) => `${n}nm`} />
                <Select label="Integrated graphics" value={igpu} onChange={setIgpu} options={[{ value: 'yes', label: 'With iGPU' }, { value: 'no', label: 'Without iGPU' }]} allLabel="Either" />
                <Select label="Overclocking" value={oc} onChange={setOc} options={[{ value: 'yes', label: 'Unlocked / OC capable' }, { value: 'no', label: 'Locked' }]} allLabel="Either" />
                <Select label="Memory support" value={memSupport} onChange={setMemSupport} options={['DDR4', 'DDR5', 'LPDDR4X', 'LPDDR5X'].map((m) => ({ value: m, label: m }))} allLabel="Any memory" />
              </>
            ) : (
              <>
                <div className="border-t border-white/5 pt-3 text-xs font-medium uppercase tracking-wide text-ink-400">Advanced (GPU)</div>
                <RangeInput label="VRAM (GB)" min={0} max={48} value={vram} onChange={setVram} format={(n) => `${n}GB`} />
                <Select label="Memory type" value={memType} onChange={setMemType} options={['GDDR5', 'GDDR5X', 'GDDR6', 'GDDR6X', 'HBM2', 'HBM2e', 'HBM3'].map((m) => ({ value: m, label: m }))} allLabel="Any type" />
                <RangeInput label="Memory bus (bit)" min={0} max={4096} step={64} value={bus} onChange={setBus} format={(n) => `${n}b`} />
                <div>
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">Features</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[['rt', 'Ray tracing'], ['dlss', 'DLSS'], ['fsr', 'FSR'], ['xess', 'XeSS'], ['fg', 'Frame gen']].map(([id, label]) => {
                      const on = features.includes(id);
                      return (
                        <button key={id} onClick={() => setFeatures((f) => (on ? f.filter((x) => x !== id) : [...f, id]))} aria-pressed={on}
                          className={cn('chip border transition-colors', on ? 'border-accent/50 bg-accent/15 text-accent' : 'border-ink-600/60 bg-ink-800 text-ink-400 hover:text-ink-100')}>{label}</button>
                      );
                    })}
                  </div>
                </div>
                <Select label="Form factor" value={formFactor} onChange={setFormFactor} options={['1-slot', '2-slot', '3-slot', 'Founders', 'Mobile'].map((f) => ({ value: f, label: f }))} allLabel="Any size" />
              </>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={reset} className="btn-ghost flex-1 !py-1.5 text-xs"><RefreshIcon size={13} /> Reset</button>
              <button onClick={saveCurrentPreset} className="btn-secondary flex-1 !py-1.5 text-xs"><SaveIcon size={13} /> Save preset</button>
            </div>
            {presets.length > 0 && (
              <div className="border-t border-white/5 pt-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Saved presets</div>
                <ul className="space-y-1">
                  {presets.map((p) => (
                    <li key={p.id} className="flex items-center gap-1">
                      <button className="link flex-1 truncate text-left text-xs" onClick={() => setParams(new URLSearchParams(p.state))}>{p.name}</button>
                      <button onClick={() => deletePreset(p.id)} aria-label={`Delete preset ${p.name}`} className="text-ink-500 hover:text-red-400"><TrashIcon size={13} /></button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* RESULTS */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Select value={sort} onChange={setSort} options={cpu ? SORTS_CPU : SORTS_GPU} className="w-56 shrink-0" label="Sort by" />
            {activeCount > 0 && (
              <div className="hidden flex-wrap items-center gap-1.5 md:flex">
                {[brand && `Brand: ${brand}`, category && `Cat: ${category}`, arch && arch, socket && (cpu ? `Socket: ${socket}` : `PCIe: ${socket}`), onlyInStock && 'Priced only',
                  ...features.map((f) => f.toUpperCase()), memType && memType, formFactor && formFactor, igpu && `iGPU: ${igpu}`, oc && (oc === 'yes' ? 'OC unlocked' : 'Locked'), memSupport && memSupport].filter(Boolean).map((t) => (
                  <span key={String(t)} className="chip border-accent/30 bg-accent/10 text-accent-soft">
                    {t} <button onClick={reset} aria-label="Clear filters"><XIcon size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            view === 'grid' ? <GridSkeleton count={9} /> : <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="shimmer h-12" />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No components match those filters" body="Try widening the price range or clearing the search." action={<button onClick={reset} className="btn-primary mt-2">Reset filters</button>} />
          ) : (() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const safePage = Math.min(page, totalPages);
              const shown = mode === 'pagination' && view !== 'list'
                ? filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
                : view === 'list' ? filtered : filtered.slice(0, visible);
              return (
                <>
                  {view === 'grid' ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {shown.map((i) => (isCpu(i) ? <CpuCard key={i.slug} c={i} /> : <GpuCard key={i.slug} g={i as Gpu} />))}
                    </div>
                  ) : view === 'table' ? (
                    <div className="glass overflow-x-auto rounded-xl">
                      <table className="w-full min-w-[760px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-ink-400">
                            <th className="px-3 py-2.5">Name</th><th className="px-3 py-2.5">Brand</th>
                            {cpu ? (<><th className="px-3 py-2.5">Socket</th><th className="px-3 py-2.5">C/T</th><th className="px-3 py-2.5">Boost</th><th className="px-3 py-2.5">Multi</th><th className="px-3 py-2.5">Single</th></>)
                                 : (<><th className="px-3 py-2.5">Chip</th><th className="px-3 py-2.5">VRAM</th><th className="px-3 py-2.5">Bus</th><th className="px-3 py-2.5">Raster</th><th className="px-3 py-2.5">RT</th></>)}
                            <th className="px-3 py-2.5">TDP</th><th className="px-3 py-2.5">Price</th><th className="px-3 py-2.5"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {shown.map((i) => (
                            <tr key={i.slug} className="table-row-hover border-b border-white/5">
                              <td className="px-3 py-2"><Link to={`/${kind}/${i.slug}`} className="font-medium text-ink-100 hover:text-accent">{i.name}</Link><div className="text-[11px] text-ink-500">{i.architecture}</div></td>
                              <td className="px-3 py-2 text-ink-300">{i.brand}</td>
                              {cpu ? (() => { const c = i as Cpu; return (<><td className="px-3 py-2 text-ink-300">{c.socket}</td><td className="px-3 py-2 tabular-nums text-ink-300">{c.cores}/{c.threads}</td><td className="px-3 py-2 tabular-nums text-ink-300">{c.boostClock} GHz</td><td className="px-3 py-2 tabular-nums text-accent">{c.benchmarks.multi}</td><td className="px-3 py-2 tabular-nums text-ink-300">{c.benchmarks.single}</td></>); })()
                                   : (() => { const g = i as Gpu; return (<><td className="px-3 py-2 text-ink-300">{g.chip}</td><td className="px-3 py-2 tabular-nums text-ink-300">{g.vram} GB {g.memoryType}</td><td className="px-3 py-2 tabular-nums text-ink-300">{g.memoryBus}b</td><td className="px-3 py-2 tabular-nums text-accent">{g.benchmarks.raster}</td><td className="px-3 py-2 tabular-nums text-ink-300">{g.benchmarks.raytracing}</td></>); })()}
                              <td className="px-3 py-2 tabular-nums text-ink-400">{i.tdp} W</td>
                              <td className="px-3 py-2 tabular-nums font-semibold text-ink-100">{fmtPrice(i.price)}</td>
                              <td className="px-3 py-2"><CardActions itemKey={`${kind}:${i.slug}`} name={i.name} toCompare={`/compare?items=${kind}:${i.slug}`} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="glass overflow-hidden rounded-xl">
                      <VirtualList
                        items={filtered}
                        itemHeight={52}
                        className="h-[70vh]"
                        keyOf={(i) => i.slug}
                        renderItem={(i) => (isCpu(i) ? <CpuRow c={i} /> : <GpuRow g={i as Gpu} />)}
                      />
                    </div>
                  )}

                  {/* pagination controls */}
                  {mode === 'pagination' && view !== 'list' && totalPages > 1 && (
                    <nav aria-label="Pagination" className="mt-5 flex items-center justify-center gap-1.5">
                      <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="btn-secondary !py-1.5 text-xs disabled:opacity-40">Prev</button>
                      {Array.from({ length: totalPages }).map((_, idx) => Math.abs(idx + 1 - safePage) <= 2 || idx === 0 || idx === totalPages - 1 ? (
                        <button key={idx} onClick={() => setPage(idx + 1)} aria-current={idx + 1 === safePage ? 'page' : undefined}
                          className={cn('min-w-[2rem] rounded-lg px-2 py-1 text-sm tabular-nums', idx + 1 === safePage ? 'bg-accent/20 font-bold text-accent' : 'text-ink-400 hover:bg-white/5')}>{idx + 1}</button>
                      ) : null)}
                      <button disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="btn-secondary !py-1.5 text-xs disabled:opacity-40">Next</button>
                    </nav>
                  )}

                  {/* infinite scroll sentinel + button fallback */}
                  {mode === 'infinite' && shown.length < filtered.length && view !== 'list' && (
                    <div ref={sentinelRef} className="mt-5 flex justify-center">
                      <button onClick={() => setVisible((v) => v + 36)} className="btn-secondary text-sm"><RefreshIcon size={14} /> Load more ({filtered.length - shown.length} remaining)</button>
                    </div>
                  )}
                </>
              );
            })()}
          {!loading && filtered.length > 0 && (
            <p className="mt-4 text-center text-xs text-ink-500">Showing {filtered.length} of {base.length} · avg price {fmtPrice(Math.round(filtered.reduce((s, i) => s + (i.price ?? 0), 0) / filtered.length))} · median perf {Math.round(applySort(filtered, cpu ? 'multi-desc' : 'raster-desc')[Math.floor(filtered.length / 2)].benchmarks[cpu ? 'multi' : 'raster'])}</p>
          )}
        </div>
      </div>
    </div>
  );
}
