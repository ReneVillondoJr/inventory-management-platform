import { PackageSearch } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { EmptyState } from '@/components/shared/empty-state';

import type { InventoryReportData } from '../types/report';

type InventoryReportProps = {
  report: InventoryReportData;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function InventoryReport({ report }: InventoryReportProps) {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader className='border-b'>
          <div className='flex items-start gap-3'>
            <div className='rounded-lg border bg-muted/40 p-2'>
              <PackageSearch className='size-4 text-muted-foreground' />
            </div>

            <div>
              <h2 className='text-base font-semibold'>Inventory Snapshot</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Current stock position by warehouse and product.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          {report.rows.length === 0 ?
            <div className='p-6'>
              <EmptyState
                title='No inventory records found'
                description='Try adjusting the search or warehouse filter.'
              />
            </div>
          : <div className='overflow-x-auto'>
              <table className='w-full min-w-[920px] text-sm'>
                <thead className='border-b bg-muted/30'>
                  <tr className='text-left'>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Product
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Warehouse
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Category
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      On Hand
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Reorder
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Unit Cost
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Inventory Value
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.rows.map((row) => (
                    <tr
                      key={`${row.warehouseId}-${row.productId}`}
                      className='border-b last:border-0'
                    >
                      <td className='px-4 py-3'>
                        <div>
                          <p className='font-medium'>
                            {row.productName || 'Unnamed product'}
                          </p>

                          <p className='text-xs text-muted-foreground'>
                            {row.sku || 'No SKU'}
                          </p>
                        </div>
                      </td>

                      <td className='px-4 py-3'>{row.warehouseName || '—'}</td>

                      <td className='px-4 py-3 text-muted-foreground'>
                        {row.categoryName || '—'}
                      </td>

                      <td className='px-4 py-3 text-right font-medium tabular-nums'>
                        {formatNumber(row.quantity)} {row.unit}
                      </td>

                      <td className='px-4 py-3 text-right tabular-nums'>
                        {formatNumber(row.reorderLevel)}
                      </td>

                      <td className='px-4 py-3 text-right tabular-nums'>
                        <CurrencyDisplay
                          value={row.costPrice}
                          minimumFractionDigits={2}
                          maximumFractionDigits={2}
                        />
                      </td>

                      <td className='px-4 py-3 text-right font-medium tabular-nums'>
                        <CurrencyDisplay
                          value={row.inventoryValue}
                          minimumFractionDigits={2}
                          maximumFractionDigits={2}
                        />
                      </td>

                      <td className='px-4 py-3'>
                        <Badge
                          variant={
                            row.status === 'OUT_OF_STOCK' ? 'destructive'
                            : row.status === 'LOW_STOCK' ?
                              'secondary'
                            : 'outline'
                          }
                        >
                          {row.status === 'OUT_OF_STOCK' ?
                            'Out of stock'
                          : row.status === 'LOW_STOCK' ?
                            'Low stock'
                          : 'In stock'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </CardContent>

        <div className='border-t px-4 py-3 text-xs text-muted-foreground'>
          Current inventory snapshot · {formatNumber(report.rows.length)}{' '}
          inventory rows
        </div>
      </Card>
    </div>
  );
}
