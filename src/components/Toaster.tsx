import { useAppStore } from '@/store/useAppStore';
import { CheckIcon, AlertIcon, InfoIcon, XIcon } from '@/components/icons';

export function Toaster() {
  const toasts = useAppStore((s) => s.toasts);
  const dismiss = useAppStore((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`glass pointer-events-auto flex items-start gap-3 p-3 text-sm shadow-glow ${
            t.kind === 'error' ? 'border-red-500/40' : t.kind === 'info' ? 'border-sky-500/40' : 'border-emerald-500/40'
          }`}
        >
          <span className={t.kind === 'error' ? 'text-red-400' : t.kind === 'info' ? 'text-sky-400' : 'text-emerald-400'}>
            {t.kind === 'error' ? <AlertIcon size={16} /> : t.kind === 'info' ? <InfoIcon size={16} /> : <CheckIcon size={16} />}
          </span>
          <p className="flex-1 text-ink-100">{t.text}</p>
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="text-ink-400 hover:text-ink-100">
            <XIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
