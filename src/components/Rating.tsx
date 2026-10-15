import { useState } from 'react';
import { StarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export function Rating({ value, onChange, size = 18, readOnly }: { value: number; onChange?: (v: number) => void; size?: number; readOnly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5" role={readOnly ? undefined : 'radiogroup'} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" disabled={readOnly} aria-label={`${s} star${s > 1 ? 's' : ''}`} aria-checked={value === s} role={readOnly ? undefined : 'radio'}
          onMouseEnter={() => !readOnly && setHover(s)} onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => onChange?.(s)}
          className={cn('transition-transform', !readOnly && 'hover:scale-125 cursor-pointer')}>
          <StarIcon size={size} fill={(hover || value) >= s ? 'currentColor' : 'none'} className={(hover || value) >= s ? 'text-accent' : 'text-ink-600'} />
        </button>
      ))}
    </div>
  );
}
