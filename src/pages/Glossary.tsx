import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { allGlossary } from '@/lib/db';
import type { GlossaryTerm } from '@/types/hardware';
import { cn, toCSV, download, printSpecSheet, copyToClipboard } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Section, Badge } from '@/components/ui';
import { EmptyState } from '@/components/Skeleton';
import { useSeo } from '@/lib/seo';
import { SearchIcon, DownloadIcon, PrinterIcon, ShareIcon, BookIcon, ArrowUpIcon } from '@/components/icons';

export default function Glossary() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [cat, setCat] = useState<string>('all');
  const toast = useAppStore((s) => s.toast);
  const termRefs = useRef<Record<string, HTMLElement | null>>({});
  const [showTop, setShowTop] = useState(false);

  const cats = useMemo(() => ['all', ...Array.from(new Set(allGlossary.map((t) => t.category))).sort()], []);
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const filtered = useMemo(() => allGlossary.filter((t) =>
    (cat === 'all' || t.category === cat) &&
    (!q || norm(t.term).includes(norm(q)) || norm(t.definition).includes(norm(q)) || (t.acronym ?? '').toLowerCase().includes(norm(q))),
  ).sort((a, b) => a.term.localeCompare(b.term)), [q, cat]);

  // group by first letter
  const letters = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const L = t.term[0].toUpperCase();
      if (!map.has(L)) map.set(L, []);
      map.get(L)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (cat !== 'all') p.set('cat', cat);
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, cat]);

  useSeo({ title: 'Hardware glossary — every acronym explained', description: `Searchable glossary of ${allGlossary.length} PC hardware terms: TDP, IPC, VRAM, DLSS and more, with plain-language definitions.` });

  const exportCsv = () => {
    download('drdiscord2-glossary.csv', toCSV([['Term', 'Acronym', 'Category', 'Definition'], ...filtered.map((t) => [t.term, t.acronym ?? '', t.category, t.definition])]), 'text/csv');
    toast('Glossary CSV exported', 'success');
  };
  const exportPdf = () => {
    printSpecSheet('DrDiscord2 Hardware Glossary', [{ heading: `${filtered.length} terms`, rows: filtered.map((t) => [`${t.term}${t.acronym ? ` (${t.acronym})` : ''} — ${t.category}`, t.definition]) }]);
  };
  const share = async () => {
    const ok = await copyToClipboard(location.href);
    toast(ok ? 'Link copied — filters included in URL' : 'Copy failed', ok ? 'success' : 'error');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-10">
      <Section title="Hardware glossary" sub={`${allGlossary.length} terms explained in plain language. Click any word in articles to jump here.`}
        action={<div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost text-xs" onClick={share}><ShareIcon size={14} /> Share</button>
          <button className="btn btn-ghost text-xs" onClick={exportPdf}><PrinterIcon size={14} /> PDF</button>
          <button className="btn btn-ghost text-xs" onClick={exportCsv}><DownloadIcon size={14} /> CSV</button>
        </div>}>

        {/* Controls */}
        <div className="glass mb-6 rounded-xl p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input className="input pl-9" placeholder="Search terms & definitions…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search glossary" />
            </div>
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Categories">
              {cats.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                  className={cn('chip capitalize transition', cat === c ? '!border-accent/60 !bg-accent/15 !text-accent font-semibold' : 'hover:border-ink-500')}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Alphabet index */}
          <div className="mt-3 flex flex-wrap gap-1">
            {letters.map(([L]) => (
              <button key={L} onClick={() => termRefs.current[L]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="grid h-7 w-7 place-items-center rounded-md bg-ink-800/60 text-xs font-bold text-ink-300 hover:bg-accent/20 hover:text-accent" aria-label={`Jump to ${L}`}>{L}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<BookIcon size={36} />} title="No matching terms" body={`Nothing found for "${q}". Try a shorter query or clear the category filter.`}
            action={<button className="btn btn-ghost" onClick={() => { setQ(''); setCat('all'); }}>Reset filters</button>} />
        ) : (
          <div className="space-y-10">
            {letters.map(([L, terms]) => (
              <section key={L} ref={(el) => { termRefs.current[L] = el; }} className="scroll-mt-24">
                <h2 className="mb-3 flex items-center gap-3 font-display text-2xl font-extrabold text-accent">{L}<span className="h-px flex-1 bg-ink-700/60" /></h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {terms.map((t) => (
                    <div key={t.term} id={`term-${t.term.toLowerCase().replace(/\W+/g, '-')}`} className="glass glow-on-hover scroll-mt-28 rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-ink-50">{t.term}{t.acronym && <span className="ml-2 text-xs font-normal text-ink-400">({t.acronym})</span>}</h3>
                        <Badge tone="slate">{t.category}</Badge>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{t.definition}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="mt-8 text-sm text-ink-400">Missing a term? Check the <Link to="/tools" className="text-accent hover:underline">interactive tools</Link> or read the <Link to="/news" className="text-accent hover:underline">guides</Link>.</p>
      </Section>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
          className="fixed bottom-24 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-accent text-ink-950 shadow-lg shadow-accent/30 transition hover:scale-105">
          <ArrowUpIcon size={18} />
        </button>
      )}
    </motion.div>
  );
}
