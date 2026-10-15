import { useEffect, useState } from 'react';
import type {
  Article, Author, CaseItem, Cpu, CoolerItem, Game, GameFps, GlossaryTerm, Gpu, Motherboard,
  NewsItem, PopularComparison, Psu, RamKit, Review, StorageDrive, UserBuild
} from '@/types/hardware';

import cpusRaw from '@/data/cpus.json';
import gpusRaw from '@/data/gpus.json';
import motherboardsRaw from '@/data/motherboards.json';
import ramRaw from '@/data/ram.json';
import storageRaw from '@/data/storage.json';
import psusRaw from '@/data/psus.json';
import casesRaw from '@/data/cases.json';
import coolersRaw from '@/data/coolers.json';
import gamesRaw from '@/data/games.json';
import articlesRaw from '@/data/articles.json';
import newsRaw from '@/data/news.json';
import reviewsRaw from '@/data/reviews.json';
import usersRaw from '@/data/users.json';
import comparisonsRaw from '@/data/comparisons.json';
import glossaryRaw from '@/data/glossary.json';
import authorsRaw from '@/data/authors.json';
import testimonialsRaw from '@/data/testimonials.json';

export const allCpus = cpusRaw as unknown as Cpu[];
export const allGpus = gpusRaw as unknown as Gpu[];
export const allMotherboards = motherboardsRaw as unknown as Motherboard[];
export const allRam = ramRaw as unknown as RamKit[];
export const allStorage = storageRaw as unknown as StorageDrive[];
export const allPsus = psusRaw as unknown as Psu[];
export const allCases = casesRaw as unknown as CaseItem[];
export const allCoolers = coolersRaw as unknown as CoolerItem[];
export const allGames = gamesRaw as unknown as Game[];
export const allArticles = articlesRaw as unknown as Article[];
export const allNews = newsRaw as unknown as NewsItem[];
export const allReviewsRaw = reviewsRaw as unknown as { id: string; target: string; user: string; rating: number; date: string; title: string; body: string; helpful: number }[];
export const allCommunityBuilds = usersRaw as unknown as UserBuild[];
export const allComparisons = comparisonsRaw as unknown as PopularComparison[];
export const allGlossary = glossaryRaw as unknown as GlossaryTerm[];
export const allAuthors = authorsRaw as unknown as Author[];
export const allTestimonials = testimonialsRaw as unknown as { name: string; role: string; text: string; rating: number }[];

const cpuBySlug = new Map(allCpus.map((c) => [c.slug, c]));
const gpuBySlug = new Map(allGpus.map((g) => [g.slug, g]));

export const getCpu = (slug: string): Cpu | undefined => cpuBySlug.get(slug);
export const getGpu = (slug: string): Gpu | undefined => gpuBySlug.get(slug);
export const getItem = (key: string): Cpu | Gpu | undefined => {
  if (key.startsWith('cpu:')) return getCpu(key.slice(4));
  if (key.startsWith('gpu:')) return getGpu(key.slice(4));
  return undefined;
};
export const isCpuItem = (i: Cpu | Gpu): i is Cpu => 'cores' in i;
export const getArticle = (slug: string): Article | undefined => allArticles.find((a) => a.slug === slug);

/** Reviews keyed by "cpu:slug" / "gpu:slug" */
export const reviewsFor = (key: string): Review[] => {
  const slug = key.split(':')[1];
  const seed = allReviewsRaw
    .filter((r) => r.target === slug)
    .map((r) => ({ ...r, target: key }));
  const local = (localReviews()[key] ?? []) as Review[];
  return [...local, ...seed];
};

