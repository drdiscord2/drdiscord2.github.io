import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { allCpus, allGpus, allNews, allComparisons, allTestimonials, getCpu, getGpu, useAsyncData } from '@/lib/db';
import { SearchBar } from '@/components/SearchBar';
import { CpuCard, GpuCard } from '@/components/HardwareCard';
import { Section, Badge, StatCard } from '@/components/ui';
import { GridSkeleton } from '@/components/Skeleton';
import { BarsChart } from '@/components/charts';
import { useSeo } from '@/lib/seo';
import { useAppStore } from '@/store/useAppStore';
import { perfPerDollarCpu, perfPerDollarGpu, effCpu, effGpu, fmtPrice, cn } from '@/lib/utils';
import { ArrowRightIcon, CpuIcon, GpuIcon, StarIcon, NewspaperIcon, ChevronRightIcon } from '@/components/icons';
import type { Cpu, Gpu } from '@/types/hardware';

function Counter({ to, label }: { to: number; label: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let started = false;
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting && !started) {
        started = true;
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / 900);
          setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <div ref={ref}><StatCard label={label} value={v.toLocaleString()} /></div>;
}

const CATS = [
  { to: '/cpu?category=desktop', icon: CpuIcon, title: 'Desktop CPUs', n: () => allCpus.filter((c) => c.category === 'desktop').length, d: 'LGA 1700 · AM5 · AM4 flagship silicon' },
  { to: '/cpu?category=server', icon: CpuIcon, title: 'Server CPUs', n: () => allCpus.filter((c) => c.category === 'server').length, d: 'Xeon W-3400 & EPYC Genoa/Turin' },
  { to: '/cpu?category=mobile', icon: CpuIcon, title: 'Mobile CPUs', n: () => allCpus.filter((c) => c.category === 'mobile').length, d: 'Core Ultra & Ryzen AI laptop chips' },
  { to: '/gpu?category=desktop', icon: GpuIcon, title: 'Desktop GPUs', n: () => allGpus.filter((g) => g.category === 'desktop').length, d: 'GeForce RTX · Radeon RX · Arc' },
  { to: '/gpu?category=laptop', icon: GpuIcon, title: 'Laptop GPUs', n: () => allGpus.filter((g) => g.category === 'laptop').length, d: 'RTX 40-series mobile & more' },
  { to: '/gpu?category=workstation', icon: GpuIcon, title: 'Workstation GPUs', n: () => allGpus.filter((g) => g.category === 'workstation').length, d: 'RTX Ada, Quadro & Radeon Pro' }
];

