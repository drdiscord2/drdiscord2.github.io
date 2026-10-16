import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Cpu, Gpu, Motherboard, RamKit, StorageDrive, Psu, CaseItem, CoolerItem } from '@/types/hardware';
import { allCpus, allGpus, allMotherboards, allRam, allStorage, allPsus, allCases, allCoolers, getCpu, getGpu, allGames } from '@/lib/db';
import { useAppStore, type SavedBuildParts } from '@/store/useAppStore';
import { cn, fmtPrice, estimateFps, cpuCap, type CompatIssue, download, toCSV, printSpecSheet, copyToClipboard } from '@/lib/utils';
import { Section, Badge } from '@/components/ui';
import { BarsChart } from '@/components/charts';
import { useSeo } from '@/lib/seo';
import {
  CpuIcon, GpuIcon, MemoryIcon, HardDriveIcon, PlugIcon, BoxIcon, FanIcon, TableIcon,
  CheckIcon, AlertIcon, InfoIcon, DownloadIcon, PrinterIcon, ShareIcon, SaveIcon, TrashIcon, PlusIcon, XIcon,
} from '@/components/icons';

type SlotKey = keyof SavedBuildParts;

type PoolItem = { id: string; slug?: string; name: string; brand?: string; price?: number | null };
interface SlotDef { key: SlotKey; label: string; icon: React.ReactNode; pool: PoolItem[] | null; optional?: boolean; }

const SLOTS: SlotDef[] = [
  { key: 'cpuSlug', label: 'Processor', icon: <CpuIcon size={16} />, pool: [] }, // filled dynamically
  { key: 'motherboardId', label: 'Motherboard', icon: <TableIcon size={16} />, pool: allMotherboards },
  { key: 'gpuSlug', label: 'Graphics card', icon: <GpuIcon size={16} />, pool: [] },
  { key: 'ramId', label: 'Memory', icon: <MemoryIcon size={16} />, pool: allRam },
  { key: 'storageId', label: 'Storage', icon: <HardDriveIcon size={16} />, pool: allStorage },
  { key: 'psuId', label: 'Power supply', icon: <PlugIcon size={16} />, pool: allPsus },
  { key: 'caseId', label: 'Case', icon: <BoxIcon size={16} />, pool: allCases },
  { key: 'coolerId', label: 'CPU cooler', icon: <FanIcon size={16} />, pool: allCoolers, optional: true },
];

const PRESETS: Record<string, SavedBuildParts> = {
  budget: { cpuSlug: 'intel-core-i5-12400f', motherboardId: 'mb-8', gpuSlug: 'amd-radeon-rx-6600', ramId: 'ram-15', storageId: 'st-2', psuId: 'psu-3', caseId: 'case-8' },
  gaming: { cpuSlug: 'amd-ryzen-7-7800x3d', motherboardId: 'mb-27', gpuSlug: 'nvidia-geforce-rtx-4070-super', ramId: 'ram-1', storageId: 'st-1', psuId: 'psu-7', caseId: 'case-1', coolerId: 'co-1' },
  workstation: { cpuSlug: 'amd-ryzen-9-9950x', motherboardId: 'mb-23', gpuSlug: 'nvidia-geforce-rtx-4080-super', ramId: 'ram-2', storageId: 'st-3', psuId: 'psu-6', caseId: 'case-6', coolerId: 'co-4' },
  sff: { cpuSlug: 'amd-ryzen-5-7600', motherboardId: 'mb-46', gpuSlug: 'amd-radeon-rx-7600', ramId: 'ram-4', storageId: 'st-4', psuId: 'psu-5', caseId: 'case-10' },
};

