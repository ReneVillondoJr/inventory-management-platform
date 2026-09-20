import { Card, CardContent } from '@/components/ui/card';

import type { ReportSummaryItem } from '../types/report';

type ReportSummaryProps = {
  items: readonly ReportSummaryItem[];
};

export function ReportSummary({ items }: ReportSummaryProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label}>
            <CardContent className='p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <p className='text-sm text-muted-foreground'>{item.label}</p>

                  <p className='mt-2 truncate text-2xl font-semibold tracking-tight tabular-nums'>
                    {item.value}
                  </p>

                  {item.helper ?
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {item.helper}
                    </p>
                  : null}
                </div>

                <div className='rounded-lg border bg-muted/40 p-2.5'>
                  <Icon className='size-4 text-muted-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
