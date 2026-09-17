// app/(dashboard)/admin/inventory/categories/[id]/edit/page.tsx
import { CategoryEditView } from '@/modules/categories';

type CategoryEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CategoryEditPage({
  params,
}: CategoryEditPageProps) {
  const { id } = await params;

  return <CategoryEditView id={id} />;
}
