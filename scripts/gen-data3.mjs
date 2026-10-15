// Generates articles.json, news.json, reviews.json, users.json (builds), comparisons.json, glossary.json, authors.json, testimonials.json
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const outDir = resolve(process.cwd(), 'src/data');
const W = (name, obj) => writeFileSync(resolve(outDir, name), JSON.stringify(obj, null, 1));

// ---------------- Authors ----------------
const authors = [
  { id: 'a-marek', name: 'Marek Vlk', role: 'Editor-in-chief', bio: '15 years covering silicon. Formerly at a Czech hardware magazine; overclocker since the Tualatin days.', initials: 'MV' },
  { id: 'a-lena', name: 'Lena Okafor', role: 'Senior Benchmarks Editor', bio: 'Runs our test lab. Owns 40+ CPUs and a very confused power meter.', initials: 'LO' },
  { id: 'a-jiri', name: 'Jiří Doubek', role: 'PC Builder Specialist', bio: 'Builds 20+ systems a month. SFF evangelist, cable-management perfectionist.', initials: 'JD' },
  { id: 'a-sam', name: 'Sam Whitfield', role: 'GPU Analyst', bio: 'Focuses on graphics architectures, upscaling tech and driver quality.', initials: 'SW' },
  { id: 'a-priya', name: 'Priya Raman', role: 'Data Engineer', bio: 'Maintains the database, benchmark normalization and price tracking pipelines.', initials: 'PR' }
];

// ---------------- Articles ----------------
const A = (slugT, title, excerpt, body, category, tags, author, date, readMinutes, cover) => ({
  id: `art-${slugT}`, slug: slugT, title, excerpt, body, category, tags, author, date, readMinutes, cover
});
const P = (...paras) => paras;

