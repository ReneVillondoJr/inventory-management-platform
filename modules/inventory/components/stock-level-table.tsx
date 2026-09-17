import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { InventoryRecord, InventoryStatus } from '../types/inventory';

type StockLevelTableProps = {
  inventory: InventoryRecord[];
};

const statusConfig: Record<
  InventoryStatus,
  {
    label: string;
    className: string;
  }
> = {
  IN_STOCK: {
    label: 'In stock',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  LOW_STOCK: {
    label: 'Low stock',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  OUT_OF_STOCK: {
    label: 'Out of stock',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function StockLevelTable({ inventory }: StockLevelTableProps) {
  if (!inventory.length) {
    return (
      <div className='flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border/60'>
        <div className='text-center'>
          <p className='text-sm font-medium'>No inventory found</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Try adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-border/60 bg-background'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/30 hover:bg-muted/30'>
            <TableHead className='px-4'>Product</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reorder</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className='w-10' />
          </TableRow>
        </TableHeader>

        <TableBody>
          {inventory.map((item) => {
            const status = statusConfig[item.status];

            return (
              <TableRow key={item.id} className='group'>
                <TableCell className='px-4'>
                  <div className='min-w-0'>
                    <Link
                      href={`/admin/inventory/products/${item.productId}`}
                      className='font-medium transition-colors hover:text-primary'
                    >
                      {item.productName}
                    </Link>

                    <div className='mt-0.5 flex items-center gap-2 text-xs text-muted-foreground'>
                      <span>{item.sku}</span>
                      <span>•</span>
                      <span>{item.brandName}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <p className='text-sm'>{item.warehouseName}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.warehouseCode}
                    </p>
                  </div>
                </TableCell>

                <TableCell className='font-medium'>
                  {item.quantity.toLocaleString()}
                </TableCell>

                <TableCell>{item.availableQuantity.toLocaleString()}</TableCell>

                <TableCell>
                  <Badge
                    variant='outline'
                    className={`rounded-full px-2.5 py-0.5 text-[11px] ${status.className}`}
                  >
                    {status.label}
                  </Badge>
                </TableCell>

                <TableCell>{item.reorderLevel}</TableCell>

                <TableCell className='font-medium'>
                  {formatCurrency(item.inventoryValue)}
                </TableCell>

                <TableCell>
                  <Link
                    href={`/admin/inventory/stock-movements?product=${item.productId}`}
                    aria-label={`View ${item.productName} movements`}
                    className='flex size-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100'
                  >
                    <ArrowUpRight className='size-4' />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
