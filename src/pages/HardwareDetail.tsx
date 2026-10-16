import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Cpu, Gpu } from '@/types/hardware';
import { getItem, isCpuItem, relatedItems, reviewsFor, priceHistory, gamesForGpu, gamesForCpu, allArticles, addReview } from '@/lib/db';
import { useAppStore } from '@/store/useAppStore';
import { cn, fmtPrice, perfPerDollarCpu, perfPerDollarGpu, effCpu, effGpu, cpuTier, gpuTier, toCSV, download, printSpecSheet, copyToClipboard } from '@/lib/utils';
import { Section, Badge, Tabs } from '@/components/ui';
import { EmptyState } from '@/components/Skeleton';
import { Rating } from '@/components/Rating';
import { BarsChart, PriceHistoryChart, PerfVsPowerScatterCpu, FpsAreaChart } from '@/components/charts';
import { useSeo } from '@/lib/seo';
import {
  CpuIcon, GpuIcon, ScaleIcon, HeartIcon, ShareIcon, DownloadIcon, PrinterIcon,
  CheckIcon, XIcon, ChevronRightIcon, NewspaperIcon, WrenchIcon, ArrowRightIcon, PlusIcon,
} from '@/components/icons';

type Item = Cpu | Gpu;
const perfOf = (x: Item) => (isCpuItem(x) ? x.benchmarks.multi : (x as Gpu).benchmarks.raster);
const cleanName = (n: string) => n.replace(/^(Intel|AMD|NVIDIA) /, '');