const articles = [
  A('how-to-choose-cpu-2026', 'How to Choose a CPU in 2026: The Complete Guide',
    'Cores, clocks, caches and sockets — a practical decision framework for gaming, productivity or both.',
    P(
      'Choosing a processor is mostly about matching workload to architecture. Gamers should prioritise single-core speed and low-latency cache (3D V-Cache parts dominate here), while streamers, editors and developers benefit from more cores and threads.',
      'Start with your budget tier. Under $150, the Ryzen 5 5500 and Core i3-12100F still handle esports titles brilliantly. In the $180–$280 sweet spot, Ryzen 5 7600 and i5-12400F/14400F offer the best all-round value. Above $300 you enter enthusiast territory where you must decide between gaming champions (7800X3D) and productivity workhorses (9900X/14700K).',
      'Check the platform before the chip. AM5 guarantees upgrade paths through 2027+, LGA 1700 is a dead end but boards are cheap, and DDR5 prices have fallen to the point where they no longer justify buying into older memory standards on a new build.',
      'Finally, never buy more CPU than your GPU can feed. At 4K, even a midrange Ryzen 5 drives flagship GPUs close to full utilization; spend the savings on graphics instead.'
    ), 'Guides', ['cpu', 'buying-guide', 'amd', 'intel'], 'Marek Vlk', '2026-08-14', 9, 'cyan'),
  A('how-to-choose-gpu-2026', 'How to Choose a GPU: Resolution, VRAM and Upscaling Explained',
    'What actually matters when picking a graphics card — and what marketing numbers you can safely ignore.',
    P(
      'The only question that truly matters: which resolution and refresh rate do you want? For 1080p/144 Hz, cards around RTX 4060 / RX 7600 are ideal. For 1440p/165 Hz aim at RTX 4070 Super / RX 7800 XT. For native 4K there is only one honest answer today — RTX 4080 Super and above.',
      'VRAM is the wildcard. Modern titles at high settings happily consume 10–16 GB; an 8 GB card will stutter in next-gen open worlds regardless of raw compute. We recommend 12 GB minimum for a card you plan to keep past 2027.',
      'Upscaling changed the market. DLSS, FSR and XeSS let a midrange card approach last-gen flagship image quality at a fraction of the cost — but upscaling cannot fix geometry or CPU bottlenecks, so pair wisely.',
      'Watch power and size too: 3-slot coolers block mATX boards, and a 450 W GPU demands a 1000 W PSU. Our PC Builder checks all of this automatically.'
    ), 'Guides', ['gpu', 'buying-guide', 'nvidia', 'amd', 'intel'], 'Sam Whitfield', '2026-08-02', 8, 'orange'),
  A('how-to-build-a-pc-step-by-step', 'How to Build a PC: Step-by-Step for First-Timers',
    'From unboxing to first boot — the exact order we use in the lab, with the mistakes beginners make most.',
    P(
      'Work top-down: install the CPU into the socket (align the gold triangle), then RAM (click firmly until latches snap), then the M.2 SSD, then the cooler — before the board ever enters the case. This makes error diagnosis trivial.',
      'Thermal paste: a rice-grain blob in the centre is enough for every consumer chip. Spread is a myth; pressure spreads it. Mount air coolers perpendicular to RAM slots for serviceability.',
      'In the case: standoffs first (never let the PCB touch metal), I/O shield snapped in, then board screws finger-tight then a quarter turn each in a star pattern. Front-panel connectors trip everyone up — consult the manual page, not YouTube.',
      'PSU cables: 24-pin ATX, 8-pin EPS (CPU), PCIe power for the GPU — use separate cables for 300 W+ cards, never a single pigtail daisy-chain. Then GPU, storage, and finally cable management for airflow.',
      'First boot: plug display into the GPU (not the motherboard!), power on, hit DEL for BIOS, enable XMP/EXPO, set fan curves, save. Install Windows from USB made with Media Creation Tool. Done.'
    ), 'Tutorials', ['pc-build', 'tutorial', 'beginner'], 'Jiří Doubek', '2026-07-21', 12, 'violet'),
  A('overclocking-guide-modern', 'Overclocking in 2026: PBO, Curve Optimizer & Intel Default Settings',
    'Modern overclocking is mostly negative voltage offsets and power limits. Here is the safe recipe.',
    P(
      'Zen 4/5: enable PBO (Motherboard limit off), set DC/AC loadline to ~1x/0.01x measured Ohms, then apply a negative Curve Optimizer offset starting at −10 all-core. Test with y-cruncher and OCCT AVX2 for an hour each. Most chips reach −20 to −30; find the per-core "silicon lottery" ceiling.',
      'Intel 13th–14th gen: stability comes first. Apply Intel Default Settings (253 W PL1/PL2), undervolt via SP offset or per-core AC/DC calibration. On K chips, all-core ratios of 5.5–5.7 GHz at ~1.25 V are typical on good silicon.',
      'Memory: EXPO/XMP profiles are validated presets. Manual tuning pays dividends on Ryzen — 6000 CL30 is the sweet spot due to the UCLK=MCLK 1:1 fabric limit. Loosen tRFC first (it gives the biggest real-world gain), then chase voltages.',
      'Always verify with real benchmarks, not just stress tests: a clock that passes Prime95 but fails a game is still unstable. Document every setting — our Overclocking Calculator tool helps track frequency/voltage deltas.'
    ), 'Guides', ['overclocking', 'performance', 'tuning'], 'Marek Vlk', '2026-06-30', 10, 'red'),
  A('thermal-paste-application', 'Thermal Paste Application: Pea Method vs Spreader vs Liquid Metal',
    'We tested five application methods across 30 coolers. The differences are smaller than you think — except liquid metal.',
    P(
      'For stock and tower coolers, the pea-in-centre method wins consistently: even coverage under mounting pressure, no voids, easiest cleanup. Corner dots help slightly on huge dies like AD102.',
      'Spreading by hand adds air pockets and wastes paste. It only matters for direct-die custom loops where mounting pressure is low.',
      'Liquid metal drops temps 5–15 °C on laptop chips (direct die) but conducts electricity — catastrophic on AM4/AM5 where the SMD capacitors surround the IHS. Use gallium pads if you must, and never on aluminium cold plates (it eats it).',
      'Re-paste cadence: every 2–3 years for standard paste, annually for liquid metal. If delta-T over ambient crept up 8 °C, your paste is cooked.'
    ), 'Tutorials', ['cooling', 'thermal-paste', 'maintenance'], 'Lena Okafor', '2026-05-18', 7, 'teal'),
  A('troubleshooting-common-issues', 'PC Won’t Boot? Troubleshooting the 12 Most Common Issues',
    'Debug LEDs, beep codes, no-post, random restarts, blue screens — a decision tree that fixes 90 % of cases.',
    P(
      'No power at all: check the PSU switch, wall outlet, and the 24-pin reseat. Short the PS_ON pin to ground with a paperclip to test the PSU standalone.',
      'Fans spin, no display: watch motherboard debug LEDs (CPU → DRAM → VGA → BOOT). Solid DRAM light means reseat sticks one at a time in slot A2; bent socket pins cause phantom DRAM errors on AM5 constantly.',
      'Random restarts under load: 70 % PSU (failing caps or insufficient wattage), 20 % unstable XMP/OC (test with JEDEC defaults), 10 % thermal shutdown (check throttling in HWiNFO).',
      'Blue screens: note the stop code. WHEA_UNCORRECTABLE_ERROR = hardware/voltage; IRQL_NOT_LESS_OR_EQUAL = driver; MEMORY_MANAGEMENT = RAM or page file. Verify with memtest86 overnight and DDU-clean driver reinstalls.',
      'Boot loop after GPU upgrade: clear CMOS, disable Fast Startup, and update BIOS — many older boards need a microcode update for newer CPUs before they POST reliably.'
    ), 'Guides', ['troubleshooting', 'repair', 'faq'], 'Jiří Doubek', '2026-04-25', 11, 'amber'),
  A('ddr5-vs-ddr4-2026', 'DDR5 vs DDR4 in 2026: Is It Finally Worth It?',
    'Prices converged, latencies dropped, and capacity-per-stick doubled. The debate is over — here’s the data.',
    P(
      'At launch DDR5 was slower in games due to latency. Today 6000 CL30 kits beat 3600 CL16 DDR4 by 4–12 % in CPU-bound titles and match it elsewhere, while offering double the bandwidth for productivity.',
      'Cost math: 32 GB DDR4 ≈ $65 used/new-old-stock, 32 GB DDR5 ≈ $95. The $30 premium buys higher binning headroom, 2× stick capacities and future-proofing — DDR4 has no upgrade path left.',
      'Platform reality decides anyway: AM5 is DDR5-only, and new Intel builds increasingly ship DDR5-only boards. Only stay on DDR4 if you already own a compatible Z690/B660 D4 board or you’re building sub-$400 total.'
    ), 'News Analysis', ['memory', 'ddr5', 'ddr4'], 'Priya Raman', '2026-03-12', 6, 'cyan'),
  A('best-budget-gpus-tier-list', 'The Budget GPU Tier List: What $150 Buys You in 2026',
    'Used mining cards, new entry-level SKUs and integrated graphics — ranked by 1080p FPS per dollar.',
    P(
      'S tier: RX 6600 (~$190 new) — unbeatable raster value, 132 W. A tier: RTX 2060 refurbished, Arc A750 when discounted below $170 (XeSS + AV1 encode save it). B tier: GTX 1660 Super used, RX 5700 XT if you accept 225 W.',
      'Avoid: anything 4 GB or less in 2026, RX 6500 XT (PCIe x4 cripples old platforms), and no-name "new" GTX 1050 Ti clones.',
      'Integrated graphics are now genuinely usable: Radeon 780M plays esports at 1080p/60 and low-medium AAA at 720p. For a strict $0 GPU budget, buy an AM5 APU instead of used discrete cards.'
    ), 'Comparisons', ['gpu', 'budget', 'tier-list'], 'Sam Whitfield', '2026-02-20', 8, 'green'),
  A('psu-sizing-myths', 'Your PSU Doesn’t Need 1200 W: Debunking Wattage Myths',
    'Transient spikes, 80+ ratings and why "headroom for upgrades" is the most expensive advice on the internet.',
    P(
      'Modern GPUs idle at 10–20 W and their transient spikes last microseconds — a quality 750 W unit rides out RTX 4080-class spikes without tripping. Our lab measures system peak draw: 14700K + 4070 Ti = 430 W actual.',
      'Rule of thumb: peak system draw × 1.6, rounded to the nearest common size. That puts most builds at 650–850 W. Buying 1200 W "just in case" costs efficiency at low load and money you could spend on GPU.',
      '80+ certification says nothing about ripple, transient response or 12 V rail quality. Prioritise units with 10-year warranties and known platforms (Corsair RMx, Seasonic Focus, be quiet! Straight Power).'
    ), 'Guides', ['psu', 'power', 'myths'], 'Lena Okafor', '2026-01-15', 6, 'orange'),
  A('nvme-generation-guide', 'NVMe Generations: Does PCIe 5.0 SSD Matter Yet?',
    'Gen5 doubles sequential numbers but barely moves real-world load times. When the premium is justified.',
    P(
      'Sequential reads look impressive (12 GB/s vs 7 GB/s) but OS/game loads are dominated by 4 KB random reads, where Gen5 leads by only 8–15 %. Game install times differ by seconds.',
      'Gen5 runs hot — heatsinks mandatory, throttling common in cramped laptops. For 95 % of users the correct buy is a high-end Gen4 (990 Pro, SN850X) or even a budget Gen4 like NV2 for a games library.',
      'Justified cases: large-file video editing scratch volumes, local AI model loading, and workstation RAID. Otherwise bank the difference toward capacity — 2 TB Gen4 beats 1 TB Gen5 in every metric that feels.'
    ), 'Guides', ['storage', 'nvme', 'ssd'], 'Priya Raman', '2025-12-08', 7, 'violet'),
  A('raytracing-path-tracing-explained', 'Ray Tracing vs Path Tracing: Why Games Suddenly Look Like Movies',
    'RT cores, BVH traversal, denoisers and frame generation — how modern lighting actually works on your GPU.',
    P(
      'Rasterization cheats: it draws triangles then guesses reflections with baked probes. Ray tracing casts actual light paths, giving perfect reflections, shadows and global illumination — at enormous compute cost.',
      'Path tracing goes further: multiple bounce GI replaces nearly every raster technique. Cyberpunk PT needs ~4× the shader throughput of RT Ultra; only flagships run it natively, hence DLSS 3 frame generation exists.',
      'Hardware implications: RT throughput scales with dedicated RT cores (Ada = 2× Ampere per clock). AMD RDNA3 uses ray accelerators + AI upsampler; Intel XeSS fills the ecosystem gap. Check our GPU filters for per-card RT indexes.'
    ), 'Explainers', ['raytracing', 'graphics', 'technology'], 'Sam Whitfield', '2025-11-19', 9, 'red'),
  A('cpu-cooling-air-vs-aio', 'Air Cooler vs AIO in 2026: Benchmarked Across 20 Chips',
    'A $40 dual-tower matches many $150 AIOs. Where liquid still wins — and where pump failure risk isn’t worth it.',
    P(
      'Best air (Peerless Assassin, NH-D12) handles up to ~250 W with acceptable noise and lasts decades. AIOs shine above 280 W sustained (14900K AVX2, 7950X PBO), and 360 mm units cut noise 5–8 dB at equal temp.',
      'Reliability: fans fail visibly and cheaply; pumps fail catastrophically and void everything. For a workstation that must survive 8 years, air. For a showpiece SFF or delidded overclock, liquid.',
      'Case compatibility decides: check max cooler height (air) and radiator mounts/fan spacing (AIO) in our case database before ordering — the Builder flags these conflicts automatically.'
    ), 'Comparisons', ['cooling', 'aio', 'air'], 'Jiří Doubek', '2025-10-27', 8, 'teal'),
  A('monitors-1440p-vs-4k', '1440p 240 Hz vs 4K 144 Hz: Which Panel Maximises Your GPU Spend?',
    'PPI, motion clarity and GPU cost per frame — the math behind the right monitor for your card.',
    P(
      'A 4K panel quadruples pixel count vs 1080p; your GPU pays 3–4× for the same framerate. Motion clarity at 4K/144 roughly equals 1440p/240 because persistence and refresh matter more than PPI for perceived smoothness.',
      'Match tiers: RTX 4060/RX 7600 → 1080p 165+; 4070/7800XT → 1440p 165–240; 4080S/9070XT-class → 4K 120–144 with DLSS Quality; 4090 → 4K 240 OLED territory.',
      'OLED changes the calculus: near-instant GtG makes effective clarity exceed spec refresh. If you play fast shooters, 1440p 480 Hz QD-OLED is the current competitive endgame.'
    ), 'Guides', ['monitor', 'display', 'gaming'], 'Marek Vlk', '2025-09-30', 7, 'amber'),
  A('used-parts-market-guide', 'Buying Used Hardware Safely: Miners, Delids and Burn-In Tests',
    'How to spot a recapped PSU, a worn-out GPU and get 40 % discounts without gambling.',
    P(
      'GPUs: ask for FurMark/Material Test screenshots with timestamps; check warranty sticker dates; avoid cards with replaced thermal pads done badly (core contact gaps show as hotspot spread >15 °C).',
      'PSUs are the one component we say never buy used — capacitor aging plus abuse makes them a fire risk. New 80+ Gold units cost less than the diagnostic equipment needed to verify a used one.',
      'CPUs age gracefully: sockets and IHS inspection suffice. Motherboards are risky (bent pins, cold solder joints); demand boot videos. Memory and NVMe (check SMART percentage life) are excellent used buys.'
    ), 'Guides', ['used-hardware', 'marketplace', 'tips'], 'Lena Okafor', '2025-08-14', 6, 'green'),
  A('ai-workstations-2026', 'Building an AI Workstation in 2026: VRAM Is the New Horsepower',
    'Local LLMs and Stable Diffusion have different rules than gaming. Memory bandwidth, PCIe lanes and cooling for 24/7 loads.',
    P(
      'LLM inference is bandwidth-bound: an RTX 4090 (1 TB/s) runs 13B models twice as fast as a card with equal compute but half the bus. 24 GB VRAM is the entry ticket for useful quantized models; two GPUs or a 48 GB card extend context comfortably.',
      'Diffusion training wants compute + VRAM; inference loves Tensor cores. Either way, run 24/7 duty cycles: enterprise cooling, positive-pressure cases, and a UPS matter more than RGB.',
      'CPU side: PCIe lane count decides multi-GPU width. Threadripper/EPYC give x16+x16; consumer AM5/LGA1700 split to x8+x8 — fine for inference, painful for training sync.'
    ), 'Explainers', ['ai', 'workstation', 'gpu'], 'Priya Raman', '2025-07-22', 10, 'cyan'),
  A('benchmark-methodology', 'How We Benchmark: Methodology, Normalization & Update Cadence',
    'Transparency report: our test rigs, software versions, sample sizes and the index formulas behind every chart.',
    P(
      'Every CPU runs Cinebench 2024 (multi/single), Blender Classroom, 7-Zip, CrossMark and 6 games at 720p ultra to isolate the CPU. GPUs run 3DMark Steel Nomport/Port Royal plus 7 games at three resolutions, RT and non-RT.',
      'Indices are geometric means normalized so Ryzen 5 5600 = 100 in CPU metrics and RTX 3060 = 100 in GPU metrics. Percentages shown in comparisons are simple relative deltas of those indices.',
      'Prices are street averages from major retailers, updated weekly; historical series come from archived listings. Data corrections are welcome via the About page — every change is logged.'
    ), 'About', ['methodology', 'data', 'transparency'], 'Priya Raman', '2025-06-10', 5, 'violet'),
  A('sff-builds-masterclass', 'Small Form Factor Masterclass: Full Performance in 12 Litres',
    'Our award-winning SFF methodology: riser trade-offs, GPU selection by length, and the cooler height trap.',
    P(
      'Rules of the genre: pick the GPU first (length ≤ case clearance − 10 mm), then the case, then everything else. Dual-slot 3060-class cards fit nearly all ITX chassis; triple-slot monsters fit almost none.',
      'Cooling: 92 mm-tall single towers (NH-L9, SilverStone NR26) cap you at ~125 W — pair with 65 W APUs or locked chips. Slim 240 AIOs unlock 7950X-class heat in Meshlicious-style vertical cases.',
      'Power: SFX units max at ~850 W today; for 4080-class builds choose the SF750 and enable GPU power-temp sync. Cable combs and short extensions aren’t optional — they’re structural.'
    ), 'Tutorials', ['sff', 'itx', 'pc-build'], 'Jiří Doubek', '2025-05-05', 9, 'orange'),
  A('motherboard-chipset-explained', 'Chipsets Decoded: What B850, Z790 and X670E Actually Change',
    'PCIe lane counts, overclock support, USB controllers and why paying extra is rarely about speed.',
    P(
      'The chipset doesn’t affect raw performance; it gates features: lane splitting (x8/x8 vs x16), number of M.2 ports, USB4 readiness, VRM quality ceilings and CPU overclock permission (Intel: Z only; AMD: B550+ usually fine).',
      'VRMs matter more than brand stickers: a 60 A phase design silently throttles a 14900K while a well-cooled midrange board sustains it. Check MOSFET temps in our reviews before pairing K-series chips with budget boards.',
      'Buy logic: unlocked flagship → Z790/X670E+; everything else → B-series saves $80 with zero fps difference; H/A-entry only for office PCs and APUs under 65 W.'
    ), 'Explainers', ['motherboard', 'chipset', 'platform'], 'Marek Vlk', '2025-04-11', 7, 'teal'),
  A('linux-gaming-2026', 'Linux Gaming in 2026: Proton, Wayland and Anti-Cheat Reality',
    'Steam Deck mainstreamed it, but kernel-level anti-cheat remains the last wall. Current compatibility report.',
    P(
      'Proton Experimental runs ~85 % of the Steam top-100 better-than-or-equal to Windows. Wayland + HDR landed; fractional scaling finally stopped blurring games. NVIDIA open kernel modules fixed the compositor stutter saga.',
      'The holdouts: EAC/BattlEye titles with opt-in Linux support only (about half now enabled permanently). Avoid dual-boot-for-one-game unless the anti-cheat list confirms support.',
      'Hardware picks: AMD GPUs remain the smoothest path; Intel Arc drivers improved dramatically; NVIDIA works well post-open-module. Any AM5/LGA1700 CPU is fine — scheduler parity arrived with 6.6 kernels.'
    ), 'News Analysis', ['linux', 'gaming', 'software'], 'Sam Whitfield', '2025-03-08', 8, 'red'),
  A('future-of-gpus-blackwell-beyond', 'After Ada: Blackwell, RDNA4 and the Next Two Years of Graphics',
    'Rumour vs confirmed specs — neural rendering, mesh shading adoption and what to wait for (or not).',
    P(
      'NVIDIA Blackwell shifts focus from raw raster to neural shaders and 5th-gen RT cores; expect big gains in path-traced titles, modest in legacy raster. AMD RDNA4 targets ray-accumulator parity and a serious uplift in media engines.',
      'Should you wait? If your card is 4060-class or newer — no, generational jumps shrink outside flagships. If you’re on a 3060/GTX 1070-era card, the next wave promises 2×+ value at each price point.',
      'We update this analysis monthly as launches land — subscribe to the RSS feed for automatic delivery.'
    ), 'Opinion', ['gpu', 'roadmap', 'future'], 'Marek Vlk', '2025-02-14', 6, 'amber')
];

