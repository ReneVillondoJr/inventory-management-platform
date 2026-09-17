import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/layout/page-header';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className='space-y-6'>
      <PageHeader
        title='Administration'
        description='Manage your inventory operations, team, orders, and reporting workflows.'
        actions={
          <div className='inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground'>
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            System online
          </div>
        }
      />

      <Breadcrumbs />

      <div className='space-y-6'>{children}</div>
    </div>
  );
}
