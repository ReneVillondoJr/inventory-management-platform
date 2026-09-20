import { ArrowDownToLine, ArrowUpFromLine, Boxes } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';

import type { StockMovementReportData } from '../types/report';

type StockMovementReportProps = {
  report: StockMovementReportData;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) {
    return '—';
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function StockMovementReport({ report }: StockMovementReportProps) {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader className='border-b'>
          <div className='flex items-start gap-3'>
            <div className='rounded-lg border bg-muted/40 p-2'>
              <Boxes className='size-4 text-muted-foreground' />
            </div>

            <div>
              <h2 className='text-base font-semibold'>Stock Movement Log</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Recent movement activity across warehouses.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          {report.rows.length === 0 ?
            <div className='p-6'>
              <EmptyState
                title='No stock movements found'
                description='Try adjusting the search or warehouse filter.'
              />
            </div>
          : <div className='overflow-x-auto'>
              <table className='w-full min-w-[920px] text-sm'>
                <thead className='border-b bg-muted/30'>
                  <tr className='text-left'>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Date
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Movement
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Reference
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Product
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Warehouse
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Quantity
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Direction
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.rows.map((movement) => (
                    <tr key={movement.id} className='border-b last:border-0'>
                      <td className='px-4 py-3'>{formatDate(movement.date)}</td>

                      <td className='px-4 py-3'>
                        <Badge variant='outline'>{movement.movementType}</Badge>
                      </td>

                      <td className='px-4 py-3'>
                        {movement.referenceNumber || '—'}
                      </td>

                      <td className='px-4 py-3'>
                        <div>
                          <p className='font-medium'>
                            {movement.productName || 'Unnamed product'}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {movement.sku || 'No SKU'}
                          </p>
                        </div>
                      </td>

                      <td className='px-4 py-3'>
                        {movement.warehouseName || '—'}
                      </td>

                      <td className='px-4 py-3 text-right font-medium tabular-nums'>
                        {formatNumber(movement.quantity)}
                      </td>

                      <td className='px-4 py-3'>
                        {movement.direction === 'IN' ?
                          <span className='inline-flex items-center gap-1 text-emerald-600'>
                            <ArrowDownToLine className='size-3.5' /> Inbound
                          </span>
                        : movement.direction === 'OUT' ?
                          <span className='inline-flex items-center gap-1 text-rose-600'>
                            <ArrowUpFromLine className='size-3.5' /> Outbound
                          </span>
                        : <span className='text-muted-foreground'>Neutral</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}
