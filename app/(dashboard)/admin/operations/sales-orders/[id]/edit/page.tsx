'use client';

import { use } from 'react';

import { notFound } from 'next/navigation';

import { SalesOrderForm } from '@/modules/sales-orders';
import { salesOrderService } from '@/modules/sales-orders';

type EditSalesOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditSalesOrderPage({
  params,
}: EditSalesOrderPageProps) {
  const { id } = use(params);

  const salesOrder = salesOrderService.getById(id);

  if (!salesOrder) {
    notFound();
  }

  return (
    <main>
      <SalesOrderForm salesOrder={salesOrder} />
    </main>
  );
}
