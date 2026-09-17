import type { ReactNode } from 'react';

import { AdminHeader } from '@/components/layout/admin-header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { RoleGuard } from '@/components/providers/role-guard';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard>
      <SidebarProvider defaultOpen>
        <div className='flex min-h-screen w-full bg-muted/30'>
          <AdminSidebar />

          <SidebarInset className='flex min-h-screen flex-1 flex-col'>
            <AdminHeader />
            <main className='flex-1 p-4 md:p-6 lg:p-8'>{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </RoleGuard>
  );
}
