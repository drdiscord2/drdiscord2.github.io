import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { allNews, allArticles, getArticle } from '@/lib/db';
import type { NewsItem } from '@/types/hardware';
import { Section, Badge } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { SearchBar } from '@/components/SearchBar';
import { cn } from '@/lib/utils';
import { NewspaperIcon, ClockIcon, ArrowRightIcon } from '@/components/icons';
import { useSeo } from '@/lib/seo';

const TAGS = ['all', 'GPU', 'CPU', 'Memory', 'Software', 'Industry', 'Mobile'];

export default function News() {
  const [params] = useSearchParams();
  const [tag, setTag] = useState(params.get('tag') ?? 'all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const perPage = 9;

  useEffect(() => { setPage(1); }, [tag, q]);

  const filtered = useMemo(() => allNews.filter((n) => {
    if (tag !== 'all' && n.tag.toLowerCase() !== tag.toLowerCase()) return false;
    if (q && !(`${n.title} ${n.summary}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [tag, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);
  const featured = filtered[0];
  const article = openId ? getArticle(openId) : null;

  useSeo({ title: 'Hardware News & Articles', description: `Latest PC hardware news — ${allNews.length} headlines on GPUs, CPUs, memory and the industry, plus deep-dive articles.` });

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title flex items-center gap-2"><NewspaperIcon size={24} /> News & articles</h1>
        <p className="mt-1 text-sm text-ink-400">Aggregated hardware headlines with source attribution — filter by topic or search.</p>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter news by topic">
          {TAGS.map((t) => (
            <button key={t} onClick={() => setTag(t)} aria-pressed={tag === t} className={cn('chip', tag === t ? 'border-accent/50 bg-accent/15 text-accent' : 'border-ink-600/60 bg-ink-800 text-ink-300 hover:text-ink-100')}>{t}</button>
          ))}
        </div>
        <SearchBarSmall q={q} setQ={setQ} />
      </div>

      {featured && (
        <article className="glass glow-on-hover mb-8 grid gap-6 rounded-2xl p-6 md:grid-cols-[1fr_260px]">
          <div>
            <Badge tone="orange">Top story · {featured.tag}</Badge>
            <h2 className="heading mt-3 !text-2xl">{featured.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">{featured.summary}</p>
            <p className="mt-3 text-xs text-ink-500">{featured.date} · Source: <span className="font-semibold text-ink-300">{featured.source}</span></p>
            <Link to="/guides" className="link mt-3 inline-flex items-center gap-1 text-sm">Read related guides <ArrowRightIcon size={13} /></Link>
          </div>
          <div className="hidden rounded-xl bg-gradient-to-br from-accent/25 via-violet-500/20 to-orange-400/20 p-6 md:block" aria-hidden>
            <NewspaperIcon size={40} className="text-accent" />
            <p className="mt-3 font-display text-sm font-bold text-ink-100">{featured.tag} desk</p>
            <p className="text-xs text-ink-300">DrDiscord2 newsroom</p>
          </div>
        </article>
      )}

      <Section title={`All headlines (${filtered.length})`}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {slice.map((n) => (
            <article key={n.id} className="glass glow-on-hover flex flex-col rounded-xl p-4">
              <div className="mb-2 flex items-center justify-between"><Badge tone="slate">{n.tag}</Badge><span className="flex items-center gap-1 text-[11px] text-ink-500"><ClockIcon size={12} /> {n.date}</span></div>
              <h3 className="font-display font-bold leading-snug text-ink-50">{n.title}</h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-300">{n.summary}</p>
              <p className="mt-3 text-[11px] text-ink-500">via <span className="font-semibold text-ink-300">{n.source}</span></p>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <p className="glass rounded-xl p-8 text-center text-sm text-ink-400">No headlines match “{q}” in {tag === 'all' ? 'any topic' : tag}.</p>}
        {pages > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Pagination">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1 ? 'page' : undefined} className={cn('h-9 w-9 rounded-lg text-sm font-medium', page === i + 1 ? 'bg-accent text-ink-950' : 'bg-ink-800 text-ink-300 hover:bg-ink-700')}>{i + 1}</button>
            ))}
          </nav>
        )}
      </Section>

      <Section title="Deep-dive articles" sub="Long-form guides from the DrDiscord2 editorial team" action={<Link to="/guides" className="link text-sm">Browse all guides</Link>}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {allArticles.slice(0, 6).map((a) => (
            <button key={a.slug} onClick={() => setOpenId(a.slug)} className="glass glow-on-hover rounded-xl p-4 text-left">
              <Badge tone="cyan">{a.category}</Badge>
              <h3 className="mt-2 font-display font-bold text-ink-50">{a.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink-400">{a.excerpt}</p>
              <p className="mt-2 text-[11px] text-ink-500">{a.author} · {a.readMinutes} min read</p>
            </button>
          ))}
        </div>
      </Section>

      <Modal open={!!article} onClose={() => setOpenId(null)} title={article?.title ?? ''} wide>
        {article && (
          <article className="prose-invert max-w-none">
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-ink-400"><Badge tone="cyan">{article.category}</Badge><span>{article.author}</span><span>·</span><span>{article.tags.join(', ')}</span></div>
            {article.body.map((p, i) => p.startsWith('## ') ? <h3 key={i} className="heading mb-2 mt-6 !text-lg">{p.slice(3)}</h3> : <p key={i} className="mb-3 text-sm leading-relaxed text-ink-300">{p}</p>)}
          </article>
        )}
      </Modal>
    </div>
  );
}

function SearchBarSmall({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return (
    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search headlines…" aria-label="Search news" className="input w-full lg:w-80" />
  );
}
