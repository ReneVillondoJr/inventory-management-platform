'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items?: BreadcrumbItemType[];
};

function formatLabel(segment: string) {
  return segment
    .replace(/\[(.*?)\]/g, '$1')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  const breadcrumbItems =
    items ??
    pathname
      .split('/')
      .filter(Boolean)
      .filter((segment) => !['admin', 'dashboard'].includes(segment))
      .map((segment, index, allSegments) => ({
        label: formatLabel(segment),
        href: `/admin/${allSegments.slice(0, index + 1).join('/')}`,
      }));

  return (
    <Breadcrumb>
      <BreadcrumbList className='gap-1.5 text-xs'>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link
                href='/admin/dashboard'
                className='text-muted-foreground transition-colors hover:text-foreground'
              >
                Dashboard
              </Link>
            }
          />
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <span
              key={`${item.label}-${index}`}
              className='flex items-center gap-1.5'
            >
              <BreadcrumbSeparator className='text-muted-foreground/40' />

              <BreadcrumbItem>
                {isLast ?
                  <BreadcrumbPage className='font-medium text-foreground'>
                    {item.label}
                  </BreadcrumbPage>
                : <BreadcrumbLink
                    render={
                      <Link
                        href={item.href ?? '/admin/dashboard'}
                        className='text-muted-foreground transition-colors hover:text-foreground'
                      >
                        {item.label}
                      </Link>
                    }
                  />
                }
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
