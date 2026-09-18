import { PurchaseOrderForm } from '@/modules/purchase-orders';

export default function NewPurchaseOrderPage() {
  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Operations
        </p>

        <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
          New Purchase Order
        </h1>

        <p className='mt-1 text-sm text-muted-foreground'>
          Create a supplier order for inventory replenishment.
        </p>
      </div>

      <PurchaseOrderForm />
    </div>
  );
}
