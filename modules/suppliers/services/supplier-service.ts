'use client';

import { seedData } from '@/data/seed/inventory-seed';

import { purchaseOrderService } from '@/modules/purchase-orders/services/purchase-order-service';

import type { PurchaseOrder } from '@/modules/purchase-orders/types/purchase-order';

import type {
  Supplier,
  SupplierFormValues,
  SupplierOrder,
  SupplierOrderSummary,
} from '../types/supplier';

type StoredSupplier = {
  id: string;
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
};

const STORAGE_KEY = 'inventory-management-platform:suppliers';

function createInitialState(): StoredSupplier[] {
  return seedData.suppliers.map((supplier) => ({
    id: supplier.id,
    code: supplier.code,
    name: supplier.name,
    contactName: supplier.contactName,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    status: supplier.status,
  }));
}

function readState(): StoredSupplier[] {
  if (typeof window === 'undefined') {
    return createInitialState();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createInitialState();
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return createInitialState();
    }

    return parsed as StoredSupplier[];
  } catch {
    return createInitialState();
  }
}

function writeState(suppliers: StoredSupplier[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
}

function enrichSupplier(supplier: StoredSupplier): Supplier {
  return {
    id: supplier.id,
    code: supplier.code,
    name: supplier.name,
    contactName: supplier.contactName,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    status: supplier.status,
  };
}

function getNextSupplierCode(suppliers: StoredSupplier[]) {
  const sequenceNumbers = suppliers
    .map((supplier) => {
      const match = supplier.code.match(/SUP-(\d+)/i);

      return match ? Number(match[1]) : 0;
    })
    .filter((value) => Number.isFinite(value));

  const nextSequence =
    sequenceNumbers.length > 0 ?
      Math.max(...sequenceNumbers) + 1
    : suppliers.length + 1;

  return `SUP-${String(nextSequence).padStart(3, '0')}`;
}

function toSupplierOrder(order: PurchaseOrder): SupplierOrder {
  return {
    id: order.id,
    number: order.number,
    warehouseName: order.warehouseName,
    warehouseCode: order.warehouseCode,
    orderDate: order.orderDate,
    expectedDate: order.expectedDate,
    status: order.status,
    total: order.total,
    itemCount: order.items.length,
  };
}

export const supplierService = {
  getAll(): Supplier[] {
    return readState()
      .map(enrichSupplier)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  getById(id: string): Supplier | null {
    const supplier = readState().find((item) => item.id === id);

    return supplier ? enrichSupplier(supplier) : null;
  },

  create(values: SupplierFormValues): Supplier {
    const suppliers = readState();

    const normalizedCode = values.code.trim().toUpperCase();

    const duplicateCode = suppliers.some(
      (supplier) => supplier.code.toUpperCase() === normalizedCode,
    );

    if (duplicateCode) {
      throw new Error('A supplier with this code already exists.');
    }

    const id = `supplier_${Date.now()}`;

    const supplier: StoredSupplier = {
      id,
      code: normalizedCode || getNextSupplierCode(suppliers),
      name: values.name.trim(),
      contactName: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      status: values.status,
    };

    suppliers.push(supplier);

    writeState(suppliers);

    return enrichSupplier(supplier);
  },

  update(id: string, values: SupplierFormValues): Supplier {
    const suppliers = readState();

    const index = suppliers.findIndex((supplier) => supplier.id === id);

    if (index === -1) {
      throw new Error('Supplier not found.');
    }

    const normalizedCode = values.code.trim().toUpperCase();

    const duplicateCode = suppliers.some(
      (supplier, supplierIndex) =>
        supplierIndex !== index &&
        supplier.code.toUpperCase() === normalizedCode,
    );

    if (duplicateCode) {
      throw new Error('A supplier with this code already exists.');
    }

    const updatedSupplier: StoredSupplier = {
      ...suppliers[index],
      code: normalizedCode,
      name: values.name.trim(),
      contactName: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      status: values.status,
    };

    suppliers[index] = updatedSupplier;

    writeState(suppliers);

    return enrichSupplier(updatedSupplier);
  },

  updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Supplier {
    const suppliers = readState();

    const index = suppliers.findIndex((supplier) => supplier.id === id);

    if (index === -1) {
      throw new Error('Supplier not found.');
    }

    suppliers[index] = {
      ...suppliers[index],
      status,
    };

    writeState(suppliers);

    return enrichSupplier(suppliers[index]);
  },

  getOrders(supplierId: string): SupplierOrder[] {
    return purchaseOrderService
      .getAll()
      .filter((order) => order.supplierId === supplierId)
      .map(toSupplierOrder)
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
      );
  },

  getOrderSummary(supplierId: string): SupplierOrderSummary {
    const orders = purchaseOrderService
      .getAll()
      .filter((order) => order.supplierId === supplierId);

    return {
      totalOrders: orders.length,

      openOrders: orders.filter((order) =>
        ['APPROVED', 'PARTIALLY_RECEIVED'].includes(order.status),
      ).length,

      receivedOrders: orders.filter((order) => order.status === 'RECEIVED')
        .length,

      totalValue: orders.reduce((sum, order) => sum + order.total, 0),
    };
  },

  resetDemoData() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  },
};
