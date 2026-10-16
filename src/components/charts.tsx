import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import type { Cpu, Gpu } from '@/types/hardware';

export const ACCENT = '#22d3ee';
const GRID = 'rgba(148,163,184,0.15)';
const TICK = { fill: '#94a3b8', fontSize: 12 };

const tooltipStyle = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(34,211,238,0.35)',
  borderRadius: 10,
  color: '#e2e8f0',
  fontSize: 12
};

export function BarsChart({ data, xKey, bars, height = 260 }: {
  data: Record<string, string | number>[];
  xKey: string;
  bars: { key: string; label: string; color?: string }[];
  height?: number;
}) {
  return (
    <div style={{ height }} aria-label={`Bar chart: ${bars.map((b) => b.label).join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey={xKey} tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} interval={0} angle={-14} textAnchor="end" height={54} />
          <YAxis tick={TICK} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(34,211,238,0.06)' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color ?? ACCENT} radius={[4, 4, 0, 0]} maxBarSize={34} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerfVsPowerScatterCpu({ cpus, highlightSlug }: { cpus: Cpu[]; highlightSlug?: string }) {
  const data = cpus.map((c) => ({ x: c.tdp, y: c.benchmarks.multi, name: c.name, slug: c.slug }));
  return (
    <div style={{ height: 300 }} aria-label="Performance versus power scatter chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="x" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} name="W" />
          <YAxis tick={TICK} tickLine={false} axisLine={false} name="Multi index" />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number, _n: string, p) => [`${v} idx`, 'Multi']} labelFormatter={(_l, p) => (p?.[0]?.payload as { name: string })?.name ?? ''} />
          <Bar dataKey="y" name="Multi index" radius={[3, 3, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.slug} fill={d.slug === highlightSlug ? ACCENT : 'rgba(34,211,238,0.28)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriceHistoryChart({ series }: { series: { m: string; p: number }[] }) {
  return (
    <div style={{ height: 240 }} aria-label="Price history line chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="m" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={24} />
          <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} domain={['auto', 'auto']} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v}`, 'Street price']} />
          <Line type="monotone" dataKey="p" stroke="#fb923c" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: ACCENT }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FpsAreaChart({ data }: { data: { game: string; fps1080: number; fps1440: number; fps4k: number }[] }) {
  return (
    <div style={{ height: 280 }} aria-label="Average FPS by resolution area chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="g1080" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.5} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g1440" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g4k" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="game" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={16} />
          <YAxis tick={TICK} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="fps1080" name="1080p" stroke={ACCENT} fill="url(#g1080)" strokeWidth={2} />
          <Area type="monotone" dataKey="fps1440" name="1440p" stroke="#a78bfa" fill="url(#g1440)" strokeWidth={2} />
          <Area type="monotone" dataKey="fps4k" name="4K" stroke="#fb923c" fill="url(#g4k)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DualAxisTrend({ data, xKey, aKey, aLabel, bKey, bLabel }: {
  data: Record<string, string | number>[]; xKey: string; aKey: string; aLabel: string; bKey: string; bLabel: string;
}) {
  return (
    <div style={{ height: 280 }} aria-label={`${aLabel} vs ${bLabel} trend chart`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey={xKey} tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis yAxisId="left" tick={TICK} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={TICK} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line yAxisId="left" type="monotone" dataKey={aKey} name={aLabel} stroke={ACCENT} strokeWidth={2.5} dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey={bKey} name={bLabel} stroke="#fb923c" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
