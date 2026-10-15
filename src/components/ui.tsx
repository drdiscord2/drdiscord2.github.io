import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn, fmtPrice } from '@/lib/utils';
import { ScaleIcon, HeartIcon } from '@/components/icons';
import { useAppStore } from '@/store/useAppStore';

export function Section({ title, sub, action, children, className }: {
  title: string; sub?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={cn('mb-12', className)}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink-50">{title}</h2>
          {sub && <p className="mt-1 text-sm text-ink-400">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

type Tone = 'cyan' | 'orange' | 'green' | 'red' | 'violet' | 'slate';
const toneMap: Record<Tone, string> = {
  cyan: 'bg-accent/15 text-accent-soft border-accent/30',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  slate: 'bg-ink-700/40 text-ink-300 border-ink-600/50'
};

export function Badge({ children, tone = 'cyan', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={cn('chip', toneMap[tone], className)}>{children}</span>;
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="glass glow-on-hover rounded-xl p-4 text-center">
      <div className="font-display text-2xl md:text-3xl font-bold text-accent tabular-nums">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-ink-400">{label}</div>
      {hint && <div className="mt-1 text-[11px] text-ink-500">{hint}</div>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: ReactNode }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div role="tablist" className="inline-flex flex-wrap gap-1 rounded-lg bg-ink-800/60 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
            active === t.id ? 'bg-accent/20 text-accent-soft shadow-inner' : 'text-ink-400 hover:text-ink-100'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  return (
    <div className="divide-y divide-ink-700/50 rounded-xl border border-ink-700/50 bg-ink-800/40">
      {items.map((it, i) => (
        <details key={i} className="group px-4 py-3" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink-100 [&::-webkit-details-marker]:hidden">
            {it.title}
            <span className="text-lg leading-none text-accent transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="mt-2 text-sm leading-relaxed text-ink-300">{it.content}</div>
        </details>
      ))}
    </div>
  );
}

export function Select({ label, value, onChange, options, allLabel, className }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; allLabel?: string; className?: string;
}) {
  return (
    <label className={cn('block text-left', className)}>
      {label && <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">{label}</span>}
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {allLabel !== undefined && <option value="">{allLabel}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export function RangeInput({ label, min, max, step = 1, value, onChange, format }: {
  label: string; min: number; max: number; step?: number; value: [number, number];
  onChange: (v: [number, number]) => void; format?: (n: number) => string;
}) {
  const f = format ?? ((n: number) => String(n));
  return (
    <div className="text-left">
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium uppercase tracking-wide text-ink-400">{label}</span>
        <span className="tabular-nums text-accent">{f(value[0])} – {f(value[1])}</span>
      </div>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={value[0]} aria-label={`${label} minimum`}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])} className="w-full accent-cyan-400" />
        <input type="range" min={min} max={max} step={step} value={value[1]} aria-label={`${label} maximum`}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])} className="w-full accent-cyan-400" />
      </div>
    </div>
  );
}

/** Shared compare/favorite buttons used on cards & detail pages */
export function CardActions({ itemKey, name, toCompare }: { itemKey: string; name: string; toCompare: string }) {
  const compareList = useAppStore((s) => s.compareList);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const inCompare = compareList.includes(itemKey);
  const fav = favorites.includes(itemKey);
  return (
    <div className="flex gap-1.5">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(itemKey); }}
        aria-pressed={inCompare}
        aria-label={inCompare ? `Remove ${name} from comparison` : `Add ${name} to comparison`}
        title="Add to comparison"
        className={cn('btn-ghost !px-2 !py-1', inCompare && '!text-accent ring-1 ring-accent/50')}
      >
        <ScaleIcon size={15} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(itemKey); }}
        aria-pressed={fav}
        aria-label={fav ? `Unfavorite ${name}` : `Favorite ${name}`}
        className={cn('btn-ghost !px-2 !py-1', fav && '!text-rose-400')}
      >
        <HeartIcon size={15} fill={fav ? 'currentColor' : 'none'} />
      </button>
      <Link to={toCompare} onClick={(e) => e.stopPropagation()} aria-label={`Compare ${name}`} className="btn-ghost !px-2 !py-1">
        <span className="text-xs font-bold">VS</span>
      </Link>
    </div>
  );
}

export function PriceTag({ price, launch }: { price: number | null; launch?: number | null }) {
  const drop = price != null && launch != null && launch > price ? Math.round(((launch - price) / launch) * 100) : 0;
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-display font-bold text-ink-50 tabular-nums">{fmtPrice(price)}</span>
      {drop > 0 && <Badge tone="green" className="!text-[10px]">-{drop}%</Badge>}
    </span>
  );
}
