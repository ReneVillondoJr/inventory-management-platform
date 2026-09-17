import { ArrowDown, ArrowLeftRight, ArrowUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { StockMovementWithDetails } from '../types/stock-movement';

type StockMovementTableProps = {
  movements: StockMovementWithDetails[];
};

function getMovementLabel(type: StockMovementWithDetails['type']) {
  switch (type) {
    case 'IN':
      return 'Stock in';
    case 'OUT':
      return 'Stock out';
    case 'ADJUSTMENT':
      return 'Adjustment';
  }
}

function getReferenceLabel(type: StockMovementWithDetails['referenceType']) {
  switch (type) {
    case 'PURCHASE_RECEIPT':
      return 'Purchase receipt';
    case 'SALES_ORDER':
      return 'Sales order';
    case 'STOCK_TRANSFER':
      return 'Stock transfer';
    case 'RETURN':
      return 'Return';
    case 'INVENTORY_ADJUSTMENT':
      return 'Inventory adjustment';
  }
}

export function StockMovementTable({ movements }: StockMovementTableProps) {
  if (!movements.length) {
    return (
      <div className='flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border/60'>
        <div className='text-center'>
          <p className='text-sm font-medium'>No stock movements found</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Movement history will appear here.
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
            <TableHead className='px-4'>Movement</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Performed by</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {movements.map((movement) => {
            const isPositive = movement.type === 'IN';

            const isAdjustment = movement.type === 'ADJUSTMENT';

            const quantity = Math.abs(movement.quantity);

            return (
              <TableRow key={movement.id}>
                <TableCell className='px-4'>
                  <div className='flex items-center gap-2.5'>
                    <div className='flex size-8 items-center justify-center rounded-lg bg-muted'>
                      {isAdjustment ?
                        <ArrowLeftRight className='size-4 text-muted-foreground' />
                      : isPositive ?
                        <ArrowUp className='size-4 text-emerald-600' />
                      : <ArrowDown className='size-4 text-red-600' />}
                    </div>

                    <div>
                      <p className='text-sm font-medium'>
                        {getMovementLabel(movement.type)}
                      </p>

                      <p className='text-xs text-muted-foreground'>
                        {movement.id}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <p className='font-medium'>{movement.productName}</p>

                    <p className='text-xs text-muted-foreground'>
                      {movement.sku}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <p className='text-sm'>{movement.warehouseName}</p>

                    <p className='text-xs text-muted-foreground'>
                      {movement.warehouseCode}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant='outline' className='rounded-full text-[10px]'>
                    {getReferenceLabel(movement.referenceType)}
                  </Badge>

                  <p className='mt-1 text-xs text-muted-foreground'>
                    {movement.referenceId}
                  </p>
                </TableCell>

                <TableCell>
                  <span
                    className={
                      movement.quantity >= 0 ?
                        'font-semibold text-emerald-700'
                      : 'font-semibold text-red-700'
                    }
                  >
                    {movement.quantity >= 0 ? '+' : '-'}
                    {quantity.toLocaleString()}
                  </span>
                </TableCell>

                <TableCell>{movement.performedByName}</TableCell>

                <TableCell className='text-xs text-muted-foreground'>
                  {new Intl.DateTimeFormat('en-PH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(movement.movementDate))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
