'use client';

import { useCallback, useMemo, useState } from 'react';

import { seedData } from '@/data/seed/inventory-seed';

import { productService } from '../services/product-service';

import type { ProductFilters } from '../types/product';

const initialFilters: ProductFilters = {
  search: '',
  categoryId: 'ALL',
  brandId: 'ALL',
  status: 'ALL',
};

export function useProducts() {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const products = productService.getAll();

  const filteredProducts = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.categoryName.toLowerCase().includes(search) ||
        product.brandName.toLowerCase().includes(search);

      const matchesCategory =
        filters.categoryId === 'ALL' ||
        product.categoryId === filters.categoryId;

      const matchesBrand =
        filters.brandId === 'ALL' || product.brandId === filters.brandId;

      const matchesStatus =
        filters.status === 'ALL' || product.status === filters.status;

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [filters, products]);

  const summary = useMemo(() => {
    const total = products.length;

    const active = products.filter(
      (product) => product.status === 'ACTIVE',
    ).length;

    const inactive = products.filter(
      (product) => product.status === 'INACTIVE',
    ).length;

    const averageMargin =
      total > 0 ?
        products.reduce(
          (sum, product) => sum + (product.sellingPrice - product.costPrice),
          0,
        ) / total
      : 0;

    return {
      total,
      active,
      inactive,
      averageMargin,
    };
  }, [products]);

  const updateFilters = useCallback((values: Partial<ProductFilters>) => {
    setFilters((current) => ({
      ...current,
      ...values,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const refresh = useCallback(() => {
    window.dispatchEvent(new Event('products:refresh'));
  }, []);

  return {
    products,
    filteredProducts,
    filters,
    summary,
    categories: seedData.categories,
    brands: seedData.brands,
    updateFilters,
    resetFilters,
    refresh,
  };
}