export default function HardwareDetail({ kind }: { kind: 'cpu' | 'gpu' }) {
  const { slug = '' } = useParams<{ slug: string }>();
  const key = `${kind}:${slug}`;
  const item = getItem(key);
  const [tab, setTab] = useState('overview');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQ, setPickerQ] = useState('');
  const toast = useAppStore((s) => s.toast);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const compareList = useAppStore((s) => s.compareList);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const [revTick, setRevTick] = useState(0);

  const similar = useMemo(() => (item ? relatedItems(slug).filter((x) => x.slug !== slug).slice(0, 7) : []), [item, slug]);
  const reviews = useMemo(() => (item ? reviewsFor(key) : []), [item, key, revTick]);

  useSeo({
    title: item ? `${item.name} — specs, benchmarks & price` : 'Not found',
    description: item ? `${item.name}: full specifications, benchmark charts, price history, pros & cons and head-to-head comparisons on DrDiscord2.` : undefined,
    jsonLd: item ? productJsonLd(item) : undefined,
    noindex: !item,
  });

  if (!item) {
    return (
      <div className="container py-24">
        <EmptyState
          title={`${kind.toUpperCase()} not found`}
          body={`No hardware matches "${slug}". It may have been renamed or removed.`}
          action={<Link to={kind === 'cpu' ? '/cpu' : '/gpu'} className="btn btn-primary">Browse {kind === 'cpu' ? 'CPUs' : 'GPUs'}</Link>}
        />
      </div>
    );
  }

  const cpu = isCpuItem(item) ? item : null;
  const gpu = cpu ? null : (item as Gpu);
  const perf = perfOf(item);
  const ppd = cpu ? perfPerDollarCpu(cpu) : perfPerDollarGpu(gpu!);
  const eff = cpu ? Math.round(effCpu(cpu) * 10) / 10 : Math.round(effGpu(gpu!) * 10) / 10;
  const tier = cpu ? cpuTier(cpu) : gpuTier(gpu!);
  const ph = priceHistory(item.releaseDate, item.launchPrice, item.price);
  const fpsGames = gpu ? gamesForGpu(slug) : gamesForCpu(slug);
  const inCompare = compareList.includes(key);
  const fav = favorites.includes(key);

  const share = async () => {
    const ok = await copyToClipboard(location.href);
    toast(ok ? 'Link copied to clipboard' : 'Copy failed — select URL manually', ok ? 'success' : 'error');
  };

  const exportCsv = () => {
    const rows: (string | number | null)[][] = [['Field', 'Value']];
    const push = (k: string, v: string | number | null | undefined) => rows.push([k, v ?? '—']);
    push('Name', item.name); push('Brand', item.brand); push('Category', item.category);
    push('Architecture', item.architecture); push('Release date', item.releaseDate);
    push('Launch MSRP USD', item.launchPrice); push('Street price USD', item.price);
    if (cpu) {
      push('Socket', cpu.socket); push('Cores', cpu.cores); push('Threads', cpu.threads);
      push('Base clock GHz', cpu.baseClock); push('Boost clock GHz', cpu.boostClock);
      push('L3 cache MB', cpu.cacheL3); push('TDP W', cpu.tdp); push('Process nm', cpu.processNode);
      push('iGPU', cpu.iGPU); push('Overclockable', cpu.overclockable ? 'Yes' : 'No');
      push('Bench single', cpu.benchmarks.single); push('Bench multi', cpu.benchmarks.multi);
      push('Bench productivity', cpu.benchmarks.productivity); push('Bench gaming', cpu.benchmarks.gaming);
    } else if (gpu) {
      push('Chip', gpu.chip); push('Shaders', gpu.shaders); push('VRAM GB', gpu.vram);
      push('Memory type', gpu.memoryType); push('Bus bit', gpu.memoryBus); push('Bandwidth GB/s', gpu.bandwidth);
      push('TDP W', gpu.tdp); push('Ray tracing', gpu.raytracing ? 'Yes' : 'No');
      push('DLSS', gpu.dlss ? 'Yes' : 'No'); push('FSR', gpu.fsr ? 'Yes' : 'No'); push('XeSS', gpu.xess ? 'Yes' : 'No');
      push('Bench raster', gpu.benchmarks.raster); push('Bench RT', gpu.benchmarks.rayTracing); push('Bench render', gpu.benchmarks.render);
    }
    download(`${kind}-${slug}-specs.csv`, toCSV(rows), 'text/csv');
    toast('Spec sheet CSV downloaded', 'success');
  };

  const exportPdf = () => {
    const sections: { heading: string; rows: [string, string][] }[] = [
      { heading: 'General', rows: [['Brand', item.brand], ['Category', `${item.category} · ${tier}`], ['Architecture', item.architecture], ['Released', item.releaseDate], ['MSRP', fmtPrice(item.launchPrice)], ['Street price', fmtPrice(item.price)]] },
      cpu
        ? { heading: 'CPU specs', rows: [['Socket', cpu.socket], ['Cores / threads', `${cpu.cores} / ${cpu.threads}`], ['Base / boost', `${cpu.baseClock} / ${cpu.boostClock} GHz`], ['L3 cache', `${cpu.cacheL3} MB`], ['TDP', `${cpu.tdp} W`], ['Process', `${cpu.processNode} nm`], ['iGPU', cpu.iGPU ?? 'None'], ['Memory', cpu.memoryTypes.join(', ')]] }
        : { heading: 'GPU specs', rows: [['Chip', gpu!.chip], ['Shaders', String(gpu!.shaders)], ['Clocks', `${gpu!.baseClock} / ${gpu!.boostClock} MHz`], ['VRAM', `${gpu!.vram} GB ${gpu!.memoryType}`], ['Bus / bandwidth', `${gpu!.memoryBus}-bit · ${gpu!.bandwidth} GB/s`], ['TDP', `${gpu!.tdp} W`], ['Form factor', gpu!.formFactor], ['Features', [gpu!.raytracing && 'RT', gpu!.dlss && 'DLSS', gpu!.fsr && 'FSR', gpu!.xess && 'XeSS'].filter(Boolean).join(', ') || '—']] },
      { heading: 'Benchmarks', rows: cpu
        ? [['Single-core', String(cpu.benchmarks.single)], ['Multi-core', String(cpu.benchmarks.multi)], ['Productivity', String(cpu.benchmarks.productivity)], ['Gaming', String(cpu.benchmarks.gaming)]]
        : [['Raster', String(gpu!.benchmarks.raster)], ['Ray tracing', String(gpu!.benchmarks.rayTracing)], ['Render', String(gpu!.benchmarks.render)]] },
    ];
    printSpecSheet(`${item.name} — specification sheet`, sections);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      {/* Hero */}
      <section className="border-b border-ink-700/40 bg-gradient-to-b from-ink-800/60 to-transparent">
        <div className="container py-8 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-ink-400">
            <Link to="/" className="hover:text-accent">Home</Link><ChevronRightIcon size={11} />
            <Link to={`/${kind}`} className="hover:text-accent">{kind === 'cpu' ? 'CPUs' : 'GPUs'}</Link><ChevronRightIcon size={11} />
            <span className="text-ink-200">{item.name}</span>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-xl bg-accent/10 p-2 text-accent">{cpu ? <CpuIcon size={22} /> : <GpuIcon size={22} />}</span>
                <Badge tone="cyan">{tier}</Badge>
                <Badge tone="slate">{item.category}</Badge>
                <Badge tone="violet">{item.architecture}</Badge>
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-50 md:text-4xl">{item.name}</h1>
              <p className="mt-1 text-sm text-ink-400">
                {cpu ? `${cpu.cores} cores / ${cpu.threads} threads · ${cpu.baseClock}–${cpu.boostClock} GHz · ${cpu.socket} · ${cpu.tdp} W TDP`
                  : `${gpu!.shaders.toLocaleString()} shaders · ${gpu!.vram} GB ${gpu!.memoryType} · ${gpu!.bandwidth} GB/s · ${gpu!.tdp} W`}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                <span className="text-ink-300">Perf index <b className="font-display text-accent">{Math.round(perf)}</b></span>
                {ppd != null && <span className="text-ink-300">Value <b className="font-display text-emerald-400">{ppd >= 1 ? ppd.toFixed(1) : ppd.toFixed(2)}</b> idx/$</span>}
                <span className="text-ink-300">Efficiency <b className="font-display text-orange-400">{eff}</b></span>
                <span className="font-display text-lg font-bold text-ink-50">{fmtPrice(item.price)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={cn('btn', inCompare ? 'btn-primary' : 'btn-ghost')} onClick={() => { toggleCompare(key); toast(inCompare ? 'Removed from comparison' : 'Added to comparison', 'info'); }}>
                <ScaleIcon size={15} /> {inCompare ? 'In compare ✓' : 'Compare'}
              </button>
              <button className={cn('btn', fav ? 'btn-primary' : 'btn-ghost')} aria-pressed={fav} onClick={() => toggleFavorite(key)}>
                <HeartIcon size={15} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Save'}
              </button>
              <button className="btn btn-ghost" onClick={share}><ShareIcon size={15} /> Share</button>
              <button className="btn btn-ghost" onClick={exportPdf}><PrinterIcon size={15} /> PDF</button>
              <button className="btn btn-ghost" onClick={exportCsv}><DownloadIcon size={15} /> CSV</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'specs', label: 'Specifications' },
            { id: 'benchmarks', label: 'Benchmarks' },
            { id: 'price', label: 'Price & Power' },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
          ]}
        />

        {tab === 'overview' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Section title="Performance vs similar hardware" sub="Overall index compared with the closest rivals by era and class.">
                <BarsChart height={280} xKey="name" bars={[{ key: 'perf', label: cpu ? 'Multi-core index' : 'Raster index' }]}
                  data={[item, ...similar].map((x) => ({ name: cleanName(x.name), perf: Math.round(perfOf(x)) }))} />
              </Section>
              <Section title="Quick verdict"><VerdictText item={item} similar={similar} /></Section>
              <div className="glass rounded-xl p-5">
                <h3 className="mb-3 font-display font-bold text-ink-50">Pros &amp; cons</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ul className="space-y-1.5 text-sm">{item.pros.map((p) => <li key={p} className="flex gap-2"><CheckIcon size={15} className="mt-0.5 shrink-0 text-emerald-400" /><span className="text-ink-200">{p}</span></li>)}</ul>
                  <ul className="space-y-1.5 text-sm">{item.cons.map((p) => <li key={p} className="flex gap-2"><XIcon size={15} className="mt-0.5 shrink-0 text-red-400" /><span className="text-ink-200">{p}</span></li>)}</ul>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass glow-on-hover rounded-xl p-5">
                <h3 className="mb-3 font-display font-bold text-ink-50">Actions</h3>
                <div className="space-y-2">
                  <button className={cn('btn w-full justify-center', inCompare ? 'btn-primary' : 'btn-primary')} onClick={() => { if (!inCompare) toggleCompare(key); window.location.hash = '#/compare'; }}>
                    <ScaleIcon size={15} /> Open comparison tool
                  </button>
                  <button className="btn btn-ghost w-full justify-center" onClick={() => setPickerOpen(true)}><PlusIcon size={15} /> Pick a rival to compare</button>
                  <Link to={`/builder?${kind}=${slug}`} className="btn btn-ghost w-full justify-center"><WrenchIcon size={15} /> Build a PC with this {kind.toUpperCase()}</Link>
                </div>
              </div>
              <div className="glass rounded-xl p-5">
                <h3 className="mb-2 font-display font-bold text-ink-50">Key numbers</h3>
                <dl className="space-y-2 text-sm">
                  <Row k="Perf index" v={String(Math.round(perf))} />
                  <Row k="Tier" v={tier} />
                  {cpu && <Row k="Single / multi" v={`${cpu.benchmarks.single} / ${cpu.benchmarks.multi}`} />}
                  {gpu && <Row k="Raster / RT" v={`${gpu.benchmarks.raster} / ${gpu.benchmarks.rayTracing}`} />}
                  <Row k="Watts" v={`${item.tdp} W`} />
                  <Row k="Perf per watt" v={String(eff)} />
                  <Row k="Street price" v={fmtPrice(item.price)} />
                </dl>
              </div>
              <div className="glass rounded-xl p-5">
                <h3 className="mb-2 font-display font-bold text-ink-50">Similar parts</h3>
                <ul className="space-y-1">
                  {similar.slice(0, 5).map((x) => (
                    <li key={x.slug}>
                      <Link to={`/${x.type}/${x.slug}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-ink-700/40">
                        <span className="truncate text-ink-200">{x.name}</span>
                        <span className="ml-2 tabular-nums text-accent">{Math.round(perfOf(x))}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === 'specs' && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SpecCard title="Core" rows={cpu
              ? [['Architecture', cpu.architecture], ['Process node', `${cpu.processNode} nm`], ['Cores / threads', `${cpu.cores} / ${cpu.threads}`], ['Base clock', `${cpu.baseClock} GHz`], ['Boost clock', `${cpu.boostClock} GHz`], ['L3 cache', `${cpu.cacheL3} MB`], ['Unlocked multiplier', cpu.unlocked ? 'Yes' : 'No'], ['Overclocking', cpu.overclockable ? 'Supported' : 'Limited']]
              : [['Chip', gpu!.chip], ['Architecture', gpu!.architecture], ['Shaders', gpu!.shaders.toLocaleString()], ['Base clock', `${gpu!.baseClock} MHz`], ['Boost clock', `${gpu!.boostClock} MHz`], ['Interface', 'PCIe'], ['Form factor', gpu!.formFactor]]} />
            <SpecCard title="Platform & memory" rows={cpu
              ? [['Socket', cpu.socket], ['Memory support', cpu.memoryTypes.join(', ')], ['Integrated graphics', cpu.iGPU ?? 'None'], ['TDP', `${cpu.tdp} W`], ['Category', cpu.category]]
              : [['VRAM', `${gpu!.vram} GB`], ['Memory type', gpu!.memoryType], ['Bus width', `${gpu!.memoryBus}-bit`], ['Bandwidth', `${gpu!.bandwidth} GB/s`], ['Outputs', gpu!.outputs.join(', ')], ['Power connectors', gpu!.connectors.join(', ')]]} />
            <SpecCard title="Features" rows={cpu
              ? [['Virtualization', cpu.brand === 'AMD' ? 'AMD-V' : 'VT-x'], ['AVX support', cpu.processNode <= 7 ? 'AVX2 / AVX-512' : 'SSE4 / AVX'], ['ECC', cpu.category === 'server' ? 'Yes' : 'Chipset dependent'], ['Segment', cpu.category]]
              : [['Ray tracing', gpu!.raytracing ? 'Hardware RT units' : 'No'], ['DLSS', gpu!.dlss ? 'Yes' : 'No'], ['FSR', gpu!.fsr ? 'Yes (open)' : 'No'], ['XeSS', gpu!.xess ? 'Yes' : 'No'], ['Frame generation', gpu!.frameGen ? 'Yes' : 'No']]} />
            <SpecCard title="Market" rows={[['Launch date', item.releaseDate], ['Launch MSRP', fmtPrice(item.launchPrice)], ['Current street price', fmtPrice(item.price)], ['Value index', ppd != null ? ppd.toFixed(2) : 'n/a'], ['Efficiency index', String(eff)]]} />
          </div>
        )}

        {tab === 'benchmarks' && (
          <div className="mt-6 space-y-6">
            {cpu && (
              <>
                <Section title="Single vs multi-core" sub="Relative scores — modern flagship ≈ 700 single / 3000+ multi.">
                  <BarsChart height={280} xKey="name" bars={[{ key: 'single', label: 'Single-core', color: '#22d3ee' }, { key: 'multi', label: 'Multi-core', color: '#fb923c' }]}
                    data={[cpu, ...(similar as Cpu[])].map((x) => ({ name: cleanName(x.name), single: x.benchmarks.single, multi: x.benchmarks.multi }))} />
                </Section>
                <Section title="Workload profile" sub="Productivity vs gaming indices for you and peers.">
                  <BarsChart height={260} xKey="name" bars={[{ key: 'prod', label: 'Productivity', color: '#a78bfa' }, { key: 'game', label: 'Gaming', color: '#34d399' }]}
                    data={[cpu, ...(similar as Cpu[])].map((x) => ({ name: cleanName(x.name), prod: x.benchmarks.productivity, game: x.benchmarks.gaming }))} />
                </Section>
              </>
            )}
            {gpu && (
              <>
                <Section title="Raster vs ray tracing vs render" sub="Aggregate GPU indices across test suites.">
                  <BarsChart height={280} xKey="name" bars={[{ key: 'raster', label: 'Raster', color: '#22d3ee' }, { key: 'rt', label: 'Ray tracing', color: '#a78bfa' }, { key: 'render', label: 'Render', color: '#fb923c' }]}
                    data={[gpu, ...(similar as Gpu[])].map((x) => ({ name: cleanName(x.name), raster: x.benchmarks.raster, rt: x.benchmarks.rayTracing, render: x.benchmarks.render }))} />
                </Section>
                <Section title="Game FPS estimates" sub="Average frames at Ultra settings — 1080p / 1440p / 4K.">
                  <FpsAreaChart data={fpsGames.map((g) => ({ game: g.game.replace(/\s*\(.*\)$/, ''), fps1080: g.fps1080, fps1440: g.fps1440, fps4k: g.fps4k }))} />
                </Section>
              </>
            )}
            <Section title="Can it run these games?" sub="Estimated playability based on our FPS model.">
              <GameCompatList games={fpsGames} />
            </Section>
          </div>
        )}

        {tab === 'price' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Section title="Price history" sub="Modeled street-price trajectory since launch.">
              {ph.length > 1 ? <PriceHistoryChart series={ph} /> : <EmptyState title="No price data" body="This part has no tracked pricing." />}
            </Section>
            <Section title="Power consumption vs performance" sub="Each dot is a part in this class — top-left is best.">
              {cpu ? <PerfVsPowerScatterCpu cpus={[cpu, ...(similar as Cpu[])]} highlightSlug={cpu.slug} />
                : <BarsChart height={260} xKey="name" bars={[{ key: 'eff', label: 'FPS-index per watt ×10', color: '#34d399' }]}
                    data={[gpu!, ...(similar as Gpu[])].map((x) => ({ name: cleanName(x.name), eff: Math.round(effGpu(x) * 10) }))} />}
            </Section>
            <div className="glass rounded-xl p-5 lg:col-span-2">
              <h3 className="mb-2 font-display font-bold text-ink-50">Thermal estimate</h3>
              <p className="text-sm leading-relaxed text-ink-300">
                At stock clocks the {item.name} dissipates about <b>{item.tdp} W</b>. With a quality {item.tdp <= 105 ? 'tower air cooler (~150 W rating)' : item.tdp <= 200 ? 'dual-tower air cooler or 240 mm AIO' : '360 mm AIO'}, expect load temperatures around{' '}
                <b>{Math.round(48 + item.tdp * 0.11)} °C</b> in a 22 °C room with good case airflow, and roughly {Math.round(56 + item.tdp * 0.13)} °C in a compact case. Sustained boost degrades above {cpu ? '90–95 °C (Tjmax)' : '83–88 °C hotspot limit'}.
              </p>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {reviews.length === 0 && <EmptyState title="No reviews yet" body="Be the first to share your experience with this hardware." />}
              {reviews.map((r) => (
                <div key={r.id} className="glass rounded-xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-ink-100">{r.user}</div>
                    <Rating value={r.rating} readOnly size={14} />
                  </div>
                  <div className="mt-0.5 text-xs text-ink-500">{r.date} · helpful 👍 {r.helpful}</div>
                  <div className="mt-2 text-sm font-semibold text-ink-50">{r.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-300">{r.body}</p>
                </div>
              ))}
            </div>
            <WriteReview kind={kind} slug={slug} onSave={() => { setRevTick((t) => t + 1); toast('Review saved locally — thank you!', 'success'); }} />
          </div>
        )}

        {/* Related articles */}
        <Section title="Related news & articles" className="mt-10"
          action={<Link to="/news" className="btn-ghost text-sm">All news <ArrowRightIcon size={14} /></Link>}>
          <div className="grid gap-3 md:grid-cols-3">
            {allArticles
              .filter((a) => a.tags.some((t) => item.name.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase() === item.brand.toLowerCase()) || a.title.toLowerCase().includes(item.architecture.toLowerCase()))
              .slice(0, 3)
              .map((a) => (
                <Link key={a.id} to={`/article/${a.slug}`} className="glass glow-on-hover rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs text-accent"><NewspaperIcon size={13} /> {a.category} · {a.readMinutes} min</div>
                  <div className="mt-2 font-display text-sm font-bold leading-snug text-ink-50">{a.title}</div>
                  <p className="mt-1 overflow-hidden text-xs text-ink-400" style={{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{a.excerpt}</p>
                </Link>
              ))}
          </div>
        </Section>
      </div>

      {/* Compare-with picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Choose comparison rival" onClick={() => setPickerOpen(false)}>
          <div className="glass-strong w-full max-w-lg rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-ink-50">Compare {item.name} with…</h3>
            <input autoFocus className="input mt-3" placeholder="Search other hardware…" value={pickerQ} onChange={(e) => setPickerQ(e.target.value)} aria-label="Search rival" />
            <ul className="mt-3 max-h-72 space-y-1 overflow-auto">
              {relatedItems(slug).filter((x, i, arr) => x.slug !== slug && arr.findIndex((y) => y.slug === x.slug) === i)
                .filter((x) => !pickerQ || x.name.toLowerCase().includes(pickerQ.toLowerCase())).slice(0, 14)
                .map((x) => (
                  <li key={x.slug}>
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-700/50"
                      onClick={() => {
                        if (!compareList.includes(key)) toggleCompare(key);
                        const xkey = `${x.type}:${x.slug}`;
                        if (!compareList.includes(xkey)) toggleCompare(xkey);
                        setPickerOpen(false); toast('Both parts added to comparison', 'success');
                      }}>
                      <span className="truncate text-ink-100">{x.name}</span>
                      <span className="chip ml-2 shrink-0">{Math.round(perfOf(x))}</span>
                    </button>
                  </li>
                ))}
            </ul>
            <div className="mt-4 flex justify-end"><Link to="/compare" onClick={() => setPickerOpen(false)} className="btn btn-primary">Open comparison tool</Link></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-2"><dt className="text-ink-400">{k}</dt><dd className="font-semibold tabular-nums text-ink-100">{v}</dd></div>;
}

function SpecCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="border-b border-ink-700/50 bg-ink-800/50 px-4 py-2.5 font-display text-sm font-bold text-ink-100">{title}</div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-ink-700/30 last:border-0">
              <td className="w-1/2 px-4 py-2 text-ink-400">{k}</td>
              <td className="px-4 py-2 font-medium text-ink-100">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GameCompatList({ games }: { games: { game: string; fps1080: number; fps1440: number; fps4k: number }[] }) {
  if (games.length === 0) return <EmptyState title="No game data" body="Benchmark coverage for this part is still being compiled." />;
  return (
    <div className="glass overflow-x-auto rounded-xl">
      <table className="w-full min-w-[560px] text-sm">
        <thead><tr className="border-b border-ink-700/50 text-left text-xs uppercase tracking-wide text-ink-400">
          <th className="px-4 py-2.5">Game</th><th className="px-4 py-2.5">1080p Ultra</th><th className="px-4 py-2.5">1440p Ultra</th><th className="px-4 py-2.5">4K Ultra</th><th className="px-4 py-2.5">Verdict</th>
        </tr></thead>
        <tbody>
          {games.slice(0, 12).map((g) => {
            const verdict: [string, string] = g.fps1080 >= 90 ? ['Playable · high refresh', 'green'] : g.fps1080 >= 55 ? ['Playable · smooth', 'cyan'] : g.fps1080 >= 30 ? ['Borderline', 'orange'] : ['Not recommended', 'red'];
            return (
              <tr key={g.game} className="border-b border-ink-700/30 last:border-0">
                <td className="px-4 py-2 font-medium text-ink-100">{g.game}</td>
                <td className="px-4 py-2 tabular-nums">{g.fps1080} FPS</td>
                <td className="px-4 py-2 tabular-nums">{g.fps1440} FPS</td>
                <td className="px-4 py-2 tabular-nums">{g.fps4k} FPS</td>
                <td className="px-4 py-2"><Badge tone={verdict[1] as 'green' | 'cyan' | 'orange' | 'red'}>{verdict[0]}</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function WriteReview({ kind, slug, onSave }: { kind: 'cpu' | 'gpu'; slug: string; onSave: () => void }) {
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(0);
  const [err, setErr] = useState('');
  const submit = () => {
    if (user.trim().length < 2 || title.trim().length < 3 || body.trim().length < 10 || rating < 1) { setErr('Fill every field (review ≥ 10 chars, rating required).'); return; }
    addReview(`${kind}:${slug}`, { target: slug, user: user.trim(), rating, date: new Date().toISOString().slice(0, 10), title: title.trim(), body: body.trim(), helpful: 0 });
    setUser(''); setTitle(''); setBody(''); setRating(0); setErr(''); onSave();
  };
  return (
    <div className="glass h-fit rounded-xl p-5">
      <h3 className="mb-3 font-display font-bold text-ink-50">Write a review</h3>
      <label className="mb-2 block text-xs uppercase tracking-wide text-ink-400">Your nickname<input className="input mt-1" value={user} onChange={(e) => setUser(e.target.value)} maxLength={30} /></label>
      <div className="mb-2 text-xs uppercase tracking-wide text-ink-400">Rating</div>
      <Rating value={rating} onChange={setRating} />
      <label className="mb-2 mt-3 block text-xs uppercase tracking-wide text-ink-400">Title<input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} /></label>
      <label className="block text-xs uppercase tracking-wide text-ink-400">Review<textarea className="input mt-1 min-h-[90px]" value={body} onChange={(e) => setBody(e.target.value)} maxLength={600} /></label>
      {err && <p role="alert" className="mt-2 text-xs text-red-400">{err}</p>}
      <button className="btn btn-primary mt-3 w-full justify-center" onClick={submit}>Submit review</button>
      <p className="mt-2 text-[11px] text-ink-500">Stored locally in your browser only.</p>
    </div>
  );
}

function VerdictText({ item, similar }: { item: Item; similar: Item[] }) {
  const cpu = isCpuItem(item) ? item : null;
  const perf = perfOf(item);
  const faster = similar.filter((x) => perfOf(x) > perf);
  const cheaper = similar.filter((x) => x.price != null && item.price != null && x.price < item.price);
  const bestCheap = [...cheaper].sort((a, b) => ((a.price ?? 1) / perfOf(a)) - ((b.price ?? 1) / perfOf(b)))[0];
  return (
    <p className="text-sm leading-relaxed text-ink-200">
      The <b>{item.name}</b> lands in the <b>{cpu ? cpuTier(cpu) : gpuTier(item as Gpu)}</b> tier with a performance index of <b>{Math.round(perf)}</b>.{' '}
      {faster.length > 0
        ? <>It trails {faster.length} close rival{faster.length > 1 ? 's' : ''} — led by <b>{faster[faster.length - 1]?.name}</b>.</>
        : <>Nothing in its immediate class beats it on raw throughput.</>}{' '}
      {item.price != null
        ? <>At <b>{fmtPrice(item.price)}</b>{' '}{bestCheap ? <>consider <b>{bestCheap.name}</b> if budget matters more than the last few percent of speed</> : <>it prices competitively for what it delivers</>}{'. '}</>
        : <>No current street price is tracked — value depends on the used market. </>}
      Its {item.tdp} W envelope makes it {item.tdp <= 65 ? 'an easy fit for quiet, efficient systems' : item.tdp <= 150 ? 'a good match for mid-range coolers and 650–750 W PSUs' : 'best paired with robust cooling and a high-wattage PSU'}.
    </p>
  );
}

function productJsonLd(item: Item): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    brand: { '@type': 'Brand', name: item.brand },
    category: item.category,
    description: `${item.name} specifications and benchmarks.`,
    offers: item.price != null ? { '@type': 'Offer', price: item.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } : undefined,
  };
}
