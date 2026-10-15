import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { allCpus as cpus, allGpus as gpus, allMotherboards as motherboards, allRam as ramKits, allStorage as storageDrives, allPsus as psus, allCases as cases, allCoolers as coolers, allGames as games, allArticles as articles } from '@/lib/db';
import { CpuIcon, GpuIcon, BookIcon, CheckIcon, NewspaperIcon, ShareIcon } from '@/components/icons';

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="font-display text-2xl font-bold text-accent tabular-nums">{n.toLocaleString()}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

export default function About() {
  useSeo({
    title: 'About — data sources, methodology & policies',
    description: 'How DrDiscord2 collects benchmark data, computes value ratings, and handles privacy. Contact information and terms of use.',
  });
  return (
    <div className="page">
      <header className="mb-10">
        <h1 className="section-title">About DrDiscord2</h1>
        <p className="mt-2 max-w-3xl text-muted">
          DrDiscord2 is a free, open PC-hardware reference built entirely in the browser — no backend, no accounts,
          no tracking. All data ships as static JSON inside the app, which is why it also works offline as a PWA.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5" aria-label="Database size">
        <Stat n={cpus.length} label="CPUs" />
        <Stat n={gpus.length} label="GPUs" />
        <Stat n={motherboards.length} label="Motherboards" />
        <Stat n={ramKits.length} label="RAM kits" />
        <Stat n={storageDrives.length} label="Storage" />
        <Stat n={psus.length} label="PSUs" />
        <Stat n={cases.length} label="Cases" />
        <Stat n={coolers.length} label="Coolers" />
        <Stat n={games.length} label="Games benchmarked" />
        <Stat n={articles.length} label="Articles" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><BookIcon className="h-5 w-5 text-accent" /> Data sources</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Manufacturer specification sheets (Intel ARK, AMD product pages, NVIDIA/AMD/Intel GPU specs).</li>
            <li>Aggregated public benchmark results (PassMark-style single/multi-thread indices, 3DMark-family scores, in-game FPS roundups).</li>
            <li>Retail street-price snapshots collected quarterly; historical series approximate market trends.</li>
            <li>All numbers are normalised to an internal index where <strong className="text-foreground">newer flagship silicon ≈ higher index</strong>; treat them as relative, not absolute.</li>
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><CpuIcon className="h-5 w-5 text-accent" /> Methodology</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li><strong>Performance index</strong>: weighted blend of single-thread (30%), multi-thread (40%) and productivity (30%) results; GPUs use raster + ray-tracing blend.</li>
            <li><strong>Value rating</strong>: performance index divided by current street price, expressed per $100.</li>
            <li><strong>Efficiency rating</strong>: performance index per watt of rated TDP.</li>
            <li><strong>Game FPS estimates</strong> interpolate between measured reference points per resolution and are ±10% typical.</li>
            <li><strong>Bottleneck score</strong> compares relative CPU and GPU headroom at the selected resolution.</li>
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><CheckIcon className="h-5 w-5 text-accent" /> Privacy policy</h2>
          <p className="mt-3 text-sm text-muted">
            We collect nothing. There are no cookies, no analytics, no fingerprinting and no server logs — the site is
            served as static files from GitHub Pages. Your theme choice, saved comparisons, filter presets and PC builds
            live only in your browser&apos;s <code className="chip">localStorage</code> and never leave your device.
            Clearing site data removes everything permanently.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><NewspaperIcon className="h-5 w-5 text-accent" /> Terms of use</h2>
          <p className="mt-3 text-sm text-muted">
            Content is provided for information only, without warranty. Prices and availability change; verify before
            purchasing. You may quote and share with attribution to DrDiscord2. Product names and trademarks belong to
            their respective owners; this project is independent and unaffiliated.
          </p>
        </section>
      </div>

      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><ShareIcon className="h-5 w-5 text-accent" /> Contact</h2>
        <p className="mt-3 text-sm text-muted">
          Found wrong data or want a chip added? Open an issue on{' '}
          <a className="link" href="https://github.com/drdiscord2/drdiscord2.github.io" target="_blank" rel="noreferrer">GitHub</a>.
          Corrections are welcome and usually shipped within days.
        </p>
        <p className="mt-3 text-sm text-muted">
          Start exploring: <Link className="link" to="/cpu">CPUs</Link>, <Link className="link" to="/gpu">GPUs</Link>,{' '}
          <Link className="link" to="/tools">tools</Link> or <Link className="link" to="/guides">guides</Link>.
        </p>
      </section>
    </div>
  );
}
