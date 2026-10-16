import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { getCpu, getGpu } from '@/lib/db';
import { ScaleIcon, XIcon, ArrowRightIcon } from '@/components/icons';

export function resolveItem(key: string): { name: string; kind: 'cpu' | 'gpu' } | null {
  if (key.startsWith('cpu:')) { const c = getCpu(key.slice(4)); return c ? { name: c.name, kind: 'cpu' } : null; }
  if (key.startsWith('gpu:')) { const g = getGpu(key.slice(4)); return g ? { name: g.name, kind: 'gpu' } : null; }
  return null;
}

export function CompareTray() {
  const compareList = useAppStore((s) => s.compareList);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const nav = useNavigate();
  if (compareList.length === 0) return null;
  const items = compareList.map(resolveItem).filter(Boolean) as { name: string; kind: 'cpu' | 'gpu' }[];
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 print:hidden" role="region" aria-label="Comparison tray">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 rounded-2xl border border-accent/30 bg-ink-900/90 p-3 shadow-glow backdrop-blur-xl">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-accent"><ScaleIcon size={16} /> Compare ({items.length}/4)</span>
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {items.map((it, i) => (
            <span key={compareList[i]} className="chip border-ink-600/70 bg-ink-800 !normal-case text-ink-200">
              <span className="text-accent">{it.kind.toUpperCase()}</span> {it.name}
              <button onClick={() => toggleCompare(compareList[i])} aria-label={`Remove ${it.name} from comparison`} className="ml-1 text-ink-400 hover:text-red-400"><XIcon size={12} /></button>
            </span>
          ))}
        </div>
        <button onClick={clearCompare} className="btn-ghost !py-1.5 text-xs">Clear</button>
        <button disabled={items.length < 2} onClick={() => nav(`/compare?items=${compareList.join(',')}`)} className="btn-primary !py-1.5 text-xs">
          Compare now <ArrowRightIcon size={14} />
        </button>
      </div>
    </div>
  );
}
