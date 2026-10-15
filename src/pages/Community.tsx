import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCpu, getGpu, communityBuilds, addCommunityBuild, likeBuild, allAuthors, allCpus, allGpus } from '@/lib/db';
import type { UserBuild } from '@/types/hardware';
import { Badge, Section, Select } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { useAppStore } from '@/store/useAppStore';
import { cn, fmtPrice } from '@/lib/utils';
import { UsersIcon, HeartIcon, CpuIcon, GpuIcon, CheckIcon, AlertIcon, PlusIcon } from '@/components/icons';
import { useSeo } from '@/lib/seo';
import type { SavedBuild } from '@/store/useAppStore';

const PURPOSES: { id: UserBuild['purpose']; label: string }[] = [
  { id: 'gaming', label: 'Gaming' }, { id: 'workstation', label: 'Workstation' }, { id: 'budget', label: 'Budget' }, { id: 'sff', label: 'Small form factor' }, { id: 'streaming', label: 'Streaming' }
];

type ListItem = UserBuild & { local?: boolean };

function savedToUserBuild(b: SavedBuild): ListItem {
  const partNames = [b.cpuSlug && getCpu(b.cpuSlug)?.name, b.gpuSlug && getGpu(b.gpuSlug)?.name].filter(Boolean) as string[];
  return {
    id: b.id, title: b.name, author: 'you', cpuSlug: b.cpuSlug ?? '', gpuSlug: b.gpuSlug ?? '',
    parts: partNames.length ? partNames : ['Custom configuration'], total: b.total,
    purpose: (b.cpuSlug && getCpu(b.cpuSlug)?.category === 'server') ? 'workstation' : 'gaming',
    likes: 0, description: 'Saved from the PC Builder — open the builder to edit and share it.', local: true
  };
}

export default function Community() {
  const toast = useAppStore((s) => s.toast);
  const builds = useAppStore((s) => s.builds);
  const [purpose, setPurpose] = useState('');
  const [sort, setSort] = useState<'likes' | 'price-asc' | 'newest'>('likes');
  const [shareOpen, setShareOpen] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);

  const list = useMemo(() => {
    const mine = builds.map(savedToUserBuild);
    const all = [...mine, ...communityBuilds()].filter((b) => !purpose || b.purpose === purpose);
    return all.sort((a, b) => sort === 'likes' ? b.likes - a.likes : sort === 'price-asc' ? a.total - b.total : 0);
  }, [builds, purpose, sort]);

  const shareBuild = (b: UserBuild) => {
    const delta = likeBuild(b.id);
    if (delta > 0) { setLiked((l) => [...l, b.id]); toast('Liked — thanks for the feedback!'); }
    else { setLiked((l) => l.filter((x) => x !== b.id)); }
  };

  useSeo({ title: 'Community Builds', description: 'Real PC configurations shared by the Infomachine community — browse, filter and like gaming, workstation and budget builds.' });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2"><UsersIcon size={24} /> Community builds</h1>
          <p className="mt-1 text-sm text-ink-400">{list.length} rigs shared by builders — every part cross-linked to our database.</p>
        </div>
        <button onClick={() => setShareOpen(true)} className="btn-primary !py-1.5 text-xs"><PlusIcon size={14} /> Share your build</button>
      </div>

      <div className="glass mb-6 grid gap-3 rounded-xl p-4 sm:grid-cols-3">
        <Select label="Purpose" value={purpose} onChange={setPurpose} options={PURPOSES.map((p) => ({ value: p.id, label: p.label }))} allLabel="All purposes" />
        <Select label="Sort" value={sort} onChange={(v) => setSort(v as never)} options={[{ value: 'likes', label: 'Most liked' }, { value: 'price-asc', label: 'Cheapest first' }, { value: 'newest', label: 'Newest (seed order)' }]} />
        <div className="hidden items-end pb-1 text-xs text-ink-500 sm:flex">Your saved builds from the PC Builder appear here automatically.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((b) => {
          const cpu = getCpu(b.cpuSlug), gpu = getGpu(b.gpuSlug);
          return (
            <article key={b.id} className="glass glow-on-hover flex flex-col rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display font-bold text-ink-50">{b.title}</h2>
                  <p className="text-xs text-ink-500">by <span className="font-semibold text-ink-300">@{b.author}</span></p>
                </div>
                <Badge tone="slate">{b.purpose.replace('-', ' ')}</Badge>
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                <Link to={cpu ? `/cpu/${cpu.slug}` : '/cpu'} className={cn('flex items-center gap-2 rounded-lg px-2 py-1', cpu ? 'text-ink-200 hover:bg-white/5 hover:text-accent' : 'text-ink-500')}><CpuIcon size={14} className="text-accent" /><span className="truncate">{cpu?.name ?? b.cpuSlug}</span>{cpu && <span className="ml-auto shrink-0 text-xs tabular-nums text-ink-500">{fmtPrice(cpu.price)}</span>}</Link>
                <Link to={gpu ? `/gpu/${gpu.slug}` : '/gpu'} className={cn('flex items-center gap-2 rounded-lg px-2 py-1', gpu ? 'text-ink-200 hover:bg-white/5 hover:text-accent' : 'text-ink-500')}><GpuIcon size={14} className="text-accent" /><span className="truncate">{gpu?.name ?? b.gpuSlug}</span>{gpu && <span className="ml-auto shrink-0 text-xs tabular-nums text-ink-500">{fmtPrice(gpu.price)}</span>}</Link>
              </div>
              <p className="mt-2 line-clamp-2 flex-1 text-xs text-ink-400">{b.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-display font-bold text-accent tabular-nums">{fmtPrice(b.total)}</span>
                <button onClick={() => shareBuild(b)} aria-pressed={liked.includes(b.id)} aria-label={`Like ${b.title}`} className={cn('flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors', liked.includes(b.id) ? 'text-rose-400' : 'text-ink-400 hover:text-rose-300')}>
                  <HeartIcon size={15} fill={liked.includes(b.id) ? 'currentColor' : 'none'} /> {b.likes + (liked.includes(b.id) ? 1 : 0)}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <Section title="Meet the editorial team" className="mt-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {allAuthors.map((a) => (
            <div key={a.id} className="glass rounded-xl p-4 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent/30 to-violet-500/30 font-display text-lg font-bold text-accent">{a.name[0]}</div>
              <div className="mt-2 font-display font-bold text-ink-50">{a.name}</div>
              <div className="text-xs text-accent">{a.role}</div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-400">{a.bio}</p>
            </div>
          ))}
        </div>
      </Section>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share a build with the community">
        <ShareForm onClose={() => setShareOpen(false)} onDone={(msg) => { toast(msg); setShareOpen(false); }} />
      </Modal>
    </div>
  );
}