// ---------------- News ----------------
const N = (id, title, summary, date, source, tag) => ({ id, title, summary, date, source, tag });
const news = [
  N('news-1', 'AMD ships Ryzen 9 9950X3D with second-gen stacked cache', 'Dual-CCD 3D V-Cache pushes gaming index past every existing desktop CPU while keeping 16/32 core productivity.', '2026-10-08', 'DrDiscord2 Lab', 'CPU'),
  N('news-2', 'NVIDIA GeForce RTX 50-series "Blackwell" launch window confirmed for CES', 'Sources point to 5090/5080 arriving January with GDDR7 at 28–32 Gbps and 5th-gen RT cores.', '2026-10-05', 'Industry Wire', 'GPU'),
  N('news-3', 'DDR5 prices fall another 12% quarter-over-quarter', '6400 CL32 32 GB kits now routinely undercut premium DDR4; fab oversupply expected to continue through H1 2027.', '2026-10-01', 'Market Watch', 'Memory'),
  N('news-4', 'Intel Arrow Lake Refresh spotted with bumped clocks', 'ES samples show +300 MHz boost and improved CUDIMM support ahead of LGA1851 board revisions.', '2026-09-27', 'Silicon Leak Desk', 'CPU'),
  N('news-5', 'Valve updates SteamOS with native PSSR support', 'Portable Shader Supersampling now available across Proton titles, benefiting AMD and Intel GPUs equally.', '2026-09-22', 'Software Beat', 'Software'),
  N('news-6', 'Samsung unveils 9900-class PCIe 5.0 SSD with 14 GB/s', 'New Phoenix controller halves Gen5 idle power; retail SKUs arrive November at Gen4-like pricing.', '2026-09-18', 'Storage News', 'Storage'),
  N('news-7', 'AMD EPYC Turin Dense hits 192 Zen 5 cores', 'Flagship server SKU doubles previous thread count; SPECrate charts already published in our database.', '2026-09-14', 'Enterprise Tech', 'Server'),
  N('news-8', 'Cyberpunk 2077 2.3 beta enables RTGI on RDNA3', 'Path tracing finally viable on Radeon with a 30–40% FSR4-assisted uplift at 4K.', '2026-09-09', 'Game Patch Notes', 'Gaming'),
  N('news-9', 'ATX 3.1 connector adoption crosses 60% of new GPUs', '12V-2x6 revisions eliminate the melted-terminal class of issues; legacy adapters now officially deprecated.', '2026-09-03', 'Standards Report', 'Power'),
  N('news-10', 'Arc Battlemage mobile GPUs leak: 20% over Alchemist', 'Benchmark entries suggest Xe2 cores land in thin-and-light gaming laptops by Q1.', '2026-08-29', 'Mobile Silicon', 'GPU'),
  N('news-11', 'Windows 11 25H2 fixes hybrid-core scheduling for Zen 5', 'Long-standing UWP thread placement bug resolved; measurable gains in creator apps.', '2026-08-24', 'OS Update', 'Software'),
  N('news-12', 'Thermalright launches Peerless Assassin 360 AIO at $79', 'The value disruptor enters liquid cooling; our lab finds it within 3°C of units twice the price.', '2026-08-19', 'Cooling Weekly', 'Cooling'),
  N('news-13', 'TSMC N2 risk production begins — 2027 desktop chips expected', 'First GAA nanosheet node claims 30% efficiency gain; AMD and Intel roadmap slides hint at 2027 client parts.', '2026-08-12', 'Fab Report', 'Manufacturing'),
  N('news-14', 'Used RTX 3080 prices climb for the first time since 2023', 'AI hobbyist demand for 10 GB cards drives secondary-market appreciation.', '2026-08-05', 'Market Watch', 'GPU'),
  N('news-15', 'Corsair announces XENEON ultrawide with built-in KVM', '49" 240 Hz dual-mode panel targets productivity gamers; shipping October.', '2026-07-30', 'Display News', 'Peripheral')
];

