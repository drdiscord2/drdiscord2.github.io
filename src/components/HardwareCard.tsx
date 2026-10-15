import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Cpu, Gpu } from '@/types/hardware';
import { cn, fmtPrice, perfPerDollarCpu, perfPerDollarGpu, cpuTier, gpuTier, brandColor } from '@/lib/utils';
import { Badge, CardActions, PriceTag } from '@/components/ui';
import { CpuIcon, GpuIcon, BoltIcon } from '@/components/icons';

function MiniStat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="rounded-lg bg-ink-800/60 px-2 py-1.5 text-center">
      <div className="text-[10px] uppercase tracking-wide text-ink-500">{k}</div>
      <div className="text-sm font-semibold tabular-nums text-ink-100">{v}</div>
    </div>
  );
}

export const CpuCard = memo(function CpuCard({ c }: { c: Cpu }) {
  const ppd = perfPerDollarCpu(c);
  return (
    <Link to={`/cpu/${c.slug}`} className="glass glow-on-hover group block rounded-xl p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('chip border', brandColor(c.brand))}>{c.brand}</span>
            <Badge tone="slate">{cpuTier(c)}</Badge>
          </div>
          <h3 className="mt-2 truncate font-display text-base font-bold text-ink-50 group-hover:text-accent">{c.name}</h3>
          <p className="truncate text-xs text-ink-400">{c.architecture} · {c.socket} · {c.processNode} nm</p>
        </div>
        <span className="rounded-lg bg-accent/10 p-2 text-accent"><CpuIcon size={20} /></span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <MiniStat k="Cores" v={`${c.cores}/${c.threads}`} />
        <MiniStat k="Boost" v={`${c.boostClock}G`} />
        <MiniStat k="Multi" v={c.benchmarks.multi} />
        <MiniStat k="TDP" v={`${c.tdp}W`} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <PriceTag price={c.price} launch={c.launchPrice} />
        <div className="flex items-center gap-2">
          {ppd != null && <span className="text-[11px] text-ink-500" title="Multi-core index per dollar">{ppd.toFixed(1)} pts/$</span>}
          <CardActions itemKey={`cpu:${c.slug}`} name={c.name} toCompare={`/compare?items=cpu:${c.slug}`} />
        </div>
      </div>
    </Link>
  );
});

export const GpuCard = memo(function GpuCard({ g }: { g: Gpu }) {
  const ppd = perfPerDollarGpu(g);
  return (
    <Link to={`/gpu/${g.slug}`} className="glass glow-on-hover group block rounded-xl p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('chip border', brandColor(g.brand))}>{g.brand}</span>
            <Badge tone="slate">{gpuTier(g)}</Badge>
            {g.raytracing && <Badge tone="violet">RT</Badge>}
          </div>
          <h3 className="mt-2 truncate font-display text-base font-bold text-ink-50 group-hover:text-accent">{g.name}</h3>
          <p className="truncate text-xs text-ink-400">{g.architecture} · {g.memoryBus}-bit · {g.formFactor}</p>
        </div>
        <span className="rounded-lg bg-accent/10 p-2 text-accent"><GpuIcon size={20} /></span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <MiniStat k="VRAM" v={`${g.vram}G`} />
        <MiniStat k="Type" v={g.memoryType.replace('GDDR', '')} />
        <MiniStat k="Raster" v={g.benchmarks.raster} />
        <MiniStat k="TDP" v={`${g.tdp}W`} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <PriceTag price={g.price} launch={g.launchPrice} />
        <div className="flex items-center gap-2">
          {ppd != null && <span className="flex items-center gap-1 text-[11px] text-ink-500" title="Render index per dollar"><BoltIcon size={11} />{ppd.toFixed(1)}/$</span>}
          <CardActions itemKey={`gpu:${g.slug}`} name={g.name} toCompare={`/compare?items=gpu:${g.slug}`} />
        </div>
      </div>
    </Link>
  );
});

/** Compact row used in list view */
export function CpuRow({ c }: { c: Cpu }) {
  return (
    <Link to={`/cpu/${c.slug}`} className="table-row-hover glass flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
      <span className="chip shrink-0 border" style={{ borderColor: 'transparent' }}>{c.brand}</span>
      <span className="w-52 min-w-0 truncate font-medium text-ink-100">{c.name}</span>
      <span className="hidden w-24 text-ink-400 md:block">{c.socket}</span>
      <span className="w-16 tabular-nums text-ink-300">{c.cores}/{c.threads}</span>
      <span className="w-16 tabular-nums text-ink-300">{c.boostClock} GHz</span>
      <span className="w-16 tabular-nums text-accent">{c.benchmarks.multi}</span>
      <span className="w-14 tabular-nums text-ink-400">{c.tdp} W</span>
      <span className="ml-auto tabular-nums font-semibold text-ink-100">{fmtPrice(c.price)}</span>
      <CardActions itemKey={`cpu:${c.slug}`} name={c.name} toCompare={`/compare?items=cpu:${c.slug}`} />
    </Link>
  );
}

export function GpuRow({ g }: { g: Gpu }) {
  return (
    <Link to={`/gpu/${g.slug}`} className="table-row-hover glass flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
      <span className="chip shrink-0 border" style={{ borderColor: 'transparent' }}>{g.brand}</span>
      <span className="w-52 min-w-0 truncate font-medium text-ink-100">{g.name}</span>
      <span className="hidden w-24 text-ink-400 md:block">{g.vram} GB {g.memoryType}</span>
      <span className="w-16 tabular-nums text-ink-300">{g.memoryBus}b</span>
      <span className="w-16 tabular-nums text-accent">{g.benchmarks.raster}</span>
      <span className="w-14 tabular-nums text-ink-400">{g.tdp} W</span>
      <span className="ml-auto tabular-nums font-semibold text-ink-100">{fmtPrice(g.price)}</span>
      <CardActions itemKey={`gpu:${g.slug}`} name={g.name} toCompare={`/compare?items=gpu:${g.slug}`} />
    </Link>
  );
}
