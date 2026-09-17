import { StockMovementDetails } from '@/modules/inventory';

type StockMovementDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StockMovementDetailsPage({
  params,
}: StockMovementDetailsPageProps) {
  const { id } = await params;

  return <StockMovementDetails id={id} />;
}
