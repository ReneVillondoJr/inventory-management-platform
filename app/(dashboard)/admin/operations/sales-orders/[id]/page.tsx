import { SalesOrderDetails } from '@/modules/sales-orders';

type SalesOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SalesOrderPage({ params }: SalesOrderPageProps) {
  const { id } = await params;

  return (
    <main>
      <SalesOrderDetails id={id} />
    </main>
  );
}