// ---------------- Reviews ----------------
const rv = (target, user, rating, date, title, body, helpful) => ({ id: `rv-${target}-${user}`, target, user, rating, date, title, body, helpful });
const reviews = [
  rv('amd-ryzen-7-7800x3d', 'SilentBoom', 5, '2026-09-12', 'The gaming king, period', 'Dropped from a 5800X3D, +22% avg FPS in sims and strategy titles that punish everything else. Runs on a $25 tower cooler.', 214),
  rv('amd-ryzen-7-7800x3d', 'FrameChaser', 4, '2026-08-03', 'Perfect for games, meh for renders', 'If you also render, the 12-thread handicap is real. Pure gamers: buy without thinking.', 158),
  rv('amd-ryzen-7-7800x3d', 'Budget_Builder_CZ', 5, '2026-06-21', 'Price finally makes sense', 'Street price fell under the 7700X. No-brainer now.', 96),
  rv('intel-core-i5-12400f', 'OfficeWarrior', 5, '2026-07-19', 'Still the value legend', 'Handles 1080p gaming with a 3060 Ti no problem, sips power, silent on stock cooler. Unbeatable used.', 302),
  rv('intel-core-i5-12400f', 'Upgrader88', 4, '2026-03-11', 'Great, but platform is dead', 'Chip is flawless for the price; just know LGA1700 has no upgrade path left.', 141),
  rv('nvidia-geforce-rtx-4070-super', 'PixelPusher', 5, '2026-09-01', 'The 1440p default choice', 'Matches last-gen 3090 raster for $300 less and 100W lower. DLSS3 FG extends its life easily.', 267),
  rv('nvidia-geforce-rtx-4070-super', 'QuietPCfan', 4, '2026-05-14', 'Get a good AIB model', 'FE is fine but partner cards run 8°C cooler. 12GB will age faster than 16GB rivals though.', 122),
  rv('amd-radeon-rx-7800-xt', 'TeamRedForever', 5, '2026-08-22', '16GB changes everything', 'Texture settings I skip on my old 10GB card just... work. Raster beats 4070 non-Super outright.', 189),
  rv('amd-radeon-rx-7800-xt', 'StreamerLife', 3, '2026-04-09', 'AV1 and RT lag hurts', 'Great card for pure gaming; creators still belong on NVIDIA. FSR4 closed the upscale gap some.', 87),
  rv('amd-ryzen-9-7950x', 'RenderFarmRig', 5, '2026-07-02', 'Workstation in a desktop socket', 'Blender Classroom in 2m14s. Undervolted to 120W it loses only 4%. Magic.', 176),
  rv('amd-ryzen-9-7950x', 'HeatHawk', 3, '2026-02-18', 'Hot by design', 'You WILL hit 95°C by default. Fine if you understand PBO limits, annoying otherwise.', 93),
  rv('nvidia-geforce-rtx-4090', 'MaxSettings', 5, '2026-09-25', 'Absurd in the best way', '4K/144 path-traced everything. The 24GB buffer is holding up shockingly well.', 412),
  rv('nvidia-geforce-rtx-4090', 'SizeMatters', 4, '2026-06-30', 'Plan your case around it', 'It fits exactly one case I own. Measure twice.', 155),
  rv('intel-core-i7-14700k', 'AllRounder', 5, '2026-08-11', '20 cores for $360', 'Productivity punches far above price; gaming within 5% of i9. Needs serious cooling.', 203),
  rv('amd-ryzen-5-5600', 'OldFaithful', 5, '2026-05-27', 'The AM4 forever chip', 'Six years old, still carries a 3060 Ti at 1080p perfectly. $95 used is criminal value.', 264),
  rv('nvidia-geforce-rtx-3060-12gb', 'BudgetKing', 4, '2026-01-30', '12GB saved it', 'The card that refuses to die thanks to VRAM. Driver support continues strong.', 178),
  rv('amd-threadripper-7970x', 'StudioOwner', 5, '2026-07-15', 'Replaced our dual Xeon', 'Half the power, double the single-thread. TRX50 platform finally delivers.', 88),
  rv('intel-core-ultra-9-185h', 'LaptopNomad', 4, '2026-09-08', 'Battery champion', 'Meteor Lake iGPU is genuinely usable for light editing; 12h mixed-use runtime in our testing.', 64)
];

