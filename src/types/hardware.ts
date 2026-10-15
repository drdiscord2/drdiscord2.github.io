export type CpuCategory = 'desktop' | 'server' | 'mobile' | 'legacy';

export interface Benchmarks {
  single: number; // relative index (modern flagship ~ 700)
  multi: number; // relative index (threadripper-class ~ 3000+)
  productivity: number;
  gaming: number;
}

export interface PricePoint {
  m: string; // month label e.g. "2024-01"
  p: number; // USD
}

export interface Cpu {
  id: string;
  slug: string;
  name: string;
  brand: 'Intel' | 'AMD';
  family: string;
  category: CpuCategory;
  architecture: string;
  socket: string;
  cores: number;
  threads: number;
  baseClock: number; // GHz
  boostClock: number; // GHz
  cacheL3: number; // MB
  tdp: number; // W stock
  processNode: number; // nm
  releaseYear: number;
  releaseDate: string;
  launchPrice: number | null;
  price: number | null; // current street price USD
  iGPU: string | null;
  memoryTypes: string[];
  overclockable: boolean;
  unlocked: boolean;
  benchmarks: Benchmarks;
  pros: string[];
  cons: string[];
  priceHistory?: PricePoint[];
}

export type GpuCategory = 'desktop' | 'laptop' | 'workstation' | 'legacy';

export interface GpuBenchmarks {
  render: number; // aggregate index
  rayTracing: number;
  raster: number;
}

export interface GameFps {
  game: string;
  fps1080: number;
  fps1440: number;
  fps4k: number;
}

export interface Gpu {
  id: string;
  slug: string;
  name: string;
  brand: 'NVIDIA' | 'AMD' | 'Intel';
  chip: string;
  architecture: string;
  category: GpuCategory;
  shaders: number;
  baseClock: number;
  boostClock: number;
  vram: number; // GB
  memoryType: 'GDDR5' | 'GDDR6' | 'GDDR6X' | 'HBM2' | 'HBM2e' | 'HBM3' | 'GDDR5X';
  memoryBus: number; // bit
  bandwidth: number; // GB/s
  tdp: number;
  connectors: string[];
  outputs: string[];
  formFactor: '1-slot' | '2-slot' | '3-slot' | 'Founders' | 'Mobile';
  raytracing: boolean;
  dlss: boolean;
  fsr: boolean;
  xess: boolean;
  frameGen: boolean;
  releaseYear: number;
  releaseDate: string;
  launchPrice: number | null;
  price: number | null;
  benchmarks: GpuBenchmarks;
  gaming: GameFps[];
  pros: string[];
  cons: string[];
  priceHistory?: PricePoint[];
}

export interface Motherboard {
  id: string;
  name: string;
  brand: string;
  socket: string;
  chipset: string;
  formFactor: 'ATX' | 'mATX' | 'ITX' | 'E-ATX';
  memoryType: string;
  maxMemoryGB: number;
  memSlots: number;
  pcieVersion: string;
  m2Slots: number;
  sataPorts: number;
  price: number;
  wifi: boolean;
  tier: 'entry' | 'mid' | 'high' | 'enthusiast';
}

export interface RamKit {
  id: string;
  name: string;
  brand: string;
  type: 'DDR4' | 'DDR5';
  capacityGB: number;
  speedMTs: number;
  cl: number;
  voltage: number;
  sticks: number;
  price: number;
  rgb: boolean;
  lowProfile: boolean;
}

export interface StorageDrive {
  id: string;
  name: string;
  brand: string;
  kind: 'NVMe SSD' | 'SATA SSD' | 'HDD';
  capacityGB: number;
  readMBs: number;
  writeMBs: number;
  interface: string;
  tbw: number | null;
  price: number;
}

export interface Psu {
  id: string;
  name: string;
  brand: string;
  watts: number;
  efficiency: '80+ Bronze' | '80+ Silver' | '80+ Gold' | '80+ Platinum' | '80+ Titanium';
  modular: 'Non-modular' | 'Semi-modular' | 'Full-modular';
  formFactor: 'ATX' | 'SFX';
  price: number;
}

export interface CaseItem {
  id: string;
  name: string;
  brand: string;
  formFactorSupport: string[];
  type: 'Tower' | 'MicroTower' | 'MiniTower' | 'ITX' | 'Full Tower';
  maxGpuMm: number;
  maxCoolerMm: number;
  driveBays: number;
  airflow: 'poor' | 'okay' | 'good' | 'excellent';
  price: number;
}

export interface CoolerItem {
  id: string;
  name: string;
  brand: string;
  type: 'air' | 'aio';
  sockets: string[];
  tdpRating: number;
  heightMm: number | null;
  radiatorMm: number | null;
  noiseDb: number;
  price: number;
}

export interface Game {
  id: string;
  name: string;
  year: number;
  genre: string;
  minCpu: string;
  minGpu: string;
  recCpu: string;
  recGpu: string;
  ramGB: number;
  storageGB: number;
  optimized: 'excellent' | 'good' | 'poor';
  upscaling: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  tags: string[];
  author: string;
  date: string;
  readMinutes: number;
  cover: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  tag: string;
}

export interface Review {
  id: string;
  target: string;
  user: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  helpful: number;
}

export interface UserBuild {
  id: string;
  title: string;
  author: string;
  cpuSlug: string;
  gpuSlug: string;
  parts: string[];
  total: number;
  purpose: 'gaming' | 'workstation' | 'budget' | 'sff' | 'streaming';
  likes: number;
  description: string;
}

export interface PopularComparison {
  a: string;
  b: string;
  type: 'cpu' | 'gpu';
  searches: number;
}

export interface GlossaryTerm {
  term: string;
  acronym?: string;
  category: string;
  definition: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}
