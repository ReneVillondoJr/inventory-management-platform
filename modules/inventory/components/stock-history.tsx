'use client';

import { useMemo, useState } from 'react';

import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select';

import { inventoryService } from '../services/inventory-service';

import type {
  StockMovementFilters,
  StockMovementType,
} from '../types/stock-movement';

import { StockMovementTable } from './stock-movement-table';

const initialFilters: StockMovementFilters = {
  search: '',
  warehouseId: 'ALL',
  productId: 'ALL',
  type: 'ALL',
};

export function StockHistory() {
  const [filters, setFilters] = useState<StockMovementFilters>(initialFilters);

  const movements = inventoryService.getMovements();

  const products = Array.from(
    new Map(
      movements.map((movement) => [
        movement.productId,
        {
          id: movement.productId,
          name: movement.productName,
        },
      ]),
    ).values(),
  );

  const warehouses = Array.from(
    new Map(
      movements.map((movement) => [
        movement.warehouseId,
        {
          id: movement.warehouseId,
          name: movement.warehouseName,
        },
      ]),
    ).values(),
  );

  const filteredMovements = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return movements.filter((movement) => {
      const matchesSearch =
        !search ||
        movement.productName.toLowerCase().includes(search) ||
        movement.sku.toLowerCase().includes(search) ||
        movement.referenceId.toLowerCase().includes(search) ||
        movement.warehouseName.toLowerCase().includes(search) ||
        movement.performedByName.toLowerCase().includes(search);

      const matchesWarehouse =
        filters.warehouseId === 'ALL' ||
        movement.warehouseId === filters.warehouseId;

      const matchesProduct =
        filters.productId === 'ALL' || movement.productId === filters.productId;

      const matchesType =
        filters.type === 'ALL' || movement.type === filters.type;

      return matchesSearch && matchesWarehouse && matchesProduct && matchesType;
    });
  }, [filters, movements]);

  return (
    <div className='space-y-5'>
      <div>
        <h2 className='text-sm font-semibold'>Stock movement history</h2>

        <p className='mt-1 text-xs text-muted-foreground'>
          Complete inventory movement ledger across warehouses.
        </p>
      </div>

      <div className='grid gap-3 lg:grid-cols-[1fr_200px_200px_160px]'>
        <div className='relative'>
          <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder='Search movement history...'
            className='h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20'
          />
        </div>

        <Select
          value={filters.warehouseId}
          onValueChange={(value) =>
            setFilters((current) => ({ ...current, warehouseId: value ?? '' }))
          }
        >
          <SelectTrigger className='h-10 w-full'>
            <SelectValue placeholder='All warehouses' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>All warehouses</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.productId}
          onValueChange={(value) =>
            setFilters((current) => ({ ...current, productId: value ?? '' }))
          }
        >
          <SelectTrigger className='h-10 w-full'>
            <SelectValue placeholder='All products' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>All products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type}
          onValueChange={(value) =>
            setFilters((current) => ({
              ...current,
              type: value as 'ALL' | StockMovementType,
            }))
          }
        >
          <SelectTrigger className='h-10 w-full'>
            <SelectValue placeholder='All movements' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>All movements</SelectItem>
            <SelectItem value='IN'>Stock in</SelectItem>
            <SelectItem value='OUT'>Stock out</SelectItem>
            <SelectItem value='ADJUSTMENT'>Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className='border-border/60 shadow-none'>
        <CardContent className='p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Movement ledger</p>

              <p className='text-xs text-muted-foreground'>
                {filteredMovements.length} movements
              </p>
            </div>

            <Badge variant='outline' className='rounded-full'>
              Audit trail
            </Badge>
          </div>

          <StockMovementTable movements={filteredMovements} />
        </CardContent>
      </Card>
    </div>
  );
}
