import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Cpu, Gpu } from '@/types/hardware';

export interface SavedBuildParts {
  cpuSlug?: string;
  motherboardId?: string;
  gpuSlug?: string;
  ramId?: string;
  storageId?: string;
  psuId?: string;
  caseId?: string;
  coolerId?: string;
}

export interface SavedBuild extends SavedBuildParts {
  id: string;
  name: string;
  createdAt: number;
  total: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  kind: 'cpu' | 'gpu';
  state: string; // serialized filter params (query-string style)
}

interface AppState {
  theme: 'dark' | 'light';
  highContrast: boolean;
  reducedMotion: boolean;
  country: string;
  compareList: string[]; // slugs with type prefix "cpu:" / "gpu:"
  favorites: string[];
  builds: SavedBuild[];
  presets: FilterPreset[];
  toasts: { id: number; text: string; kind: 'success' | 'error' | 'info' }[];
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setHighContrast: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setCountry: (c: string) => void;
  toggleCompare: (key: string) => void;
  clearCompare: () => void;
  toggleFavorite: (key: string) => void;
  saveBuild: (b: Omit<SavedBuild, 'id' | 'createdAt'>) => void;
  deleteBuild: (id: string) => void;
  savePreset: (p: Omit<FilterPreset, 'id'>) => void;
  deletePreset: (id: string) => void;
  toast: (text: string, kind?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: number) => void;
}

let toastSeq = 1;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      highContrast: false,
      reducedMotion: false,
      country: 'auto',
      compareList: [],
      favorites: [],
      builds: [],
      presets: [],
      toasts: [],
      setTheme: (t) => {
        set({ theme: t });
        try {
          localStorage.setItem('im-theme', t);
          document.documentElement.classList.toggle('dark', t === 'dark');
        } catch {}
      },
      toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
      setHighContrast: (v) => {
        set({ highContrast: v });
        try {
          localStorage.setItem('im-contrast', v ? 'high' : 'normal');
          document.documentElement.classList.toggle('high-contrast', v);
        } catch {}
      },
      setReducedMotion: (v) => {
        set({ reducedMotion: v });
        document.documentElement.classList.toggle('reduce-motion', v);
      },
      setCountry: (c) => set({ country: c }),
      toggleCompare: (key) => {
        const list = get().compareList;
        if (list.includes(key)) set({ compareList: list.filter((k) => k !== key) });
        else if (list.length < 4) set({ compareList: [...list, key] });
        else get().toast('Comparison holds a maximum of 4 items', 'error');
      },
      clearCompare: () => set({ compareList: [] }),
      toggleFavorite: (key) => {
        const f = get().favorites;
        set({ favorites: f.includes(key) ? f.filter((k) => k !== key) : [...f, key] });
      },
      saveBuild: (b) => {
        const id = `build-${Date.now()}`;
        set({ builds: [{ ...b, id, createdAt: Date.now() }, ...get().builds].slice(0, 50) });
      },
      deleteBuild: (id) => set({ builds: get().builds.filter((x) => x.id !== id) }),
      savePreset: (p) => {
        const id = `preset-${Date.now()}`;
        set({ presets: [...get().presets, { ...p, id }].slice(0, 20) });
      },
      deletePreset: (id) => set({ presets: get().presets.filter((x) => x.id !== id) }),
      toast: (text, kind = 'success') => {
        const id = toastSeq++;
        set({ toasts: [...get().toasts, { id, text, kind }] });
        setTimeout(() => get().dismissToast(id), 3600);
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) })
    }),
    {
      name: 'drdiscord2-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        highContrast: s.highContrast,
        reducedMotion: s.reducedMotion,
        country: s.country,
        compareList: s.compareList,
        favorites: s.favorites,
        builds: s.builds,
        presets: s.presets
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        try {
          localStorage.setItem('im-theme', state.theme);
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
          document.documentElement.classList.toggle('high-contrast', state.highContrast);
          document.documentElement.classList.toggle('reduce-motion', state.reducedMotion);
        } catch {}
      }
    }
  )
);

/** helpers for compare keys */
export const cpuKey = (c: Cpu) => `cpu:${c.slug}`;
export const gpuKey = (g: Gpu) => `gpu:${g.slug}`;
