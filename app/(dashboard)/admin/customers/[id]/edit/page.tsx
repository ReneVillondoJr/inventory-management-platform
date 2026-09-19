'use client';

import { use } from 'react';

import { notFound } from 'next/navigation';

import { CustomerForm, customerService } from '@/modules/customers';

type EditCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = use(params);

  const customer = customerService.getById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <CustomerForm customer={customer} />
    </div>
  );
}
