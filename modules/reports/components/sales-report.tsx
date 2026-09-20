import { ShoppingCart } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { EmptyState } from '@/components/shared/empty-state';

import type { SalesReportData } from '../types/report';

type SalesReportProps = {
  report: SalesReportData;
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

export function SalesReport({ report }: SalesReportProps) {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader className='border-b'>
          <div className='flex items-start gap-3'>
            <div className='rounded-lg border bg-muted/40 p-2'>
              <ShoppingCart className='size-4 text-muted-foreground' />
            </div>

            <div>
              <h2 className='text-base font-semibold'>Customer Performance</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Sales activity grouped by customer.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          {report.customers.length === 0 ?
            <div className='p-6'>
              <EmptyState
                title='No sales data found'
                description='Try expanding the date range or changing the warehouse.'
              />
            </div>
          : <div className='overflow-x-auto'>
              <table className='w-full min-w-[720px] text-sm'>
                <thead className='border-b bg-muted/30'>
                  <tr className='text-left'>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Customer
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Orders
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Open
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Completed
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Total Value
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.customers.map((customer) => (
                    <tr
                      key={customer.customerName}
                      className='border-b last:border-0'
                    >
                      <td className='px-4 py-3 font-medium'>
                        {customer.customerName}
                      </td>

                      <td className='px-4 py-3 text-right tabular-nums'>
                        {formatNumber(customer.orderCount)}
                      </td>

                      <td className='px-4 py-3 text-right tabular-nums'>
                        {formatNumber(customer.openOrders)}
                      </td>

                      <td className='px-4 py-3 text-right tabular-nums'>
                        {formatNumber(customer.completedOrders)}
                      </td>

                      <td className='px-4 py-3 text-right font-medium tabular-nums'>
                        <CurrencyDisplay value={customer.totalValue} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='border-b'>
          <div>
            <h2 className='text-base font-semibold'>Sales Orders</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Detailed customer order activity for the selected period.
            </p>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          {report.orders.length === 0 ?
            <div className='p-6'>
              <EmptyState
                title='No sales orders found'
                description='No sales orders match the selected filters.'
              />
            </div>
          : <div className='overflow-x-auto'>
              <table className='w-full min-w-[900px] text-sm'>
                <thead className='border-b bg-muted/30'>
                  <tr className='text-left'>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Order
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Customer
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Warehouse
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Order Date
                    </th>
                    <th className='px-4 py-3 font-medium text-muted-foreground'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-right font-medium text-muted-foreground'>
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.orders.map((order) => (
                    <tr key={order.id} className='border-b last:border-0'>
                      <td className='px-4 py-3'>
                        <p className='font-medium'>{order.number || '—'}</p>
                        <p className='text-xs text-muted-foreground'>
                          {formatNumber(order.itemCount)} line items
                        </p>
                      </td>

                      <td className='px-4 py-3'>{order.customerName || '—'}</td>

                      <td className='px-4 py-3'>
                        <p>{order.warehouseName || '—'}</p>

                        {order.warehouseCode ?
                          <p className='text-xs text-muted-foreground'>
                            {order.warehouseCode}
                          </p>
                        : null}
                      </td>

                      <td className='px-4 py-3'>
                        {formatDate(order.orderDate)}
                      </td>

                      <td className='px-4 py-3'>
                        <Badge variant='outline'>{order.status}</Badge>
                      </td>

                      <td className='px-4 py-3 text-right font-medium tabular-nums'>
                        <CurrencyDisplay value={order.total} />
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
