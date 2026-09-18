import { Badge } from '@/components/ui/badge';

type StatusBadgeProps = {
  status: string;
  label?: string;
  className?: string;
};

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split(/[_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'COMPLETED':
    case 'RECEIVED':
    case 'APPROVED':
    case 'CONFIRMED':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300';

    case 'PROCESSING':
    case 'PARTIALLY_RECEIVED':
    case 'PENDING':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300';

    case 'INACTIVE':
    case 'CANCELLED':
    case 'REJECTED':
    case 'FAILED':
      return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300';

    case 'DRAFT':
    case 'ARCHIVED':
      return 'border-border bg-muted text-muted-foreground';

    default:
      return 'border-border bg-muted/60 text-muted-foreground';
  }
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge
      variant='outline'
      className={`${getStatusClass(status)} ${className ?? ''}`}
    >
      {label ?? formatStatus(status)}
    </Badge>
  );
}
