'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { adminNavigation } from '@/data/navigation/admin-navigation';
import { type RoleName } from '@/lib/auth/permissions';
import { canAccessModule, getStoredRole, setStoredRole } from '@/lib/rbac';
import { cn } from '@/lib/utils';

const roleOptions: Array<{ value: RoleName; label: string }> = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'INVENTORY_MANAGER', label: 'Inventory Manager' },
  { value: 'WAREHOUSE_STAFF', label: 'Warehouse Staff' },
  { value: 'SALES_STAFF', label: 'Sales Staff' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<RoleName>('SUPER_ADMIN');

  useEffect(() => {
    const syncRole = () => setRole(getStoredRole());

    syncRole();
    window.addEventListener('inventory-role-change', syncRole);
    return () => window.removeEventListener('inventory-role-change', syncRole);
  }, []);

  const visibleNavigation = useMemo(
    () =>
      adminNavigation.filter(({ moduleKey }) => {
        if (!moduleKey) return true;
        return canAccessModule(role, moduleKey);
      }),
    [role],
  );

  return (
    <Sidebar
      collapsible='icon'
      variant='sidebar'
      className='border-r border-border/60 bg-background'
    >
      <SidebarHeader className='border-b border-border/60 px-3 py-3'>
        <div className='flex items-center gap-2'>
          <Link
            href='/admin/dashboard'
            className='flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1.5 py-1.5 transition-colors hover:bg-muted/60'
          >
            <div className='flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 font-mono text-[10px] font-bold tracking-[0.14em] text-primary'>
              IM
            </div>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold tracking-[-0.01em]'>
                Inventory
              </p>
              <p className='truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground'>
                Operations
              </p>
            </div>
          </Link>
          <SidebarTrigger className='shrink-0' />
        </div>
      </SidebarHeader>
      <SidebarContent className='px-2.5 py-3'>
        <SidebarGroup className='p-0'>
          <SidebarGroupLabel className='px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60'>
            Workspace
          </SidebarGroupLabel>

          <div className='mx-3 mb-3 rounded-lg border border-dashed border-border px-2.5 py-2'>
            <Label className='mb-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70'>
              Role test
            </Label>

            <Select
              value={role}
              onValueChange={(nextRole) => {
                const value = nextRole as RoleName;
                setRole(value);
                setStoredRole(value);
              }}
            >
              <SelectTrigger className='w-full rounded-md border border-border bg-background px-2 py-1.5 font-mono text-[11px] text-foreground outline-none focus:ring-2 focus:ring-ring'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>

              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SidebarGroupContent>
            <SidebarMenu className='gap-1'>
              {visibleNavigation.map(({ title, href, icon: Icon }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={href}
                          className='flex w-full items-center gap-3'
                        >
                          <Icon className='size-[17px] shrink-0' />
                          <span className='truncate'>{title}</span>
                        </Link>
                      }
                      isActive={isActive}
                      tooltip={title}
                      className={cn(
                        'h-10 rounded-lg border-l-2 border-l-transparent px-3 text-[13px] font-medium',
                        'transition-colors',
                        'text-muted-foreground',
                        'hover:bg-muted/70 hover:text-foreground',
                        'data-[active=true]:border-l-primary',
                        'data-[active=true]:bg-primary/10',
                        'data-[active=true]:text-primary',
                        'data-[active=true]:hover:bg-primary/10',
                      )}
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className='mt-auto px-3 pb-3'>
        <div className='rounded-xl border border-border/60 bg-muted/20 px-3 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70'>
            Inventory Platform
          </p>
          <p className='mt-1 text-xs font-medium text-foreground'>
            Operations workspace
          </p>
          <p className='mt-0.5 text-[11px] text-muted-foreground'>
            Manage stock and orders
          </p>
          <div className='mt-2 flex items-center gap-1.5'>
            <span className='relative flex size-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:animate-none' />
              <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
            </span>
            <span className='font-mono text-[10px] text-muted-foreground'>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
