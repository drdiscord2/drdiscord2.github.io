import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { allArticles, getArticle, allGlossary } from '@/lib/db';
import { Section, Badge } from '@/components/ui';
import { Accordion } from '@/components/ui';
import { EmptyState } from '@/components/Skeleton';
import { BookIcon, ChevronRightIcon } from '@/components/icons';
import { useSeo } from '@/lib/seo';


const CATS = ['buying-guide', 'tutorial', 'comparison', 'review', 'news-analysis'];

export default function Guides() {
  const [cat, setCat] = useState('');
  const cats = useMemo(() => Array.from(new Set(allArticles.map((a) => a.category))), []);
  const list = useMemo(() => allArticles.filter((a) => !cat || a.category === cat), [cat]);
  useSeo({ title: 'Guides & Tutorials', description: `${allArticles.length} in-depth hardware guides: buying advice, overclocking tutorials, build how-tos and technical explainers.` });
  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title flex items-center gap-2"><BookIcon size={24} /> Guides & tutorials</h1>
        <p className="mt-1 text-sm text-ink-400">Editorial deep-dives written for builders — from first PC to enthusiast overclocking.</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-1.5" role="group" aria-label="Filter guides by category">
        <button onClick={() => setCat('')} className={!cat ? 'chip border-accent/50 bg-accent/15 text-accent' : 'chip border-ink-600/60 bg-ink-800 text-ink-300'}>All ({allArticles.length})</button>
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={cat === c ? 'chip border-accent/50 bg-accent/15 text-accent' : 'chip border-ink-600/60 bg-ink-800 text-ink-300'}>{c.replace('-', ' ')}</button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => (
          <Link key={a.slug} to={`/guides/${a.slug}`} className="glass glow-on-hover group flex flex-col rounded-xl p-5">
            <div className="flex items-center justify-between"><Badge tone="cyan">{a.category.replace('-', ' ')}</Badge><span className="text-[11px] text-ink-500">{a.readMinutes} min read</span></div>
            <h2 className="mt-3 font-display text-lg font-bold text-ink-50 group-hover:text-accent">{a.title}</h2>
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-400">{a.excerpt}</p>
            <p className="mt-3 flex items-center gap-1 text-xs text-ink-500">{a.author} · {a.date} <ChevronRightIcon size={12} className="transition-transform group-hover:translate-x-1 group-hover:text-accent" /></p>
          </Link>
        ))}
      </div>
      {list.length === 0 && <EmptyState title="No guides in this category yet" />}
    </div>
  );
}

export function ArticlePage() {
  const { slug = '' } = useParams();
  const a = getArticle(slug);
  useSeo({ title: a ? a.title : 'Guide not found', description: a?.excerpt, jsonLd: a ? { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, author: a.author, datePublished: a.date, articleSection: a.category, keywords: a.tags.join(', ') } : undefined });
  if (!a) return <EmptyState title="Article not found" body={`No guide with id “${slug}”.`} action={<Link to="/guides" className="btn-primary mt-2">All guides</Link>} />;
  const related = allArticles.filter((x) => x.slug !== a.slug && (x.category === a.category || x.tags.some((t) => a.tags.includes(t)))).slice(0, 3);
  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-ink-400">
        <Link to="/" className="hover:text-accent">Home</Link><ChevronRightIcon size={13} /><Link to="/guides" className="hover:text-accent">Guides</Link><ChevronRightIcon size={13} /><span className="truncate text-ink-200">{a.title}</span>
      </nav>
      <Badge tone="cyan">{a.category.replace('-', ' ')}</Badge>
      <h1 className="heading mt-3 !text-3xl md:!text-4xl">{a.title}</h1>
      <p className="mt-2 text-sm text-ink-400">By <span className="font-semibold text-ink-200">{a.author}</span> · {a.date} · {a.readMinutes} min read</p>
      <div className="mt-8 space-y-4">
        {a.body.map((p, i) => p.startsWith('## ')
          ? <h2 key={i} className="heading !text-xl">{p.slice(3)}</h2>
          : <p key={i} className="leading-relaxed text-ink-300">{p}</p>)}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">{a.tags.map((t) => <Badge key={t} tone="slate">{t}</Badge>)}</div>
      {related.length > 0 && (
        <Section title="Related guides" className="mt-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} to={`/guides/${r.slug}`} className="glass glow-on-hover rounded-xl p-4"><h3 className="font-display font-bold text-ink-100 hover:text-accent">{r.title}</h3><p className="mt-1 line-clamp-2 text-xs text-ink-400">{r.excerpt}</p></Link>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}

export function Glossary() {
  const [q, setQ] = useState('');
  const list = useMemo(() => allGlossary.filter((g) => !q || g.term.toLowerCase().includes(q.toLowerCase()) || g.definition.toLowerCase().includes(q.toLowerCase())), [q]);
  const letters = useMemo(() => Array.from(new Set(list.map((g) => g.term[0].toUpperCase()))).sort(), [list]);
  useSeo({ title: 'Hardware Glossary', description: `${allGlossary.length} PC hardware terms explained in plain language — TDP, IPC, PCIe lanes, DLSS, Infinity Fabric and more.` });
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="section-title">Hardware glossary</h1>
      <p className="mt-1 text-sm text-ink-400">{allGlossary.length} terms, plain-language definitions. Search or browse alphabetically.</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms… (e.g. PCIe, IPC, DLSS)" aria-label="Search glossary" className="input mt-4" />
      <div className="mt-4 flex flex-wrap gap-1 text-xs">{letters.map((l) => <span key={l} className="chip border-ink-600/60 bg-ink-800 text-ink-300">{l}</span>)}</div>
      <div className="mt-6 space-y-6">
        {letters.map((l) => (
          <div key={l}>
            <h2 className="heading mb-2 !text-lg text-accent">{l}</h2>
            <Accordion items={list.filter((g) => g.term[0].toUpperCase() === l).map((g) => ({ title: g.term, content: g.definition }))} />
          </div>
        ))}
        {list.length === 0 && <p className="glass rounded-xl p-8 text-center text-sm text-ink-400">Nothing matches “{q}”.</p>}
      </div>
    </div>
  );
}