function ShareForm({ onClose, onDone }: { onClose: () => void; onDone: (msg: string) => void }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [cpuSlug, setCpuSlug] = useState('');
  const [gpuSlug, setGpuSlug] = useState('');
  const [purpose, setPurpose] = useState<UserBuild['purpose']>('gaming');
  const [desc, setDesc] = useState('');
  const desktopCpus = useMemo(() => allCpus.filter((c) => c.category === 'desktop' && c.price != null), []);
  const desktopGpus = useMemo(() => allGpus.filter((g) => g.category === 'desktop' && g.price != null), []);
  const cpu = getCpu(cpuSlug), gpu = getGpu(gpuSlug);
  const total = (cpu?.price ?? 0) + (gpu?.price ?? 0) + 480; // estimate for remaining parts
  const warn = cpu && gpu && cpu.benchmarks.gaming < gpu.benchmarks.raster * 0.55;

  return (
    <form className="space-y-3" onSubmit={(e) => {
      e.preventDefault();
      if (!title || !cpuSlug || !gpuSlug) return;
      addCommunityBuild({ name: title, author: author || 'anonymous', cpuSlug, gpuSlug, parts: [cpu!.name, gpu!.name], total, purpose, compatible: !warn, description: desc || 'Shared via the community form.' });
      onDone('Your build was published to the community gallery');
    }}>
      <input autoFocus className="input" placeholder="Build title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input className="input" placeholder="Display name (optional)" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <Select label="CPU" value={cpuSlug} onChange={setCpuSlug} allLabel="Pick processor…" options={desktopCpus.map((c) => ({ value: c.slug, label: `${c.name} — ${fmtPrice(c.price)}` }))} />
      <Select label="GPU" value={gpuSlug} onChange={setGpuSlug} allLabel="Pick graphics card…" options={desktopGpus.map((g) => ({ value: g.slug, label: `${g.name} — ${fmtPrice(g.price)}` }))} />
      <Select label="Purpose" value={purpose} onChange={(v) => setPurpose(v as UserBuild['purpose'])} options={PURPOSES.map((p) => ({ value: p.id, label: p.label }))} />
      <textarea className="input min-h-20" placeholder="Tell us about the build, thermals, quirks…" value={desc} onChange={(e) => setDesc(e.target.value)} />
      {cpu && gpu && (
        <div className={cn('rounded-lg border p-3 text-sm', warn ? 'border-orange-500/40 bg-orange-500/10 text-orange-200' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200')}>
          <span className="flex items-center gap-2">{warn ? <AlertIcon size={15} /> : <CheckIcon size={15} />} Estimated ~{fmtPrice(total)} including board/RAM/PSU. {warn ? 'Heads-up: this CPU may bottleneck that GPU at 1080p.' : 'Balanced pairing — looks good!'}</span>
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
        <button type="submit" disabled={!title || !cpuSlug || !gpuSlug} className="btn-primary flex-1 disabled:opacity-40">Publish build</button>
      </div>
      <p className="text-[11px] text-ink-500">Stored locally in your browser — this demo has no backend, so shares are private to you.</p>
    </form>
  );
}

