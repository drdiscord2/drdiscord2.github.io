import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('shimmer', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="glass p-4">
      <Skeleton className="mb-3 h-5 w-2/3" />
      <Skeleton className="mb-2 h-3 w-1/3" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function ListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return <div className="shimmer w-full" style={{ height }} />;
}

export function EmptyState({ title, body, hint, action, icon }: { title: string; body?: string; hint?: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="glass flex flex-col items-center justify-center gap-2 rounded-xl p-10 text-center">
      <div className="text-3xl opacity-60" aria-hidden>{icon ?? '🔍'}</div>
      <h3 className="font-display text-lg font-bold text-ink-100">{title}</h3>
      <p className="max-w-md text-sm text-ink-400">{body ?? hint ?? 'Nothing to show here yet.'}</p>
      {action}
    </div>
  );
}
