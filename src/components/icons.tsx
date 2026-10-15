import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (p: IconProps) => ({
  width: p.size ?? 18,
  height: p.size ?? 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p
});

export const CpuIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>
);
export const GpuIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/><circle cx="9" cy="12" r="2.5"/><circle cx="15.5" cy="12" r="1.5"/><path d="M7 6V4h8v2"/></svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
);
export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
);
export const XIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12"/></svg>
);
export const SunIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
);
export const MoonIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6"/></svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m9 18 6-6-6-6"/></svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);
export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14"/></svg>
);
export const MinusIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14"/></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5"/></svg>
);
export const StarIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>
);
export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .9-4.5 2.4C10.5 3.9 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7z"/></svg>
);
export const ScaleIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3v18M8 21h8M6 7l-4 7h8zM18 7l-4 7h8zM6 7l6-2 6 2"/></svg>
);
export const BoltIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M13 2 3 14h7l-1 8 12-14h-7z"/></svg>
);
export const WrenchIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6l-3.6 3.6-2.4-2.4z"/></svg>
);
export const BookIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>
);
export const NewspaperIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 4h13v16H6a2 2 0 0 1-2-2z"/><path d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/><path d="M7 8h7M7 12h7M7 16h4"/></svg>
);
export const UsersIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 20a5.5 5.5 0 0 1 6.5-5"/></svg>
);
export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></svg>
);
export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3 2 21h20zM12 10v5M12 18v.01"/></svg>
);
export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>
);
export const ShareIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m8.7 10.7 6.6-3.4M8.7 13.3l6.6 3.4"/></svg>
);
export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
export const GridIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
);
export const ListIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
);
export const TableIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/></svg>
);
export const FilterIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>
);
export const TrophyIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0z"/><path d="M7 6H4a2 2 0 0 0 2 4h1M17 6h3a2 2 0 0 1-2 4h-1"/></svg>
);
export const TrendingUpIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m2 18 7-7 4 4 9-9"/><path d="M15 6h7v7"/></svg>
);
export const ThermometerIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/></svg>
);
export const GamepadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>
);
export const MemoryIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 7v10M11 7v10M15 7v10M19 7v10M3 17v2M21 17v2M3 5v2M21 5v2"/></svg>
);
export const HardDriveIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="2" y="12" width="20" height="8" rx="2"/><path d="m5 12 3-7h8l3 7"/><path d="M6 16h.01M10 16h.01"/></svg>
);
export const PlugIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/></svg>
);
export const BoxIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m12 2 8 4.5v11L12 22l-8-4.5v-11z"/><path d="M12 7v11M4 6.5 12 11l8-4.5"/></svg>
);
export const FanIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 1-7 4-7s4 4 0 6M14 12c4 0 7 1 7 4s-4 4-6 0M12 14c0 4-1 7-4 7s-4-4 0-6M10 12c-4 0-7-1-7-4s4-4 6 0"/></svg>
);
export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>
);
export const ExternalIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);
export const WifiOffIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m2 2 20 20M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.7M1.4 9.4a15 15 0 0 1 4.6-2.9M22.6 9.4a15 15 0 0 0-9-4.3M19 12.9a10 10 0 0 0-2.3-1.6M12 20h.01"/></svg>
);
export const PrinterIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
);
export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
);
export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
);
export const TagIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 2H2v10l9.3 9.3a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8z"/><circle cx="7" cy="7" r="1.5"/></svg>
);
export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
);
export const SaveIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
);
export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>
);
export const RefreshIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/></svg>
);
export const ZapIcon = BoltIcon;