// ---------------- User builds ----------------
const UB = (id, title, author, cpuSlug, gpuSlug, parts, total, purpose, likes, description) =>
  ({ id, title, author, cpuSlug, gpuSlug, parts, total, purpose, likes, description });
const builds = [
  UB('build-1', '1440p Sweet Spot', 'frame_chaser', 'amd-ryzen-5-7600', 'nvidia-geforce-rtx-4070-super', ['ASUS TUF B650-Plus WiFi', 'Corsair Vengeance 32GB DDR5-6000', 'WD SN850X 2TB', 'Corsair RM850x', 'Fractal North'], 1640, 'gaming', 842, 'Balanced 1440p/165 machine with clean thermals and zero bloat.'),
  UB('build-2', 'Budget LAN Party', 'lanlord', 'amd-ryzen-5-5600', 'amd-radeon-rx-6600', ['MSI B550 Tomahawk', 'Kingston Fury 16GB DDR4-3200', 'Kingston NV2 1TB', 'MSI A650BN', 'Montech AIR 1000'], 780, 'budget', 651, 'CS2/Valorant at 300+ FPS for under €800. Upgrade path to 5800X3D kept open.'),
  UB('build-3', 'Creator Beast', 'pixel_forge', 'amd-ryzen-9-7950x', 'nvidia-geforce-rtx-4090', ['ASUS ProArt X670E', 'G.Skill 96GB DDR5-6000', 'Samsung 990 Pro 4TB', 'Seasonic TX-1000', 'Torrent'], 4100, 'workstation', 512, '8K timeline editing + local SDXL. Air-cooled, whisper quiet at idle.'),
  UB('build-4', 'ITX Mini Monster', 'small_form', 'amd-ryzen-7-7800x3d', 'nvidia-geforce-rtx-4070', ['Gigabyte B650I Aorus Ultra', 'Crucial Pro 32GB DDR5-6000', 'SN770 1TB', 'Corsair SF750', 'Meshlicious + A4-H2O mods'], 1980, 'sff', 433, '9.8 litres, full X3D gaming. Cable diagram in comments.'),
  UB('build-5', 'Stream Team Rig', 'midnight_mt', 'intel-core-i7-14700k', 'nvidia-geforce-rtx-4070-ti-super', ['MSI MPG Z790 Edge WiFi', 'TeamGroup 32GB DDR5-6400', 'FireCuda 540 2TB', 'NZXT C850', 'H7 Flow'], 2260, 'streaming', 289, 'NVENC dual-encoder setup, OBS at 1080p60 gameplay + facecam + alerts.'),
  UB('build-6', 'Grandma-Proof Office', 'quiet_desk', 'intel-core-i3-12100f', 'nvidia-geforce-gtx-1650', ['ASRock B660M-HDV', 'Crucial 16GB DDR4-3200', 'MX500 1TB', 'CX550M', 'Define Compact'], 520, 'budget', 198, 'Ten-year uptime target. No RGB, no drama, no dust (positive pressure filters).'),
  UB('build-7', 'Threadripper Render Node', 'farm_ops', 'amd-threadripper-7970x', 'nvidia-geforce-rtx-4080-super', ['ASRock TRX50 WS', 'Kingston 128GB DDR5-5200 ECC', '990 Pro 2TB x2', 'HX1200i', 'Enthoo Pro 2'], 6800, 'workstation', 176, 'Two-node farm for Octane. Remote-managed, redundant power.'),
  UB('build-8', 'APU Tiny Home Theater', 'htpc_dan', 'amd-ryzen-5-8600g', 'amd-radeon-760m', ['ASRock B650M-HDV/M.2', 'Flare X5 32GB DDR5-6000', 'P3 Plus 2TB', 'Rosewill 450 SFX', 'InWin A1'], 640, 'sff', 143, 'Plays everything at 720p-1080p low from the couch. Silent 14dB.')
];

