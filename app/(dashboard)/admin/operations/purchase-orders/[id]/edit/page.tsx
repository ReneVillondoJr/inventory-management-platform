import { notFound } from 'next/navigation';

import {
  PurchaseOrderForm,
  purchaseOrderService,
} from '@/modules/purchase-orders';

type PurchaseOrderEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PurchaseOrderEditPage({
  params,
}: PurchaseOrderEditPageProps) {
  const { id } = await params;

  const purchaseOrder = purchaseOrderService.getById(id);

  if (!purchaseOrder) {
    notFound();
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Operations
        </p>

        <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
          Edit Purchase Order
        </h1>

        <p className='mt-1 text-sm text-muted-foreground'>
          Update supplier, warehouse, dates, and ordered items.
        </p>
      </div>

      <PurchaseOrderForm purchaseOrder={purchaseOrder} />
    </div>
  );
}
