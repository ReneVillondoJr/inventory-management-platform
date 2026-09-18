type DateDisplayProps = {
  value?: string | Date | null;
  locale?: string;
  dateStyle?: 'short' | 'medium' | 'long';
  className?: string;
  fallback?: string;
};

const dateStyleOptions: Record<
  DateDisplayProps['dateStyle'] extends infer T ?
    T extends string ?
      T
    : never
  : never,
  Intl.DateTimeFormatOptions
> = {
  short: {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  },
  medium: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
  long: {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
};

export function DateDisplay({
  value,
  locale = 'en-PH',
  dateStyle = 'medium',
  className,
  fallback = '—',
}: DateDisplayProps) {
  if (!value) {
    return <span className={className}>{fallback}</span>;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return <span className={className}>{fallback}</span>;
  }

  return (
    <time dateTime={date.toISOString()} className={className}>
      {date.toLocaleDateString(locale, dateStyleOptions[dateStyle])}
    </time>
  );
}
