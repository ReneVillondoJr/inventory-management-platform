import type { LucideIcon } from 'lucide-react';

import { AlertTriangle, Boxes, PackageCheck, Warehouse } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/shared/currency-display';

type InventorySummaryData = {
  totalProducts: number;
  totalUnits: number;
  totalAvailableUnits: number;
  totalInventoryValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  warehouseCount: number;
};

type InventorySummaryCard = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
};

type InventorySummaryProps = {
  summary: InventorySummaryData;
};

export function InventorySummary({ summary }: InventorySummaryProps) {
  const cards: InventorySummaryCard[] = [
    {
      label: 'Total products',
      value: summary.totalProducts,
      description: 'Unique products',
      icon: PackageCheck,
    },
    {
      label: 'Total units',
      value: summary.totalUnits,
      description: `${summary.totalAvailableUnits} available`,
      icon: Boxes,
    },
    {
      label: 'Inventory value',
      value: '',
      description: 'At cost value',
      icon: Boxes,
    },
    {
      label: 'Low stock',
      value: summary.lowStockItems,
      description: `${summary.outOfStockItems} out of stock`,
      icon: AlertTriangle,
    },
    {
      label: 'Warehouses',
      value: summary.warehouseCount,
      description: 'Active locations',
      icon: Warehouse,
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {cards.map(({ label, value, description, icon: Icon }) => (
        <Card key={label} className='border-border/60 shadow-none'>
          <CardContent className='p-5'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-xs font-medium text-muted-foreground'>
                  {label}
                </p>

                {label === 'Inventory value' ?
                  <p className='mt-2 truncate text-xl font-semibold tracking-tight'>
                    <CurrencyDisplay
                      value={summary.totalInventoryValue}
                      maximumFractionDigits={0}
                    />
                  </p>
                : <p className='mt-2 truncate text-2xl font-semibold tracking-tight tabular-nums'>
                    {value}
                  </p>
                }

                <p className='mt-1 text-[11px] text-muted-foreground'>
                  {description}
                </p>
              </div>

              <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted'>
                <Icon className='size-4 text-muted-foreground' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