// ---------------- Popular comparisons ----------------
const comparisons = [
  { a: 'amd-ryzen-7-7800x3d', b: 'intel-core-i7-14700k', type: 'cpu', searches: 18420 },
  { a: 'amd-ryzen-5-7600', b: 'intel-core-i5-14400f', type: 'cpu', searches: 15310 },
  { a: 'amd-ryzen-9-9950x', b: 'intel-core-i9-14900k', type: 'cpu', searches: 14280 },
  { a: 'amd-ryzen-5-5600', b: 'intel-core-i5-12400f', type: 'cpu', searches: 12905 },
  { a: 'amd-ryzen-9-7950x', b: 'amd-ryzen-9-9950x', type: 'cpu', searches: 11470 },
  { a: 'intel-core-i9-13900k', b: 'intel-core-i9-14900k', type: 'cpu', searches: 9860 },
  { a: 'amd-ryzen-7-9700x', b: 'amd-ryzen-7-7700x', type: 'cpu', searches: 8420 },
  { a: 'nvidia-geforce-rtx-4070-super', b: 'amd-radeon-rx-7800-xt', type: 'gpu', searches: 19840 },
  { a: 'nvidia-geforce-rtx-4060', b: 'amd-radeon-rx-7600', type: 'gpu', searches: 16220 },
  { a: 'nvidia-geforce-rtx-4080-super', b: 'nvidia-geforce-rtx-4090', type: 'gpu', searches: 13410 },
  { a: 'nvidia-geforce-rtx-3060-12gb', b: 'nvidia-geforce-rtx-4060', type: 'gpu', searches: 11230 },
  { a: 'amd-radeon-rx-6700-xt', b: 'amd-radeon-rx-7600', type: 'gpu', searches: 9110 },
  { a: 'nvidia-geforce-rtx-4070', b: 'nvidia-geforce-rtx-3080', type: 'gpu', searches: 8730 },
  { a: 'intel-arc-a750', b: 'amd-radeon-rx-6600', type: 'gpu', searches: 7420 }
];

