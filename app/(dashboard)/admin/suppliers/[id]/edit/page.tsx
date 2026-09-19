'use client';

import { use } from 'react';

import { notFound } from 'next/navigation';

import { SupplierForm, supplierService } from '@/modules/suppliers';

type EditSupplierPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditSupplierPage({ params }: EditSupplierPageProps) {
  const { id } = use(params);

  const supplier = supplierService.getById(id);

  if (!supplier) {
    notFound();
  }

  return (
    <div>
      <SupplierForm supplier={supplier} />
    </div>
  );
}
