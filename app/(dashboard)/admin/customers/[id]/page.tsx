'use client';

import { use } from 'react';

import { CustomerDetails } from '@/modules/customers';

type CustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function CustomerPage({ params }: CustomerPageProps) {
  const { id } = use(params);

  return (
    <div>
      <CustomerDetails id={id} />
    </div>
  );
}
