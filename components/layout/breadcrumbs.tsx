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

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbItems =
    items ??
    pathname
      .split('/')
      .filter(Boolean)
      .filter((segment) => !['admin', 'dashboard'].includes(segment))
      .map((segment, index, allSegments) => {
        const href = `/admin/${allSegments.slice(0, index + 1).join('/')}`;
        return {
          label: segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          href,
        };
      });

  if (!breadcrumbItems.length) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href='/admin/dashboard'>Dashboard</Link>}
          />
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <span
              key={`${item.label}-${index}`}
              className='flex items-center gap-1.5'
            >
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ?
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                : <BreadcrumbLink
                    render={
                      <Link href={item.href ?? '/admin/dashboard'}>
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
