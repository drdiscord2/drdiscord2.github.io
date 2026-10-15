import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { SearchBar } from '@/components/SearchBar';
import { CompareTray } from '@/components/CompareTray';
import { Toaster } from '@/components/Toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CpuIcon, GpuIcon, ScaleIcon, WrenchIcon, TrophyIcon, NewspaperIcon, BookIcon, UsersIcon, InfoIcon, SunIcon, MoonIcon, MenuIcon, XIcon, SettingsIcon, HomeIcon, TrendingUpIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/cpu', label: 'CPUs', icon: CpuIcon },
  { to: '/gpu', label: 'GPUs', icon: GpuIcon },
  { to: '/compare', label: 'Compare', icon: ScaleIcon },
  { to: '/builder', label: 'PC Builder', icon: WrenchIcon },
  { to: '/benchmarks', label: 'Benchmarks', icon: TrophyIcon },
  { to: '/news', label: 'News', icon: NewspaperIcon },
  { to: '/guides', label: 'Guides', icon: BookIcon },
  { to: '/tools', label: 'Tools', icon: TrendingUpIcon },
  { to: '/community', label: 'Community', icon: UsersIcon },
  { to: '/about', label: 'About', icon: InfoIcon }
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="DrDiscord2 home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-deep text-ink-950 shadow-glow">
        <CpuIcon size={20} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Info<span className="text-accent">machine</span>
      </span>
    </Link>
  );
}

function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const hc = useAppStore((s) => s.highContrast);
  const setHc = useAppStore((s) => s.setHighContrast);
  const rm = useAppStore((s) => s.reducedMotion);
  const setRm = useAppStore((s) => s.setReducedMotion);
  const country = useAppStore((s) => s.country);
  const setCountry = useAppStore((s) => s.setCountry);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="Display settings" aria-expanded={open} className="btn-ghost !px-2">
        <SettingsIcon size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-ink-600/60 bg-ink-900/95 p-3 shadow-card backdrop-blur-xl">
            <label className="flex items-center justify-between py-1.5 text-sm">
              High contrast
              <input type="checkbox" checked={hc} onChange={(e) => setHc(e.target.checked)} className="h-4 w-4 accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between py-1.5 text-sm">
              Reduce motion
              <input type="checkbox" checked={rm} onChange={(e) => setRm(e.target.checked)} className="h-4 w-4 accent-cyan-400" />
            </label>
            <label className="mt-1 block text-sm">
              <span className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Your country (personalized picks)</span>
              <select className="input !py-1.5 text-sm" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Select your country">
                {['auto', 'United States', 'Germany', 'United Kingdom', 'India', 'Japan', 'Brazil', 'Canada', 'Australia'].map((c) => (
                  <option key={c} value={c}>{c === 'auto' ? 'Auto-detect' : c}</option>
                ))}
              </select>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  useEffect(() => { window.scrollTo({ top: 0 }); setMenuOpen(false); }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-accent focus:px-3 focus:py-1.5 focus:text-ink-950">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
          <Logo />
          <nav aria-label="Primary" className="ml-2 hidden items-center gap-0.5 lg:flex">
            {NAV.slice(1).map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn('rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors', isActive ? 'bg-accent/15 text-accent' : 'text-ink-300 hover:bg-white/5 hover:text-ink-50')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto hidden w-64 md:block"><SearchBar /></div>
          <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} className="btn-ghost !px-2">
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
          <SettingsMenu />
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle navigation menu" aria-expanded={menuOpen} className="btn-ghost !px-2 lg:hidden">
            {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-white/5 lg:hidden" aria-label="Mobile">
              <div className="space-y-1 px-4 py-3">
                <div className="mb-3 md:hidden"><SearchBar /></div>
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium', isActive ? 'bg-accent/15 text-accent' : 'text-ink-300 hover:bg-white/5')}>
                    <n.icon size={16} /> {n.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="border-t border-white/5 bg-ink-900/60 print:hidden">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-ink-400">Open hardware intelligence — 250+ components, benchmarks, comparisons and a compatibility-aware PC builder. Works offline.</p>
          </div>
          <div>
            <h4 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-ink-200">Database</h4>
            <ul className="space-y-1.5 text-sm text-ink-400">
              <li><Link className="link" to="/cpu">Desktop & server CPUs</Link></li>
              <li><Link className="link" to="/gpu">Graphics cards</Link></li>
              <li><Link className="link" to="/benchmarks">Benchmarks</Link></li>
              <li><Link className="link" to="/compare">Comparison tool</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-ink-200">Learn</h4>
            <ul className="space-y-1.5 text-sm text-ink-400">
              <li><Link className="link" to="/guides">Guides & tutorials</Link></li>
              <li><Link className="link" to="/glossary">Glossary</Link></li>
              <li><Link className="link" to="/tools">Calculators</Link></li>
              <li><Link className="link" to="/news">News & articles</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-ink-200">Project</h4>
            <ul className="space-y-1.5 text-sm text-ink-400">
              <li><Link className="link" to="/about">About & methodology</Link></li>
              <li><Link className="link" to="/community">Community builds</Link></li>
              <li><a className="link" href={`${import.meta.env.BASE_URL}feed/rss.xml`}>RSS feed</a></li>
              <li><a className="link" href="https://github.com/drdiscord2/drdiscord2.github.io" target="_blank" rel="noreferrer">GitHub repository</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} DrDiscord2 · Data is illustrative & community-curated · Built with React + Vite, deployed on GitHub Pages
        </div>
      </footer>

      <CompareTray />
      <Toaster />
    </div>
  );
}