export default function Builder() {
  const [params] = useSearchParams();
  const builds = useAppStore((s) => s.builds);
  const saveBuild = useAppStore((s) => s.saveBuild);
  const deleteBuild = useAppStore((s) => s.deleteBuild);
  const toast = useAppStore((s) => s.toast);

  const [sel, setSel] = useState<SavedBuildParts>(() => ({
    cpuSlug: params.get('cpu') ?? undefined,
    gpuSlug: params.get('gpu') ?? undefined,
  }));
  const [name, setName] = useState('My build');
  const [game, setGame] = useState(allGames[0]?.name ?? '');

  const cpu: Cpu | undefined = sel.cpuSlug ? getCpu(sel.cpuSlug) : undefined;
  const gpu: Gpu | undefined = sel.gpuSlug ? getGpu(sel.gpuSlug) : undefined;
  const mobo = allMotherboards.find((m) => m.id === sel.motherboardId);
  const ram = allRam.find((r) => r.id === sel.ramId);
  const ssd = allStorage.find((r) => r.id === sel.storageId);
  const psu = allPsus.find((p) => p.id === sel.psuId);
  const kase = allCases.find((c) => c.id === sel.caseId);
  const cool = allCoolers.find((c) => c.id === sel.coolerId);

  const parts: { slot: SlotDef; item?: PoolItem }[] = [
    { slot: SLOTS[0], item: cpu }, { slot: SLOTS[1], item: mobo }, { slot: SLOTS[2], item: gpu },
    { slot: SLOTS[3], item: ram }, { slot: SLOTS[4], item: ssd }, { slot: SLOTS[5], item: psu },
    { slot: SLOTS[6], item: kase }, { slot: SLOTS[7], item: cool },
  ];

  const total = parts.reduce((a, p) => a + (p.item?.price ?? 0), 0);
  const tdpSum = (cpu?.tdp ?? 0) + (gpu?.tdp ?? 0) + 120; // rest of system ~120 W

  const issues = useMemo(() => checkCompatibility({ cpu, gpu, mobo, ram, ssd, psu, kase, cool }), [cpu, gpu, mobo, ram, ssd, psu, kase, cool]);
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  const fpsByRes = useMemo(() => {
    if (!gpu) return null;
    const g = allGames.find((x) => x.name === game) ?? allGames[0];
    // heavier games demand more; scale raster estimate by title weight (0.55..1.15)
    const weight = 0.55 + ((hashStr(g.name) % 60) / 100);
    const mk = (res: '1080p' | '1440p' | '4K') => {
      const raw = Math.round(estimateFps(gpu, res, 'ultra') * weight);
      const cap = cpu ? cpuCap(cpu, res) : Infinity;
      return Math.max(5, Math.min(raw, cap));
    };
    return { game: g.name, rows: [{ res: '1080p', fps: mk('1080p') }, { res: '1440p', fps: mk('1440p') }, { res: '4K', fps: mk('4K') }] };
  }, [gpu, cpu, game]);

  function hashStr(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

  const bottleneck = useMemo(() => {
    if (!cpu || !gpu) return null;
    const cGaming = cpu.benchmarks.gaming / Math.max(...allCpus.map((c) => c.benchmarks.gaming));
    const rRaster = gpu.benchmarks.raster / Math.max(...allGpus.map((g) => g.benchmarks.raster));
    const diff = Math.round((rRaster - cGaming) * 100);
    if (Math.abs(diff) < 12) return { level: 'ok' as const, text: 'Balanced pairing — neither part meaningfully limits the other at 1440p and above.' };
    if (diff > 0) return { level: 'cpu' as const, text: `The ${gpu.name} is about ${diff}% faster than this CPU can feed at 1080p. Expect CPU-limited frames in competitive titles; the gap shrinks at 1440p/4K.` };
    return { level: 'gpu' as const, text: `The ${cpu.name} outruns this GPU by ${-diff}% — graphics-card limited in nearly every scenario. Great candidate for a future GPU upgrade.` };
  }, [cpu, gpu]);

  const powerRecommendation = useMemo(() => {
    if (!gpu && !cpu) return null;
    const need = tdpSum * 1.45; // transient headroom
    const rec = allPsus.filter((p) => p.watts >= need).sort((a, b) => a.watts - b.watts)[0];
    return { need: Math.round(need / 5) * 5, rec };
  }, [cpu, gpu, tdpSum]);

  const setSlot = (key: SlotKey, id: string) => setSel((s) => ({ ...s, [key]: id || undefined }));

  const applyPreset = (k: string) => { setSel(PRESETS[k] as SavedBuildParts); setName(`Preset: ${k}`); toast(`${k.charAt(0).toUpperCase() + k.slice(1)} preset loaded`, 'info'); };

  const doSave = () => {
    if (!cpu || !gpu) { toast('Pick a CPU and GPU before saving', 'error'); return; }
    saveBuild({ ...sel, name: name.trim() || 'Untitled build', total });
    toast('Build saved to your library', 'success');
  };

  const exportCsv = () => {
    const rows: (string | number)[][] = [['Component', 'Part', 'Price USD']];
    parts.forEach(({ slot, item }) => { if (item) rows.push([slot.label, item.name, item.price ?? 0]); });
    rows.push(['TOTAL', '', total]);
    download('my-build.csv', toCSV(rows), 'text/csv');
    toast('Build CSV downloaded', 'success');
  };

  const exportPdf = () => {
    printSpecSheet(name || 'PC build', [
      { heading: 'Components', rows: parts.map(({ slot, item }) => [slot.label, item ? `${item.name}${item.brand ? ` (${item.brand})` : ''} — ${fmtPrice(item.price ?? null)}` : '—']) },
      { heading: 'Summary', rows: [['Total', fmtPrice(total)], ['Est. load draw', `${Math.round(tdpSum)} W`], ['Compatibility', errors.length ? `${errors.length} issue(s)` : warnings.length ? `${warnings.length} warning(s)` : 'All good ✓']] },
    ]);
  };

  const share = async () => {
    const q = new URLSearchParams();
    if (sel.cpuSlug) q.set('cpu', sel.cpuSlug);
    if (sel.gpuSlug) q.set('gpu', sel.gpuSlug);
    const ok = await copyToClipboard(`${location.origin}${location.pathname}#/builder?${q.toString()}`);
    toast(ok ? 'Build link copied!' : 'Copy failed', ok ? 'success' : 'error');
  };

  useSeo({ title: 'PC Builder — compatibility check & FPS estimates', description: 'Pick components, get automatic socket/power/clearance checks, bottleneck analysis, estimated FPS and total cost.' });

  const optionsFor = (slot: SlotDef) => {
    if (slot.key === 'cpuSlug') return allCpus.map((c) => ({ value: c.slug, label: `${c.name} — ${fmtPrice(c.price)}` }));
    if (slot.key === 'gpuSlug') return allGpus.map((g) => ({ value: g.slug, label: `${g.name} — ${fmtPrice(g.price)}` }));
    return (slot.pool ?? []).map((p) => ({ value: p.id, label: `${p.name} — ${fmtPrice(p.price ?? null)}` }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-10">
      <Section title="PC Builder" sub="Choose parts — we validate sockets, power, clearance and estimate real FPS automatically."
        action={<div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map((k) => <button key={k} onClick={() => applyPreset(k)} className="btn btn-ghost text-xs capitalize"><PlusIcon size={13} /> {k}</button>)}
        </div>}>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Slots */}
          <div className="lg:col-span-2 space-y-2">
            {SLOTS.map((slot) => {
              const chosen = parts.find((p) => p.slot.key === slot.key)?.item;
              return (
                <div key={slot.key} className="glass flex flex-col gap-2 rounded-xl p-3 sm:flex-row sm:items-center">
                  <div className="flex w-44 shrink-0 items-center gap-2 text-sm font-semibold text-ink-200">
                    <span className="text-accent">{slot.icon}</span>{slot.label}{slot.optional && <span className="text-xs font-normal text-ink-500">(optional)</span>}
                  </div>
                  <select className="input flex-1" aria-label={slot.label} value={(chosen as { slug?: string; id?: string })?.slug ?? chosen?.id ?? ''} onChange={(e) => setSlot(slot.key, e.target.value)}>
                    <option value="">— select —</option>
                    {optionsFor(slot).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="w-24 text-right font-display text-sm font-bold text-ink-50 tabular-nums">{chosen ? fmtPrice(chosen.price ?? null) : '—'}</div>
                </div>
              );
            })}
            <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
              <span className="font-display font-bold text-ink-50">Estimated total</span>
              <span className="font-display text-2xl font-extrabold text-accent tabular-nums">{fmtPrice(total)}</span>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-display font-bold text-ink-50">Compatibility</h3>
              {issues.length === 0 && (parts.some((p) => p.item) ? (
                <p className="flex items-center gap-2 text-sm text-emerald-400"><CheckIcon size={16} /> All checks passed — this build is coherent.</p>
              ) : <p className="text-sm text-ink-400">Select parts to run automatic checks.</p>)}
              <ul className="space-y-2">
                {issues.map((i, idx) => (
                  <li key={idx} className={cn('flex gap-2 rounded-lg px-3 py-2 text-sm',
                    i.level === 'error' ? 'bg-red-500/10 text-red-300' : i.level === 'warning' ? 'bg-amber-500/10 text-amber-300' : 'bg-sky-500/10 text-sky-300')}>
                    <span className="mt-0.5 shrink-0">{i.level === 'error' ? <XIcon size={15} /> : i.level === 'warning' ? <AlertIcon size={15} /> : <InfoIcon size={15} />}</span>
                    {i.message}
                  </li>
                ))}
              </ul>
              {powerRecommendation && (
                <p className="mt-3 text-xs text-ink-400">Peak system draw ≈ <b className="text-ink-200">{Math.round(tdpSum)} W</b>; recommended PSU ≥ {powerRecommendation.need} W{powerRecommendation.rec ? ` (e.g. ${powerRecommendation.rec.name})` : ''}.</p>
              )}
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-display font-bold text-ink-50">Bottleneck analysis</h3>
              {bottleneck ? (
                <p className={cn('text-sm leading-relaxed', bottleneck.level === 'ok' ? 'text-emerald-400' : 'text-amber-300')}>{bottleneck.text}</p>
              ) : <p className="text-sm text-ink-400">Pick both a CPU and a GPU to analyze the pairing.</p>}
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-display font-bold text-ink-50">Expected performance</h3>
              {fpsByRes ? (
                <>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Target game</label>
                  <select className="input mb-3" value={game} onChange={(e) => setGame(e.target.value)} aria-label="Target game">
                    {allGames.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                  <BarsChart height={200} xKey="res" bars={[{ key: 'fps', label: 'FPS at Ultra', color: '#34d399' }]} data={fpsByRes.rows.map((r) => ({ res: r.res, fps: r.fps }))} />
                  <p className="mt-2 text-[11px] text-ink-500">Model estimate for “{fpsByRes.game}”, no upscaling.</p>
                </>
              ) : <p className="text-sm text-ink-400">Choose a GPU to see FPS estimates.</p>}
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-display font-bold text-ink-50">Save & export</h3>
              <input className="input mb-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Build name" maxLength={40} aria-label="Build name" />
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-primary justify-center" onClick={doSave}><SaveIcon size={15} /> Save</button>
                <button className="btn btn-ghost justify-center" onClick={share}><ShareIcon size={15} /> Share</button>
                <button className="btn btn-ghost justify-center" onClick={exportPdf}><PrinterIcon size={15} /> PDF</button>
                <button className="btn btn-ghost justify-center" onClick={exportCsv}><DownloadIcon size={15} /> CSV</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Saved builds library */}
      <Section title="Your saved builds" sub="Stored locally in this browser — nothing leaves your device.">
        {builds.length === 0 ? (
          <p className="glass rounded-xl p-6 text-sm text-ink-400">No saved builds yet. Configure a machine above and hit Save.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {builds.map((b) => {
              const bc = getCpu(b.cpuSlug ?? ''), bg = getGpu(b.gpuSlug ?? '');
              return (
                <div key={b.id} className="glass glow-on-hover rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-display font-bold text-ink-50">{b.name}</div>
                      <div className="mt-1 truncate text-xs text-ink-400">{bc?.name ?? 'no CPU'} · {bg?.name ?? 'no GPU'}</div>
                    </div>
                    <button onClick={() => deleteBuild(b.id)} aria-label={`Delete ${b.name}`} className="text-ink-500 hover:text-red-400"><TrashIcon size={15} /></button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge tone="green">{fmtPrice(b.total)}</Badge>
                    <button className="btn btn-ghost text-xs" onClick={() => { setSel(b); setName(b.name); toast('Build loaded into editor', 'info'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Load</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-4 text-xs text-ink-500">Want inspiration? Browse <Link to="/community" className="text-accent hover:underline">community builds</Link> or the <Link to="/tools" className="text-accent hover:underline">guides & tools</Link>.</p>
      </Section>
    </motion.div>
  );
}

/* ---------- compatibility engine ---------- */
function checkCompatibility(p: {
  cpu?: Cpu; gpu?: Gpu; mobo?: Motherboard; ram?: RamKit; ssd?: StorageDrive; psu?: Psu; kase?: CaseItem; cool?: CoolerItem;
}): CompatIssue[] {
  const out: CompatIssue[] = [];
  const { cpu, gpu, mobo, ram, ssd, psu, kase, cool } = p;
  if (cpu && mobo) {
    if (cpu.socket !== mobo.socket) out.push({ level: 'error', message: `Socket mismatch: ${cpu.name} needs ${cpu.socket}, board has ${mobo.socket}.` });
    else out.push({ level: 'info', message: `Socket match confirmed: LGA/AM ${cpu.socket}.` });
    if (ram && !mobo.memoryType.startsWith(ram.type.slice(0, 4))) out.push({ level: 'error', message: `Board supports ${mobo.memoryType}, kit is ${ram.type}.` });
    if (ram && ram.capacityGB > mobo.maxMemoryGB) out.push({ level: 'warning', message: `Board tops out at ${mobo.maxMemoryGB} GB, kit is ${ram.capacityGB} GB.` });
    if (cpu.overclockable && !/x|z/i.test(mobo.chipset)) out.push({ level: 'warning', message: `${cpu.name} is unlocked but ${mobo.chipset} does not allow CPU overclocking.` });
  }
  if (cpu && ram && !cpu.memoryTypes.some((t) => ram.type.startsWith(t.split('-')[0]))) out.push({ level: 'warning', message: `${cpu.name} officially supports ${cpu.memoryTypes.join('/')}; kit is ${ram.type}.` });
  if (cpu && cool && !cool.sockets.some((s) => cpu.socket.toLowerCase().includes(s.toLowerCase().split('-')[0]) || s.includes(cpu.socket))) out.push({ level: 'warning', message: `Cooler lists support for ${cool.sockets.join(', ')} — verify ${cpu.socket} bracket availability.` });
  if (cpu && cool && cool.tdpRating < cpu.tdp * 1.1) out.push({ level: 'warning', message: `${cool.name} is rated ${cool.tdpRating} W for a ${cpu.tdp} W chip — expect higher noise/temps.` });
  if (cpu && cool && kase && cool.heightMm && kase.maxCoolerMm && cool.heightMm > kase.maxCoolerMm) out.push({ level: 'error', message: `${cool.name} is ${cool.heightMm} mm tall, ${kase.name} fits ${kase.maxCoolerMm} mm.` });
  if (cpu && mobo && kase) {
    const ffOk = kase.formFactorSupport.some((f) => f.toLowerCase() === mobo.formFactor.toLowerCase());
    if (!ffOk) out.push({ level: 'error', message: `${mobo.name} is ${mobo.formFactor}; ${kase.name} supports ${kase.formFactorSupport.join('/')}.` });
  }
  if (gpu && kase && kase.maxGpuMm < 300 && gpu.tdp > 200) out.push({ level: 'warning', message: `${gpu.name} is a long high-TDP card — verify it fits ${kase.name} (${kase.maxGpuMm} mm GPU clearance).` });
  if (gpu && psu) {
    const need = Math.round(((cpu?.tdp ?? 65) + gpu.tdp + 120) * 1.4);
    if (psu.watts < need) out.push({ level: 'error', message: `${psu.name} (${psu.watts} W) is undersized — this GPU pair needs ≈${need} W.` });
    else out.push({ level: 'info', message: `PSU headroom OK: ${psu.watts} W vs ~${need} W recommended.` });
  }
  if (ssd && mobo && ssd.kind === 'NVMe SSD' && mobo.m2Slots === 0) out.push({ level: 'error', message: `${mobo.name} has no M.2 slot for ${ssd.name}.` });
  if (psu && psu.efficiency === '80+ Bronze' && ((cpu?.tdp ?? 0) + (gpu?.tdp ?? 0)) > 400) out.push({ level: 'warning', message: 'High-draw system — consider an 80+ Gold or better PSU for efficiency and transient tolerance.' });
  if (ram && (cpu?.category === 'desktop') && !cpu.unlocked && ram.speedMTs >= 7200) out.push({ level: 'info', message: `${ram.name} at ${ram.speedMTs} MT/s may train down on non-K/non-X platforms.` });
  return out;
}
