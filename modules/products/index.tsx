export { ProductList } from './components/product-list';
export { ProductTable } from './components/product-table';
export { ProductForm } from './components/product-form';
export { ProductDetails } from './components/product-details';
export { ProductFilters } from './components/product-filters';
export { ProductActions } from './components/product-actions';
export { ProductImageUpload } from './components/product-image-upload';
export { ProductStatusBadge } from './components/product-status-badge';

export { useProducts } from './hooks/use-products';
export { useProductForm } from './hooks/use-product-form';

export { productService } from './services/product-service';

export type {
  Product,
  ProductFilters as ProductFilterState,
  ProductFormValues,
  ProductStatus,
} from './types/product';
