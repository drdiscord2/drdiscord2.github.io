import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import { allGames, allGpus, getGpu } from '@/lib/db';
import { estimateFps, cn } from '@/lib/utils';
import { EmptyState } from '@/components/Skeleton';
import { FpsAreaChart } from '@/components/charts';
import { GamepadIcon, SearchIcon, ArrowRightIcon } from '@/components/icons';
import type { Game } from '@/types/hardware';

const HEAVINESS: Record<string, number> = { RPG: 0.55, Shooter: 0.7, Esports: 1.6, Strategy: 0.8, Racing: 0.9, Adventure: 0.6, Action: 0.75, Horror: 0.65, MOBA: 1.5, Fighter: 1.3, Sandbox: 0.7, Platformer: 1.4, Metroidvania: 1.2, Puzzle: 1.5, Simulation: 0.85, MMORPG: 0.6, Survival: 0.7 };

export default function Games() {
  useSeo({
    title: 'Game Benchmarks — FPS database',
    description: `${allGames.length} popular games with system requirements and estimated FPS across GPUs at 1080p, 1440p and 4K.`,
  });
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('All');
  const [selected, setSelected] = useState<Game | null>(null);
  const [gpuSlugs, setGpuSlugs] = useState<string[]>(['rtx-4070-super', 'rx-7800-xt', 'rtx-4060']);

  const genres = useMemo(() => ['All', ...Array.from(new Set(allGames.map((g) => g.genre))).sort()], []);
  const filtered = useMemo(
    () => allGames.filter((g) => (genre === 'All' || g.genre === genre) && g.name.toLowerCase().includes(q.toLowerCase())),
    [q, genre],
  );

  const gpuOptions = useMemo(
    () => allGpus.filter((g) => g.category === 'desktop' && g.price != null && g.benchmarks.raster >= 400).slice(0, 24),
    [],
  );

  const fpsFor = (slug: string, game: Game, res: '1080p' | '1440p' | '4K'): number => {
    const gpu = getGpu(slug);
    if (!gpu) return 0;
    // measured data on the GPU side (gaming array) takes priority
    const measured = gpu.gaming?.find((x) => x.game.toLowerCase() === game.name.toLowerCase());
    if (measured) return res === '1080p' ? measured.fps1080 : res === '1440p' ? measured.fps1440 : measured.fps4k;
    const weight = HEAVINESS[game.genre] ?? 0.8;
    return Math.round(estimateFps(gpu, res, 'high') * weight);
  };

  const chartData = selected
    ? [{
        game: selected.name,
        fps1080: Math.max(...gpuSlugs.map((s) => fpsFor(s, selected, '1080p')), 0),
        fps1440: Math.max(...gpuSlugs.map((s) => fpsFor(s, selected, '1440p')), 0),
        fps4k: Math.max(...gpuSlugs.map((s) => fpsFor(s, selected, '4K')), 0),
      }]
    : [];

  return (
    <div className="page">
      <header className="mb-6">
        <h1 className="section-title flex items-center gap-2"><GamepadIcon size={26} className="text-accent" /> Game benchmarks</h1>
        <p className="mt-2 text-sm text-muted">{allGames.length} games with system requirements and per-GPU frame-rate estimates.</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="relative grow max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input className="input pl-9" placeholder="Search games…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search games" />
        </label>
        <select className="input w-auto" value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Genre filter">
          {genres.map((gn) => <option key={gn}>{gn}</option>)}
        </select>
        <span className="text-sm text-muted">{filtered.length} games</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="max-h-[70vh] space-y-2 overflow-auto pr-1" aria-label="Game list">
          {filtered.length === 0 && <EmptyState title="No games found" body="Try a different search term or genre." />}
          {filtered.map((g) => (
            <button key={g.id} onClick={() => setSelected(g)}
              className={cn('glass w-full rounded-xl p-3 text-left transition-colors hover:border-accent/40', selected?.id === g.id && 'border-accent/60')}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{g.name}</span>
                <span className="chip">{g.year}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                <span>{g.genre}</span><span>·</span><span>{g.optimized} optimisation</span>
                {g.upscaling.length > 0 && <span className="chip !py-0.5 text-[10px]">{g.upscaling[0]}</span>}
              </div>
            </button>
          ))}
        </div>

        <div>
          {!selected ? (
            <div className="glass flex min-h-[300px] items-center justify-center rounded-2xl p-8">
              <EmptyState title="Pick a game" body="Select a game on the left to see FPS by GPU and its system requirements." />
            </div>
          ) : (
            <div className="glass rounded-2xl p-5">
              <h2 className="font-display text-xl font-semibold">{selected.name}</h2>
              <p className="mt-1 text-sm text-muted">{selected.year} · {selected.genre} · optimisation: {selected.optimized} · upscaling: {selected.upscaling.join(', ') || 'none'}</p>

              <h3 className="mt-5 mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Estimated average FPS (High preset)</h3>
              <ul className="space-y-3" aria-label={`FPS in ${selected.name}`}>
                {gpuSlugs.map((slug) => {
                  const gpu = getGpu(slug);
                  if (!gpu) return null;
                  const rows = [fpsFor(slug, selected, '1080p'), fpsFor(slug, selected, '1440p'), fpsFor(slug, selected, '4K')];
                  const best = Math.max(...rows, 1);
                  return (
                    <li key={slug}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <Link to={`/gpu/${slug}`} className="link font-medium">{gpu.name}</Link>
                        <span className="tabular-nums text-muted">{rows[0]} / {rows[1]} / {rows[2]} fps</span>
                      </div>
                      {(['1080p', '1440p', '4K'] as const).map((r, i) => (
                        <div key={r} className="mb-1 flex items-center gap-2 text-xs">
                          <span className="w-12 text-muted">{r}</span>
                          <div className="h-1.5 grow rounded bg-white/5">
                            <div className={cn('h-1.5 rounded', rows[i] >= 60 ? 'bg-emerald-400' : rows[i] >= 30 ? 'bg-amber-400' : 'bg-rose-400')} style={{ width: `${Math.min(100, (rows[i] / best) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2" aria-label="Choose GPUs to compare">
                {gpuOptions.map((g) => {
                  const on = gpuSlugs.includes(g.slug);
                  return (
                    <button key={g.slug} aria-pressed={on}
                      onClick={() => setGpuSlugs((cur) => on ? cur.filter((s) => s !== g.slug) : [...cur, g.slug].slice(-5))}
                      className={cn('chip', on && '!border-accent/60 !text-accent')}>
                      {g.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">{chartData.length > 0 && <FpsAreaChart data={chartData} />}</div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 p-4">
                  <h4 className="text-sm font-semibold text-accent">Minimum requirements</h4>
                  <dl className="mt-2 space-y-1 text-sm text-muted">
                    <div>CPU: {selected.minCpu}</div>
                    <div>GPU: {selected.minGpu}</div>
                    <div>RAM: {selected.ramGB} GB</div>
                    <div>Storage: {selected.storageGB} GB</div>
                  </dl>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <h4 className="text-sm font-semibold text-accent">Recommended</h4>
                  <dl className="mt-2 space-y-1 text-sm text-muted">
                    <div>CPU: {selected.recCpu}</div>
                    <div>GPU: {selected.recGpu}</div>
                    <div>RAM: {selected.ramGB} GB+</div>
                    <div>Storage: {selected.storageGB} GB SSD</div>
                  </dl>
                </div>
              </div>
              <Link to="/builder" className="btn btn-primary mt-5 inline-flex items-center gap-2">Build a PC for this game <ArrowRightIcon size={16} /></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
