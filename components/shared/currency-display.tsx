type CurrencyDisplayProps = {
  value: number | null | undefined;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
  fallback?: string;
};

export function CurrencyDisplay({
  value,
  currency = 'PHP',
  locale = 'en-PH',
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  className,
  fallback = '—',
}: CurrencyDisplayProps) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return <span className={className}>{fallback}</span>;
  }

  const minDigits = Math.max(0, Math.min(20, minimumFractionDigits));

  const maxDigits = Math.max(minDigits, Math.min(20, maximumFractionDigits));

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(value);

  return <span className={`${className ?? ''} tabular-nums`}>{formatted}</span>;
}
