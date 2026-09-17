import { ProductForm } from '@/modules/products';

export default function NewProductPage() {
  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Inventory
        </p>

        <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
          New Product
        </h1>

        <p className='mt-1 text-sm text-muted-foreground'>
          Add a product to the inventory catalog.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