// ---------------- Glossary ----------------
const GL = (term, acronym, category, definition) => ({ term, acronym, category, definition });
const glossary = [
  GL('Clock Speed', 'GHz', 'CPU', 'Number of cycles a core executes per second. Higher clocks mean more instructions per unit time, but IPC (instructions per cycle) matters equally — a 4 GHz Zen 4 crushes a 4 GHz Pentium 4.'),
  GL('Base / Boost Clock', '', 'CPU', 'Guaranteed all-core frequency vs. maximum opportunistic single-core frequency under power/thermal headroom.'),
  GL('Cores & Threads', '', 'CPU', 'Physical execution units vs logical streams (SMT/Hyper-Threading). More threads help parallel workloads; games mostly want fast cores.'),
  GL('Cache (L1/L2/L3)', '', 'CPU', 'On-chip SRAM hierarchy. L3 shared among cores; AMD 3D V-Cache stacks extra L3 vertically for massive gaming gains.'),
  GL('TDP', 'TDP', 'General', 'Thermal Design Power — the cooling requirement watts, not necessarily peak electrical draw. Intel now publishes PL1/PL2 power limits separately.'),
  GL('Process Node', 'nm', 'General', 'Semiconductor feature size label (5 nm, 3 nm...). Smaller generally means more transistors per watt, but marketing names diverge from physical dimensions.'),
  GL('Socket', '', 'Platform', 'Physical/electrical CPU interface (AM5, LGA 1700). Determines motherboard compatibility and often memory generation.'),
  GL('Chipset', '', 'Platform', 'Motherboard silicon providing I/O: PCIe lanes, USB, SATA, overclock permissions. Doesn’t affect raw CPU/GPU speed.'),
  GL('PCIe Lanes', 'PCIe', 'Platform', 'High-speed serial links. x16 for GPUs, x4 for NVMe. Version (3/4/5) doubles bandwidth per generation.'),
  GL('SMT', 'SMT', 'CPU', 'Simultaneous Multi-Threading (Intel calls it Hyper-Threading). Two instruction streams share one core’s resources, ~20–30% aggregate gain typically.'),
  GL('IPC', 'IPC', 'CPU', 'Instructions Per Cycle — architectural throughput. The main lever of generational CPU progress.'),
  GL('AVX-512 / AVX2', '', 'CPU', 'Wide vector instruction sets for scientific/AI workloads. Consumer chips vary: Zen 4 supports AVX-512 at reduced clocks; Raptor Lake disabled it.'),
  GL('XMP / EXPO', '', 'Memory', 'Stored overclock profiles for RAM. XMP is Intel-origin, EXPO is AMD’s equivalent; enabling either runs memory beyond JEDEC defaults.'),
  GL('CAS Latency', 'CL', 'Memory', 'Clock cycles for a column read. Real latency = CL ÷ (MT/s ÷ 2000) in nanoseconds — why DDR5-6000 CL30 ≈ 10 ns.'),
  GL('DIMM / UDIMM / SODIMM', '', 'Memory', 'Dual In-line Memory Module; U = unbuffered desktop; SO = small outline for laptops. Not interchangeable.'),
  GL('ECC Memory', 'ECC', 'Memory', 'Error-correcting code RAM detects/corrects bit flips. Requires mobo+CPU support; essential for servers/workstations.'),
  GL('VRAM', 'VRAM', 'GPU', 'Graphics memory. Capacity governs texture/resolution headroom; type/bus/bandwidth govern how fast it feeds the GPU.'),
  GL('Memory Bus Width', 'bit', 'GPU', 'Parallel channel count between GPU and VRAM. Bandwidth = bus × memory clock.'),
  GL('CUDA Cores / Stream Processors', '', 'GPU', 'Shader execution units. Comparable only within the same architecture family — cross-brand counts mislead.'),
  GL('Tensor / RT / AI Units', '', 'GPU', 'Fixed-function accelerators for matrix math (DLSS/AI) and ray-box intersections (ray tracing).'),
  GL('DLSS / FSR / XeSS / PSSR', '', 'Software', 'Upscaling suites: NVIDIA deep-learning, AMD spatial+ML, Intel ML, PlayStation Spectral Super Resolution. Render lower, reconstruct sharper.'),
  GL('Frame Generation', '', 'Software', 'Inserting synthetic frames between real ones (DLSS3/FSR3). Doubles perceived smoothness; adds latency and needs solid base FPS.'),
  GL('Ray Tracing', 'RT', 'GPU', 'Simulating light rays for reflections/shadows/GI. Costs huge compute; denoisers + upscalers make it practical.'),
  GL('Path Tracing', 'PT', 'GPU', 'Full-scene recursive ray simulation replacing raster entirely. Cyberpunk RT Ultra/Overdrive is the reference workload.'),
  GL('TDP vs Board Power', 'TBP/TGP', 'GPU', 'GPU power envelope; laptop variants (TGP) define actual performance of identically named mobile chips.'),
  GL('VRAM Overflow / Stutter', '', 'GPU', 'When textures exceed VRAM, spills to system RAM tank frametimes. Primary reason 8 GB cards age poorly.'),
  GL('NVMe / AHCI', '', 'Storage', 'Protocols for SSD transport. NVMe over PCIe unlocks SSD speed; AHCI is the SATA-era legacy path.'),
  GL('TBW', 'TBW', 'Storage', 'Terabytes Written endurance rating — warrantied total writes before cell wearout concerns.'),
  GL('DRAM Cache in SSDs', '', 'Storage', 'Buffer chip smoothing writes; DRAM-less drives rely on slower HMB — visible in sustained large transfers.'),
  GL('80 PLUS Ratings', '', 'Power', 'Efficiency certification brackets (Bronze→Titanium) at 20/50/100% load. Says little about electrical quality — a known loophole.'),
  GL('Modular PSU', '', 'Power', 'Cables detach for cleaner builds: semi vs full modular. SFX/SFX-L form factors serve small cases.'),
  GL('Transient Spikes', '', 'Power', 'Microsecond GPU power surges; ATX 3.0/3.1 spec mandates 2× TDP handling for two GPUs’ generations.'),
  GL('Curve Optimizer / Undervolting', '', 'Tuning', 'Shifting voltage-frequency curve downward for same clocks at less power/heat — the modern way to "overclock" efficiently.'),
  GL('PBO', 'PBO', 'Tuning', 'AMD Precision Boost Overdrive — raises power/current/thermal limits so boost algorithms go harder.'),
  GL('Delidding', '', 'Tuning', 'Removing CPU IHS to replace TIM with direct-die cooling. Big temps drop, big risk; voids warranty.'),
  GL('Bottleneck', '', 'General', 'When one component caps system performance. CPU-bound at low res/high FPS; GPU-bound at high res/settings.'),
  GL('Frametime / 1% Lows', '', 'Gaming', 'Average FPS hides hitches; 1%-low frametimes define perceived smoothness. Always check both.'),
  GL('Geometric Mean Index', '', 'Methodology', 'Our headline scores: GM of many normalized benchmarks — rewards balanced products, punishes narrow specialists.'),
  GL('Form Factor (ATX/mATX/ITX)', '', 'Platform', 'Board/case size standards. ITX trades expandability for footprint; E-ATX exceeds standard towers.'),
  GL('AIO / Custom Loop', '', 'Cooling', 'Sealed pump+radiator liquid kit vs. user-assembled loop. Custom cools more hardware, demands maintenance.'),
  GL('Static Pressure Fans', '', 'Cooling', 'High-pressure blade designs that push air through radiators/filters vs. open-flow volume fans.'),
  GL('UEFI / BIOS', '', 'Platform', 'Modern firmware interface replacing legacy BIOS: mouse input, networking, secure boot, larger boot disks.'),
  GL('Secure Boot / TPM', '', 'Security', 'Boot-chain signature enforcement + hardware root of trust. Required for certain OS installs and anti-cheat.'),
  GL('Resizable BAR', 'ReBAR', 'GPU', 'PCIe feature letting CPU access all GPU VRAM at once — free 3–8% in many titles when enabled.'),
  GL('Hyper-Threading Pitfalls', '', 'CPU', 'SMT siblings share execution units; some security flaws (downfall-class) exploit shared state — patches can cost performance.')
];