export default function Home() {
  useSeo({ title: 'PC Hardware Database, Benchmarks & PC Builder', description: 'Compare 150+ CPUs and 100+ GPUs, check benchmarks and prices, build a compatible PC and read hardware guides — free and offline-capable.' });
  const { loading } = useAsyncData(() => true, []);
  const cpus = useMemo(() => [...allCpus], []);
  const gpus = useMemo(() => [...allGpus], []);

  const latestCpus = useMemo(() => [...cpus].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 6), [cpus]);
  const latestGpus = useMemo(() => [...gpus].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 6), [gpus]);

  const boards = useMemo(() => ({
    performance: { rows: [...cpus].filter((c) => c.category === 'desktop').sort((a, b) => b.benchmarks.multi - a.benchmarks.multi).slice(0, 10).map((c) => ({ name: c.name.replace('AMD ', '').replace('Intel Core ', ''), v: c.benchmarks.multi })), key: 'multi', unit: 'index' },
    value: { rows: [...cpus].filter((c) => c.price != null && c.category !== 'legacy').sort((a, b) => (perfPerDollarCpu(b) ?? 0) - (perfPerDollarCpu(a) ?? 0)).slice(0, 10).map((c) => ({ name: c.name.replace('AMD ', '').replace('Intel Core ', ''), v: +(perfPerDollarCpu(c) ?? 0).toFixed(1) })), key: 'ppd', unit: 'pts/$' },
    efficiency: { rows: [...cpus].filter((c) => c.category === 'desktop').sort((a, b) => effCpu(b) - effCpu(a)).slice(0, 10).map((c) => ({ name: c.name.replace('AMD ', '').replace('Intel Core ', ''), v: +effCpu(c).toFixed(1) })), key: 'eff', unit: 'pts/W' },
    budget: { rows: [...gpus].filter((g) => g.price != null && g.price <= 450 && g.category === 'desktop').sort((a, b) => (perfPerDollarGpu(b) ?? 0) - (perfPerDollarGpu(a) ?? 0)).slice(0, 10).map((g) => ({ name: g.name.replace('NVIDIA ', '').replace('ASUS ', ''), v: +(perfPerDollarGpu(g) ?? 0).toFixed(1) })), key: 'ppd', unit: 'idx/$' }
  }), [cpus, gpus]);

  const country = useAppStore((s) => s.country);
  const popularInCountry = useMemo(() => {
    // deterministic pseudo-personalization: pick different slices per country seed
    const seed = ['United States', 'Germany', 'India'].includes(country) ? 2 : 0;
    return [cpus[(17 + seed) % cpus.length], gpus[(11 + seed) % gpus.length], cpus[(44 + seed) % cpus.length], gpus[(38 + seed) % gpus.length]] as (Cpu | Gpu)[];
  }, [country, cpus, gpus]);

  const cmpPairs = useMemo(() => allComparisons.slice(0, 10), []);

  return (
    <div>
      {/* HERO */}
      <section className="relative -mx-4 -mt-6 overflow-hidden px-4 pb-14 pt-16 text-center sm:-mx-4 md:px-8">
        <div className="absolute inset-0 -z-10 animate-gradient bg-animated-gradient bg-animated opacity-90" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-hero-grid opacity-40" aria-hidden />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge tone="cyan" className="mb-4">{cpus.length + gpus.length} components · updated monthly</Badge>
          <h1 className="heading mx-auto max-w-3xl !text-4xl sm:!text-5xl md:!text-6xl">
            Every chip. <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">Every benchmark.</span> Zero paywalls.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-300">Specs, price history, gaming FPS and compatibility-aware tools for CPUs & GPUs — from Pentium 4 to RTX 4090.</p>
          <div className="mx-auto mt-8 max-w-xl"><SearchBar big /></div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link to="/compare" className="btn-primary">Start a comparison</Link>
            <Link to="/builder" className="btn-secondary">Build a PC</Link>
            <Link to="/benchmarks" className="btn-ghost">Browse benchmarks <ChevronRightIcon size={14} /></Link>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Counter to={cpus.length} label="CPUs indexed" />
        <Counter to={gpus.length} label="GPUs indexed" />
        <Counter to={Math.round(cpus.length * gpus.length / 4)} label="Possible comparisons" />
        <Counter to={allNews.length + 120} label="Articles & news" />
      </div>

      {/* POPULAR COMPARISONS CAROUSEL */}
      <Section title="Popular comparisons" sub="The head-to-heads everyone is searching this month" action={<Link className="link flex items-center gap-1 text-sm" to="/compare">Open tool <ArrowRightIcon size={13} /></Link>}>
        <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
          {cmpPairs.map((p) => {
            const a = p.type === 'cpu' ? getCpu(p.a) : getGpu(p.a);
            const b = p.type === 'cpu' ? getCpu(p.b) : getGpu(p.b);
            if (!a || !b) return null;
            return (
              <Link key={p.a + p.b} to={`/compare?items=${p.type}:${p.a},${p.type}:${p.b}`} className="glass glow-on-hover group w-64 shrink-0 snap-start rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <Badge tone={p.type === 'cpu' ? 'cyan' : 'violet'}>{p.type.toUpperCase()} HEAD-TO-HEAD</Badge>
                  <span>{p.searches.toLocaleString()} searches</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="truncate font-semibold text-ink-100">{a.name}</div>
                  <div className="text-center text-[11px] font-bold uppercase tracking-widest text-accent">vs</div>
                  <div className="truncate font-semibold text-ink-100">{b.name}</div>
                </div>
                <div className="mt-3 flex justify-between text-xs text-ink-400"><span>{fmtPrice(a.price)}</span><span className="group-hover:text-accent">Compare →</span><span>{fmtPrice(b.price)}</span></div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* WHAT'S NEW */}
      <Section title="What's new" sub="Latest hardware added to the database">
        {loading ? <GridSkeleton count={4} /> : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...latestCpus.slice(0, 3), ...latestGpus.slice(0, 3)].map((x) => ('cores' in x ? <CpuCard key={x.slug} c={x as Cpu} /> : <GpuCard key={x.slug} g={x as Gpu} />))}
          </div>
        )}
      </Section>

      {/* CATEGORIES */}
      <Section title="Browse by category">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map((c) => (
            <Link key={c.to} to={c.to} className="glass glow-on-hover group flex items-center gap-4 rounded-xl p-4">
              <span className="rounded-xl bg-accent/10 p-3 text-accent transition-transform group-hover:scale-110"><c.icon size={24} /></span>
              <span className="min-w-0">
                <span className="block font-display font-bold text-ink-50 group-hover:text-accent">{c.title}</span>
                <span className="block text-xs text-ink-400">{c.n()} models · {c.d}</span>
              </span>
              <ArrowRightIcon className="ml-auto shrink-0 text-ink-500 transition-transform group-hover:translate-x-1 group-hover:text-accent" size={18} />
            </Link>
          ))}
        </div>
      </Section>

      {/* LEADERBOARDS */}
      <Section title="Top 10 leaderboards" sub="Ranked across our entire database">
        <div className="grid gap-4 lg:grid-cols-2">
          {(Object.entries(boards) as [string, typeof boards.performance][]).map(([id, b]) => (
            <div key={id} className={cn('glass rounded-xl p-4')}>
              <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-ink-200">
                <StarIcon size={14} className="text-accent" /> {id} <span className="text-ink-500 normal-case">({b.unit})</span>
              </h3>
              <BarsChart height={230} xKey="name" data={b.rows.map((r) => ({ name: r.name, val: r.v }))} bars={[{ key: 'val', label: b.unit }]} />
            </div>
          ))}
        </div>
      </Section>

      {/* NEWS + COUNTRY */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Hardware news" action={<Link className="link text-sm" to="/news">All news</Link>}>
            <ul className="space-y-2">
              {allNews.slice(0, 6).map((n) => (
                <li key={n.id}>
                  <Link to="/news" className="glass table-row-hover flex items-start gap-3 rounded-lg p-3">
                    <span className="mt-0.5 rounded-md bg-accent/10 p-2 text-accent"><NewspaperIcon size={15} /></span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-100">{n.title}</span>
                      <span className="block truncate text-xs text-ink-400">{n.summary}</span>
                      <span className="mt-1 block text-[11px] text-ink-500">{n.date} · {n.source} · <Badge tone="slate" className="!normal-case">{n.tag}</Badge></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </div>
        <Section title="Popular in your country" sub="Personalized picks based on your region">
          <div className="space-y-3">
            {popularInCountry.map((x) => ('cores' in x ? <CpuCard key={x.slug} c={x as Cpu} /> : <GpuCard key={x.slug} g={x as Gpu} />))}
            <p className="text-xs text-ink-500">Change your region in header settings ⚙ to refresh these picks.</p>
          </div>
        </Section>
      </div>

      {/* TESTIMONIALS */}
      <Section title="What builders say">
        <div className="grid gap-3 md:grid-cols-3">
          {allTestimonials.map((t, i) => (
            <figure key={i} className="glass rounded-xl p-4">
              <div className="mb-2 flex gap-0.5 text-accent">{Array.from({ length: t.rating }).map((_, j) => <StarIcon key={j} size={14} fill="currentColor" />)}</div>
              <blockquote className="text-sm text-ink-200">“{t.text}”</blockquote>
              <figcaption className="mt-3 text-xs text-ink-400"><span className="font-semibold text-ink-100">{t.name}</span> · {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </div>
  );
}
