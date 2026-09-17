import Link from 'next/link';

export function CategoryList() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
            Categories
          </p>
          <h1 className='mt-1 text-2xl font-semibold tracking-tight'>
            Category catalog
          </h1>
        </div>

        <Link
          href='/admin/inventory/categories/new'
          className='inline-flex items-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted'
        >
          New category
        </Link>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-6 text-sm text-muted-foreground'>
        Category management is ready for the catalog view.
      </div>
    </div>
  );
}

export function CategoryCreateView() {
  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Categories
        </p>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight'>
          Add category
        </h1>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-6 text-sm text-muted-foreground'>
        Category creation form placeholder.
      </div>
    </div>
  );
}

export function CategoryEditView({ id }: { id: string }) {
  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Categories
        </p>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight'>
          Edit category
        </h1>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-6 text-sm text-muted-foreground'>
        Editing category {id}.
      </div>
    </div>
  );
}
