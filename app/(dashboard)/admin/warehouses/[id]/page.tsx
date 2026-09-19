'use client';

import { use } from 'react';

import { WarehouseDetails } from '@/modules/warehouses';

type WarehousePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function WarehousePage({ params }: WarehousePageProps) {
  const { id } = use(params);

  return (
    <div>
      <WarehouseDetails id={id} />
    </div>
  );
}
