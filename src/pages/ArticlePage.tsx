import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getArticle, allArticles } from '@/lib/db';
import type { Article } from '@/types/hardware';
import { useAppStore } from '@/store/useAppStore';
import { cn, copyToClipboard } from '@/lib/utils';
import { Section, Badge } from '@/components/ui';
import { EmptyState } from '@/components/Skeleton';
import { useSeo } from '@/lib/seo';
import { ArrowRightIcon, ClockIcon, ShareIcon, ChevronRightIcon, TagIcon } from '@/components/icons';

/** split "Head: paragraph text" body blocks */
function parseBlocks(body: string[]): { head: string; text: string }[] {
  return body.map((b) => {
    const m = b.match(/^([A-Z0-9][^:]{2,48}?):\s+([\s\S]*)$/);
    if (m && !m[1].includes('.')) return { head: m[1], text: m[2] };
    return { head: '', text: b };
  });
}

export default function ArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const article = getArticle(slug);
  const toast = useAppStore((s) => s.toast);
  const [activeH, setActiveH] = useState('');
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [reading, setReading] = useState(0);

  const blocks = useMemo(() => (article ? parseBlocks(article.body) : []), [article]);
  const headings = useMemo(() => blocks.map((b) => b.head).filter(Boolean), [blocks]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setReading(total > 0 ? Math.min(100, Math.round((window.scrollY / total) * 100)) : 0);
      let cur = '';
      for (const h of headings) {
        const r = refs.current[h]?.getBoundingClientRect();
        if (r && r.top < 160) cur = h;
      }
      setActiveH(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings.join('|')]);

  useSeo({
    title: article ? `${article.title} — DrDiscord2` : 'Article not found',
    description: article?.excerpt,
    jsonLd: article ? {
      '@context': 'https://schema.org', '@type': 'Article', headline: article.title,
      datePublished: article.date, author: { '@type': 'Person', name: article.author },
      articleSection: article.category, description: article.excerpt,
    } : undefined,
    noindex: !article,
  });

  if (!article) {
    return (
      <div className="container py-24">
        <EmptyState title="Article not found" body={`Nothing lives at "${slug}".`} action={<Link to="/news" className="btn btn-primary">Back to newsroom</Link>} />
      </div>
    );
  }

  const related = allArticles.filter((a) => a.slug !== article.slug && (a.category === article.category || a.tags.some((t) => article.tags.includes(t)))).slice(0, 3);

  const share = async () => {
    const ok = await copyToClipboard(location.href);
    toast(ok ? 'Article link copied' : 'Copy failed', ok ? 'success' : 'error');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Reading progress */}
      <div className="sticky top-0 z-30 h-1 w-full bg-transparent" aria-hidden>
        <div className="h-full bg-accent transition-[width]" style={{ width: `${reading}%` }} />
      </div>

      <article className="container max-w-5xl py-10">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-ink-400">
          <Link to="/" className="hover:text-accent">Home</Link><ChevronRightIcon size={11} />
          <Link to="/news" className="hover:text-accent">News & Guides</Link><ChevronRightIcon size={11} />
          <span className="text-ink-200">{article.category}</span>
        </nav>

        <header className="glass overflow-hidden rounded-2xl">
          <img src={article.cover} alt="" className="h-52 w-full object-cover md:h-72" loading="lazy" />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="violet">{article.category}</Badge>
              {article.tags.slice(0, 4).map((t) => <Badge key={t} tone="slate">{t}</Badge>)}
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-ink-50 md:text-4xl">{article.title}</h1>
            <p className="mt-2 text-ink-300">{article.excerpt}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-400">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 font-display text-xs font-bold text-accent">{initialsOf(article.author)}</span>
                <Link to={`/authors#${anchor(article.author)}`} className="font-semibold text-ink-200 hover:text-accent">{article.author}</Link>
                <span>· {new Date(article.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="flex items-center gap-1"><ClockIcon size={13} /> {article.readMinutes} min read</span>
              </div>
              <button className="btn btn-ghost text-xs" onClick={share}><ShareIcon size={14} /> Share</button>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 glass rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-400"><TagIcon size={13} /> Contents</div>
              <nav className="space-y-1">
                {headings.map((h, i) => (
                  <a key={h} href={`#${anchor(h)}`} onClick={(e) => { e.preventDefault(); refs.current[h]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    className={cn('block truncate rounded-md px-2 py-1 text-xs transition', activeH === h ? 'bg-accent/15 font-semibold text-accent' : 'text-ink-400 hover:bg-ink-700/40 hover:text-ink-200')}>
                    {i + 1}. {h}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Body */}
          <div id="article-scroll" className="space-y-8">
            {blocks.map((b, i) => (
              <section key={i} ref={(el) => { refs.current[b.head || `sec-${i}`] = el; }} id={b.head ? anchor(b.head) : undefined} className="scroll-mt-28">
                {b.head && <h2 className="font-display text-xl font-bold text-ink-50">{b.head}</h2>}
                <p className="mt-2 leading-relaxed text-ink-200/90">{linkifyTerms(b.text)}</p>
              </section>
            ))}

            <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl p-5">
              <div className="flex flex-wrap gap-2">{article.tags.map((t) => <Link key={t} to={`/glossary?q=${encodeURIComponent(t)}`} className="chip hover:border-accent/50">#{t}</Link>)}</div>
              <Link to="/tools" className="btn btn-ghost text-sm">Try the interactive tools <ArrowRightIcon size={14} /></Link>
            </div>

          </div>
        </div>

        <Section title="Continue reading" className="mt-12">
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((a) => <ArticleMini key={a.id} a={a} />)}
          </div>
        </Section>
      </article>
    </motion.div>
  );
}

function ArticleMini({ a }: { a: Article }) {
  return (
    <Link to={`/article/${a.slug}`} className="glass glow-on-hover group overflow-hidden rounded-xl">
      <img src={a.cover} alt="" className="h-32 w-full object-cover transition group-hover:scale-[1.03]" loading="lazy" />
      <div className="p-4">
        <div className="text-xs text-accent">{a.category} · {a.readMinutes} min</div>
        <div className="mt-1 font-display font-bold leading-snug text-ink-50">{a.title}</div>
        <p className="mt-1 text-xs text-ink-400">{a.excerpt.slice(0, 90)}…</p>
      </div>
    </Link>
  );
}

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const initialsOf = (n: string) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/** Turn glossary-ish words into subtle links to the glossary */
function linkifyTerms(text: string) {
  const rx = /\b(TDP|IPC|VRAM|PCIe|DLSS|FSR|XeSS|ray tracing|frame rate|latency|cache)\b/gi;
  const out: React.ReactNode[] = [];
  let last = 0; let m: RegExpExecArray | null; let k = 0;
  while ((m = rx.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<Link key={k++} to={`/glossary?q=${encodeURIComponent(m[0])}`} className="text-accent underline decoration-accent/30 hover:decoration-accent">{m[0]}</Link>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