/** Simulated async fetch with loading state — enables skeletons & offline caching demos */
export function useAsyncData<T>(loader: () => T, deps: unknown[] = []): { data: T | null; loading: boolean; error: string | null } {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    // micro-delay so skeleton shimmer is perceptible & code paths exercise loading UI
    const t = setTimeout(() => {
      try {
        const d = loader();
        if (alive) setState({ data: d, loading: false, error: null });
      } catch (e) {
        if (alive) setState({ data: null, loading: false, error: e instanceof Error ? e.message : 'Failed to load data' });
      }
    }, 120);
    return () => {
      alive = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

/** Global search across CPUs, GPUs and articles */
export interface SearchHit {
  kind: 'cpu' | 'gpu' | 'article' | 'game' | 'glossary';
  title: string;
  subtitle: string;
  path: string;
}

export function globalSearch(q: string): SearchHit[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const c of allCpus)
    if (c.name.toLowerCase().includes(needle) || c.architecture.toLowerCase().includes(needle))
      hits.push({ kind: 'cpu', title: c.name, subtitle: `${c.cores}C/${c.threads}T · ${c.socket}`, path: `/cpu/${c.slug}` });
  for (const g of allGpus)
    if (g.name.toLowerCase().includes(needle) || g.chip.toLowerCase().includes(needle))
      hits.push({ kind: 'gpu', title: g.name, subtitle: `${g.vram} GB ${g.memoryType} · ${g.tdp} W`, path: `/gpu/${g.slug}` });
  for (const a of allArticles)
    if (a.title.toLowerCase().includes(needle) || a.tags.some((t) => t.toLowerCase().includes(needle)))
      hits.push({ kind: 'article', title: a.title, subtitle: a.category, path: `/guides/${a.slug}` });
  for (const gm of allGames)
    if (gm.name.toLowerCase().includes(needle))
      hits.push({ kind: 'game', title: gm.name, subtitle: `${gm.year} · ${gm.genre}`, path: `/games` });
  for (const term of allGlossary)
    if (term.term.toLowerCase().includes(needle) || (term.acronym ?? '').toLowerCase().includes(needle))
      hits.push({ kind: 'glossary', title: term.term, subtitle: term.category, path: `/glossary` });
  return hits.slice(0, 24);
}

/* ---------- deterministic game-FPS model ---------- */

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
};

/** Reference point: the fastest desktop GPU in the database defines index 100 scaling */
const MAX_RASTER = Math.max(...allGpus.map((g) => g.benchmarks.raster), 1);

const gameWeight = (game: string, year: number): number => {
  const heavy = ['Cyberpunk', 'Alan Wake', 'Hogwarts', 'Star Wars Outlaws', 'Avatar', 'Horizon'].some((k) => game.includes(k));
  const esport = ['Counter-Strike', 'Fortnite', 'Dota', 'League', 'Valorant', 'Rocket'].some((k) => game.includes(k));
  const age = Math.max(0, 2026 - year);
  if (esport) return 0.22;
  if (heavy) return Math.max(0.45, 1 - age * 0.02);
  return Math.max(0.3, 0.6 - age * 0.02);
};

/** Estimated FPS rows for a GPU across our catalog games */
export function gamesForGpu(slug: string): GameFps[] {
  const g = getGpu(slug);
  if (!g) return [];
  const power = g.benchmarks.raster / MAX_RASTER; // 0..1
  return allGames.slice(0, 10).map((gm) => {
    const w = gameWeight(gm.name, gm.year);
    const jitter = 0.9 + (hash(slug + gm.name) % 21) / 100;
    const at = (resMul: number) => Math.max(4, Math.round(240 * w * resMul * power * jitter + 8));
    return { game: gm.name, fps1080: at(1), fps1440: at(0.66), fps4k: at(0.4) };
  });
}

/** Estimated FPS rows for a CPU (paired with an RTX 4070 Super-class GPU) */
export function gamesForCpu(slug: string): GameFps[] {
  const c = getCpu(slug);
  if (!c) return [];
  const pair = allGpus.find((g) => g.name.includes('4070 Super') || g.name.includes('4070 SUPER')) ?? allGpus.find((g) => g.name.includes('4070'));
  if (!pair) return [];
  const maxGaming = Math.max(...allCpus.map((x) => x.benchmarks.gaming), 1);
  const cap = c.benchmarks.gaming / maxGaming; // 0..1
  return gamesForGpu(pair.slug).map((row) => {
    const lim = (v: number, mul: number) => Math.max(4, Math.min(v, Math.round(260 * cap * mul)));
    return { game: row.game, fps1080: lim(row.fps1080, 1), fps1440: lim(row.fps1440, 1.3), fps4k: lim(row.fps4k, 1.9) };
  });
}

