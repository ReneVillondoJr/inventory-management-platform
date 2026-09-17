import { seedData } from '@/data/seed/inventory-seed';

import type { Product, ProductFormValues } from '../types/product';

const PRODUCT_STORAGE_KEY = 'inventory-management-platform:products';

let productsState: Product[] | null = null;

function createInitialProducts(): Product[] {
  return seedData.products.map((product) => {
    const category = seedData.categories.find(
      (item) => item.id === product.categoryId,
    );

    const brand = seedData.brands.find((item) => item.id === product.brandId);

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      categoryId: product.categoryId,
      categoryName: category?.name ?? 'Uncategorized',
      brandId: product.brandId,
      brandName: brand?.name ?? 'Unknown brand',
      unit: product.unit,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      reorderLevel: product.reorderLevel,
      status: product.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      image: '',
    };
  });
}

function initializeProducts() {
  if (productsState) {
    return;
  }

  if (typeof window === 'undefined') {
    productsState = createInitialProducts();
    return;
  }

  const storedProducts = window.localStorage.getItem(PRODUCT_STORAGE_KEY);

  productsState =
    storedProducts ? JSON.parse(storedProducts) : createInitialProducts();
}

function saveProducts() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify(productsState ?? []),
  );
}

function createProductId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `product_${crypto.randomUUID()}`;
  }

  return `product_${Date.now()}`;
}

function buildProduct(id: string, values: ProductFormValues): Product {
  const category = seedData.categories.find(
    (item) => item.id === values.categoryId,
  );

  const brand = seedData.brands.find((item) => item.id === values.brandId);

  return {
    id,
    sku: values.sku.trim(),
    name: values.name.trim(),
    categoryId: values.categoryId,
    categoryName: category?.name ?? 'Uncategorized',
    brandId: values.brandId,
    brandName: brand?.name ?? 'Unknown brand',
    unit: values.unit.trim(),
    costPrice: values.costPrice,
    sellingPrice: values.sellingPrice,
    reorderLevel: values.reorderLevel,
    status: values.status,
    image: values.image ?? '',
  };
}

export const productService = {
  getAll(): Product[] {
    initializeProducts();

    return [...(productsState ?? [])];
  },

  getById(id: string): Product | null {
    initializeProducts();

    return productsState?.find((product) => product.id === id) ?? null;
  },

  skuExists(sku: string, excludedId?: string): boolean {
    initializeProducts();

    const normalizedSku = sku.trim().toLowerCase();

    return (
      productsState?.some(
        (product) =>
          product.id !== excludedId &&
          product.sku.trim().toLowerCase() === normalizedSku,
      ) ?? false
    );
  },

  create(values: ProductFormValues): Product {
    initializeProducts();

    if (this.skuExists(values.sku)) {
      throw new Error('A product with this SKU already exists.');
    }

    const product = buildProduct(createProductId(), values);

    productsState = [...(productsState ?? []), product];

    saveProducts();

    return product;
  },

  update(id: string, values: ProductFormValues): Product {
    initializeProducts();

    if (this.skuExists(values.sku, id)) {
      throw new Error('A product with this SKU already exists.');
    }

    const index = productsState?.findIndex((product) => product.id === id);

    if (index === undefined || index < 0) {
      throw new Error('Product could not be found.');
    }

    const product = buildProduct(id, values);

    const nextProducts = [...(productsState ?? [])];

    nextProducts[index] = product;

    productsState = nextProducts;

    saveProducts();

    return product;
  },

  updateStatus(id: string, status: Product['status']): Product {
    initializeProducts();

    const product = productsState?.find((item) => item.id === id);

    if (!product) {
      throw new Error('Product could not be found.');
    }

    product.status = status;

    saveProducts();

    return { ...product };
  },

  delete(id: string) {
    initializeProducts();

    const exists = productsState?.some((product) => product.id === id);

    if (!exists) {
      throw new Error('Product could not be found.');
    }

    productsState = (productsState ?? []).filter(
      (product) => product.id !== id,
    );

    saveProducts();
  },

  resetDemoData() {
    productsState = createInitialProducts();

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(PRODUCT_STORAGE_KEY);
    }
  },
};
