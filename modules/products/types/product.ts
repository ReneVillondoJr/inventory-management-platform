export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export type Product = {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  status: ProductStatus;
  image: string;
};

export type ProductFilters = {
  search: string;
  categoryId: string;
  brandId: string;
  status: 'ALL' | ProductStatus;
};

export type ProductFormValues = {
  sku: string;
  name: string;
  categoryId: string;
  brandId: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  status: ProductStatus;
  image: string;
};

export type ProductListItem = Product;

export type ProductAction = 'activate' | 'deactivate' | 'delete';
