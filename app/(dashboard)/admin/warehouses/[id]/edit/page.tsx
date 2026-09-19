'use client';

import { use } from 'react';

import { notFound } from 'next/navigation';

import { WarehouseForm, warehouseService } from '@/modules/warehouses';

type EditWarehousePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditWarehousePage({ params }: EditWarehousePageProps) {
  const { id } = use(params);

  const warehouse = warehouseService.getById(id);

  if (!warehouse) {
    notFound();
  }

  return (
    <div>
      <WarehouseForm warehouse={warehouse} />
    </div>
  );
}
