import { notFound } from 'next/navigation';

import { ProductForm, productService } from '@/modules/products';

type ProductEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { id } = await params;

  const product = productService.getById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Inventory
        </p>

        <h1 className='mt-1 text-2xl font-semibold tracking-tight sm:text-3xl'>
          Edit Product
        </h1>

        <p className='mt-1 text-sm text-muted-foreground'>
          Update product information and inventory settings.
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
