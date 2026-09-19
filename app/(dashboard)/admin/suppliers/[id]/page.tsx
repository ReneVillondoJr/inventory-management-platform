'use client';

import { use } from 'react';

import { SupplierDetails } from '@/modules/suppliers';

type SupplierPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function SupplierPage({ params }: SupplierPageProps) {
  const { id } = use(params);

  return (
    <div>
      <SupplierDetails id={id} />
    </div>
  );
}
