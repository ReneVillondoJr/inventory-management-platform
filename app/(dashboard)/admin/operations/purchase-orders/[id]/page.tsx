import { PurchaseOrderDetails } from '@/modules/purchase-orders';

type PurchaseOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PurchaseOrderPage({
  params,
}: PurchaseOrderPageProps) {
  const { id } = await params;

  return <PurchaseOrderDetails id={id} />;
}
