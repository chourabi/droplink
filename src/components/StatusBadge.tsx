import { cn } from '@/lib/utils';
import type { DeliveryStatus } from '@/types';

const config: Record<DeliveryStatus, { label: string; className: string; dot: string }> = {
  waiting_location: {
    label: 'En attente de position',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  location_received: {
    label: 'Position reçue',
    className: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  delivered: {
    label: 'Livré',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
};

export default function StatusBadge({ status, className }: { status: DeliveryStatus; className?: string }) {
  const c = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        c.className,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}
