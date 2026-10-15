import { Link } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { useSeo } from '@/lib/seo';
import { CpuIcon, GpuIcon } from '@/components/icons';

const links: Array<{ to: string; label: string; desc: string }> = [
  { to: '/cpu', label: 'CPU Database', desc: '150+ desktop, server & mobile processors' },
  { to: '/gpu', label: 'GPU Database', desc: 'NVIDIA, AMD & Intel graphics cards' },
  { to: '/compare', label: 'Compare Tool', desc: 'Side-by-side up to 4 components' },
  { to: '/builder', label: 'PC Builder', desc: 'Compatible build with price & wattage' },
  { to: '/benchmarks', label: 'Benchmarks', desc: 'Leaderboards and trend analysis' },
  { to: '/news', label: 'News & Articles', desc: 'Latest hardware news and guides' },
];

export default function NotFound() {
  useSeo({ title: 'Page not found (404)', description: 'The page you are looking for does not exist.', noindex: true });
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mb-6 flex items-center justify-center gap-3 text-accent opacity-70">
        <CpuIcon size={40} />
        <span className="font-display text-4xl font-bold text-muted">404</span>
        <GpuIcon size={40} />
      </div>
      <h1 className="font-display text-3xl font-bold">This page went out of stock</h1>
      <p className="mt-3 text-muted">
        The URL you followed doesn&apos;t match any page. It may have moved, or the slug is mistyped.
        Try a search — every CPU, GPU, article and game term is indexed.
      </p>
      <div className="mt-6"><SearchBar autoFocus /></div>
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="glass rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5">
            <div className="font-semibold">{l.label}</div>
            <div className="mt-1 text-sm text-muted">{l.desc}</div>
          </Link>
        ))}
      </div>
      <Link to="/" className="btn btn-primary mt-8 inline-flex">Back to home</Link>
    </div>
  );
}