export const gameList = allGames.map((g) => g.name);
export const getGameByName = (name: string): Game | undefined => allGames.find((g) => g.name === name);

/** Synthetic monthly price series between launch MSRP and current street price */
export function priceHistory(releaseDate: string, launchPrice: number | null, currentPrice: number | null): { m: string; p: number }[] {
  const start = new Date(releaseDate + (releaseDate.length === 7 ? '-01' : ''));
  const end = new Date('2026-10-01');
  if (isNaN(start.getTime())) return [];
  const lp = launchPrice ?? currentPrice ?? 0;
  const cp = currentPrice ?? lp;
  const months: { m: string; p: number }[] = [];
  const total = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24 * 30.4)));
  const steps = Math.min(total, 48);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // initial premium spike then decay toward street price
    const spike = Math.sin(Math.min(t * 3, 1) * Math.PI * 0.5) * 0.12;
    const noise = ((hash(releaseDate + i) % 100) / 100 - 0.5) * 0.06;
    const p = Math.round(lp * (1 + spike + noise) * (1 - t) + cp * t * (1 + noise * 0.5));
    const d = new Date(start.getFullYear(), start.getMonth() + Math.round(t * total), 1);
    months.push({ m: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, p: Math.max(1, p) });
  }
  return months;
}

/** Related items: same category, nearest benchmark neighbours */
export function relatedItems(slug: string): (Cpu | Gpu)[] {
  const item = cpuBySlug.get(slug) ?? gpuBySlug.get(slug);
  if (!item) return [];
  const pool: (Cpu | Gpu)[] = cpuBySlug.has(slug) ? allCpus : allGpus;
  const metricOf = (i: Cpu | Gpu) => ('multi' in i.benchmarks ? i.benchmarks.multi : (i as Gpu).benchmarks.raster);
  const mine = metricOf(item);
  return pool
    .filter((o) => o.slug !== slug && o.category === item.category)
    .sort((a, b) => Math.abs(metricOf(a) - mine) - Math.abs(metricOf(b) - mine))
    .slice(0, 8);
}

/* ---------- localStorage-backed mutations (reviews & community builds) ---------- */

const readLS = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
const writeLS = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function addReview(key: string, r: Omit<Review, 'id'> & { id?: string }): Review {
  const all = readLS<Record<string, Review[]>>('im-reviews', {});
  const review: Review = { ...r, id: r.id ?? `local-${Date.now()}` };
  all[key] = [review, ...(all[key] ?? [])];
  writeLS('im-reviews', all);
  return review;
}

export function localReviews(): Record<string, Review[]> {
  return readLS<Record<string, Review[]>>('im-reviews', {});
}

export interface BuildInput {
  name: string;
  author?: string;
  cpuSlug: string;
  gpuSlug: string;
  parts: string[];
  total: number;
  purpose: UserBuild['purpose'];
  compatible: boolean;
  description: string;
  estimatedFps?: { game: string; fps: number };
}

export function addCommunityBuild(b: BuildInput): UserBuild {
  const all = readLS<UserBuild[]>('im-community-builds', []);
  const build: UserBuild = {
    id: `cb-${Date.now()}`, title: b.name, author: b.author ?? 'you',
    cpuSlug: b.cpuSlug, gpuSlug: b.gpuSlug, parts: b.parts, total: b.total,
    purpose: b.purpose, likes: 0,
    description: `${b.description}${b.estimatedFps ? ` · Est. ${b.estimatedFps.fps} FPS in ${b.estimatedFps.game}` : ''}${b.compatible ? '' : ' · compatibility issues flagged'}`
  };
  writeLS('im-community-builds', [build, ...all]);
  return build;
}

export function communityBuilds(): UserBuild[] {
  return [...readLS<UserBuild[]>('im-community-builds', []), ...allCommunityBuilds];
}

export function likeBuild(id: string): number {
  const liked = readLS<string[]>('im-liked-builds', []);
  if (liked.includes(id)) return -1;
  writeLS('im-liked-builds', [...liked, id]);
  return 1;
}
