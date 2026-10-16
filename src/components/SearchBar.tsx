import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalSearch, type SearchHit } from '@/lib/db';
import { SearchIcon, CpuIcon, GpuIcon, NewspaperIcon, GamepadIcon, BookIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const kindIcon: Record<SearchHit['kind'], typeof CpuIcon> = {
  cpu: CpuIcon, gpu: GpuIcon, article: NewspaperIcon, game: GamepadIcon, glossary: BookIcon
};
const kindLabel: Record<SearchHit['kind'], string> = {
  cpu: 'CPU', gpu: 'GPU', article: 'Article', game: 'Game', glossary: 'Glossary'
};

export function SearchBar({ big = false, autoFocus = false }: { big?: boolean; autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hits = useMemo(() => globalSearch(q), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (h: SearchHit) => {
    setOpen(false);
    setQ('');
    nav(h.path);
  };

  return (
    <div ref={boxRef} className="relative w-full" role="combobox" aria-expanded={open && hits.length > 0} aria-haspopup="listbox">
      <div className="relative">
        <SearchIcon className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-ink-400', big ? 'h-5 w-5' : 'h-4 w-4')} />
        <input
          ref={inputRef}
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setSel(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            else if (e.key === 'Enter' && hits[sel]) go(hits[sel]);
            else if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Search CPUs, GPUs, games, articles… (press /)"
          aria-label="Search hardware database"
          className={cn('input', big ? '!py-3.5 !pl-11 text-base' : '!pl-9 text-sm')}
        />
      </div>
      {open && q.trim().length >= 2 && (
        <ul role="listbox" aria-label="Search results" className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-ink-600/60 bg-ink-900/95 p-1.5 shadow-card backdrop-blur-xl">
          {hits.length === 0 && <li className="px-3 py-4 text-sm text-ink-400">No matches for “{q}”. Try “4090”, “7800X3D” or “Zen”.</li>}
          {hits.map((h, i) => {
            const Icon = kindIcon[h.kind];
            return (
              <li key={h.path + i} role="option" aria-selected={i === sel}>
                <button
                  onMouseEnter={() => setSel(i)}
                  onClick={() => go(h)}
                  className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors', i === sel ? 'bg-accent/15 text-ink-50' : 'text-ink-300 hover:bg-white/5')}
                >
                  <span className="shrink-0 rounded-md bg-ink-800 p-1.5 text-accent"><Icon size={15} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{h.title}</span>
                    <span className="block truncate text-xs text-ink-500">{h.subtitle}</span>
                  </span>
                  <span className="chip border-ink-600/60 text-ink-400">{kindLabel[h.kind]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