// ---------------- Testimonials ----------------
const testimonials = [
  { name: 'Kateřína N.', role: 'Esports team manager', text: 'We specced six team rigs with the Builder in twenty minutes. Compatibility warnings caught a cooler clash our old vendor shipped.', rating: 5 },
  { name: 'Marcus B.', role: 'Freelance video editor', text: 'The price-history charts saved me €400 timing a 7950X purchase. Nothing else tracks street prices this cleanly.', rating: 5 },
  { name: 'Devansh P.', role: 'CS student', text: 'Comparison pages with percent deltas are exactly what I wanted for my first build. The glossary taught me enough to argue with shop staff.', rating: 4 },
  { name: 'Sofia R.', role: 'Retro hardware collector', text: 'They actually index Pentium 4 and HD 7970 era parts. Historical section is a museum with charts.', rating: 5 },
  { name: 'Tomáš H.', role: 'IT technician', text: 'Offline mode is the killer feature — I spec upgrades in basements with no signal. Works like a native app.', rating: 5 },
  { name: 'Yuki M.', role: 'Indie game developer', text: 'Game benchmark DB helped me pick minimum-spec targets that don’t alienate 60% of my players.', rating: 4 }
];

W('articles.json', articles);
W('news.json', news);
W('reviews.json', reviews);
W('users.json', builds);
W('comparisons.json', comparisons);
W('glossary.json', glossary);
W('authors.json', authors);
W('testimonials.json', testimonials);
console.log(`Generated ${articles.length} articles, ${news.length} news, ${reviews.length} reviews, ${builds.length} builds, ${comparisons.length} comparison pairs, ${glossary.length} glossary terms`);
