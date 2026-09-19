'use client';

import { seedData } from '@/data/seed/inventory-seed';

import type {
  Warehouse,
  WarehouseFormValues,
  WarehouseStockItem,
  WarehouseStockSummary,
} from '../types/warehouse';

type StoredWarehouse = {
  id: string;
  code: string;
  name: string;
  address: string;
  managerId: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type InventoryRecord = Record<string, unknown>;

const STORAGE_KEY = 'inventory-management-platform:warehouses';

const INVENTORY_STORAGE_KEY = 'inventory-management-platform:inventory';

function createInitialWarehouses(): StoredWarehouse[] {
  return seedData.warehouses.map((warehouse) => ({
    id: warehouse.id,
    code: warehouse.code,
    name: warehouse.name,
    address: warehouse.address,
    managerId: warehouse.managerId,
    status: warehouse.status,
  }));
}

function readWarehouses(): StoredWarehouse[] {
  if (typeof window === 'undefined') {
    return createInitialWarehouses();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createInitialWarehouses();
  }

  try {
    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : createInitialWarehouses();
  } catch {
    return createInitialWarehouses();
  }
}

function writeWarehouses(warehouses: StoredWarehouse[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(warehouses));
}

function getManagerName(managerId: string) {
  return (
    seedData.users.find((user) => user.id === managerId)?.name ?? 'Unassigned'
  );
}

function enrichWarehouse(warehouse: StoredWarehouse): Warehouse {
  return {
    id: warehouse.id,
    code: warehouse.code,
    name: warehouse.name,
    address: warehouse.address,
    managerId: warehouse.managerId,
    managerName: getManagerName(warehouse.managerId),
    status: warehouse.status,
  };
}

function getNextWarehouseCode(warehouses: StoredWarehouse[]) {
  const sequenceNumbers = warehouses
    .map((warehouse) => {
      const match = warehouse.code.match(/WH-(\d+)/i);

      return match ? Number(match[1]) : 0;
    })
    .filter((value) => Number.isFinite(value));

  const nextSequence =
    sequenceNumbers.length > 0 ?
      Math.max(...sequenceNumbers) + 1
    : warehouses.length + 1;

  return `WH-${String(nextSequence).padStart(3, '0')}`;
}

function normalizeInventoryRecords(result: unknown): InventoryRecord[] {
  if (Array.isArray(result)) {
    return result.filter(
      (record): record is InventoryRecord =>
        typeof record === 'object' && record !== null,
    );
  }

  if (typeof result === 'object' && result !== null) {
    const object = result as Record<string, unknown>;

    const possibleCollections = [
      object.inventory,
      object.records,
      object.items,
      object.data,
    ];

    const collection = possibleCollections.find(Array.isArray);

    if (Array.isArray(collection)) {
      return collection.filter(
        (record): record is InventoryRecord =>
          typeof record === 'object' && record !== null,
      );
    }
  }

  return [];
}

function getInventoryRecords(): InventoryRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(INVENTORY_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return normalizeInventoryRecords(JSON.parse(stored));
  } catch {
    return [];
  }
}

function readValue(record: InventoryRecord, keys: string[]) {
  for (const key of keys) {
    if (record[key] !== undefined) {
      return record[key];
    }
  }

  return undefined;
}

function getNumberValue(record: InventoryRecord, keys: string[]) {
  const value = readValue(record, keys);

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function getStringValue(record: InventoryRecord, keys: string[]) {
  const value = readValue(record, keys);

  return typeof value === 'string' ? value : '';
}

function getSeedStock(warehouseId: string): WarehouseStockItem[] {
  /*
   * This is only a fallback for the initial demo
   * state when the inventory localStorage has not
   * been initialized yet.
   */
  const knownStock: Record<string, Record<string, number>> = {
    warehouse_main: {
      product_desk: 21,
      product_chair: 26,
      product_monitor: 16,
      product_keyboard: 26,
      product_mouse: 28,
      product_cabinet: 20,
      product_lamp: 30,
      product_stand: 20,
    },

    warehouse_branch: {
      product_desk: 5,
      product_chair: 7,
      product_monitor: 0,
      product_keyboard: 0,
      product_mouse: 0,
      product_cabinet: 1,
      product_lamp: 4,
      product_stand: 0,
    },
  };

  const warehouseStock = knownStock[warehouseId] ?? {};

  return seedData.products.map((product) => {
    const quantity = warehouseStock[product.id] ?? 0;

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      categoryName:
        seedData.categories.find(
          (category) => category.id === product.categoryId,
        )?.name ?? 'Uncategorized',
      brandName:
        seedData.brands.find((brand) => brand.id === product.brandId)?.name ??
        'Unknown',
      quantity,
      reorderLevel: product.reorderLevel,
      unit: product.unit,
      costPrice: product.costPrice,
      inventoryValue: quantity * product.costPrice,
      lowStock: quantity > 0 && quantity <= product.reorderLevel,
      outOfStock: quantity === 0,
    };
  });
}

function getWarehouseStockRecords(warehouseId: string): WarehouseStockItem[] {
  const records = getInventoryRecords();

  if (records.length === 0) {
    return getSeedStock(warehouseId);
  }

  const warehouseRecords = records.filter((record) => {
    const recordWarehouseId = getStringValue(record, ['warehouseId']);

    return recordWarehouseId === warehouseId;
  });

  if (warehouseRecords.length === 0) {
    return getSeedStock(warehouseId);
  }

  return seedData.products.map((product) => {
    const record = warehouseRecords.find(
      (item) => getStringValue(item, ['productId']) === product.id,
    );

    const quantity =
      record ?
        getNumberValue(record, [
          'quantity',
          'stock',
          'currentStock',
          'onHand',
          'availableQuantity',
        ])
      : 0;

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      categoryName:
        seedData.categories.find(
          (category) => category.id === product.categoryId,
        )?.name ?? 'Uncategorized',
      brandName:
        seedData.brands.find((brand) => brand.id === product.brandId)?.name ??
        'Unknown',
      quantity,
      reorderLevel: product.reorderLevel,
      unit: product.unit,
      costPrice: product.costPrice,
      inventoryValue: quantity * product.costPrice,
      lowStock: quantity > 0 && quantity <= product.reorderLevel,
      outOfStock: quantity === 0,
    };
  });
}

export const warehouseService = {
  getAll(): Warehouse[] {
    return readWarehouses()
      .map(enrichWarehouse)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  getById(id: string): Warehouse | null {
    const warehouse = readWarehouses().find((item) => item.id === id);

    return warehouse ? enrichWarehouse(warehouse) : null;
  },

  create(values: WarehouseFormValues): Warehouse {
    const warehouses = readWarehouses();

    const normalizedCode = values.code.trim().toUpperCase();

    const duplicateCode = warehouses.some(
      (warehouse) => warehouse.code.toUpperCase() === normalizedCode,
    );

    if (duplicateCode) {
      throw new Error('A warehouse with this code already exists.');
    }

    const id = `warehouse_${Date.now()}`;

    const warehouse: StoredWarehouse = {
      id,
      code: normalizedCode || getNextWarehouseCode(warehouses),
      name: values.name.trim(),
      address: values.address.trim(),
      managerId: values.managerId,
      status: values.status,
    };

    warehouses.push(warehouse);

    writeWarehouses(warehouses);

    return enrichWarehouse(warehouse);
  },

  update(id: string, values: WarehouseFormValues): Warehouse {
    const warehouses = readWarehouses();

    const index = warehouses.findIndex((warehouse) => warehouse.id === id);

    if (index === -1) {
      throw new Error('Warehouse not found.');
    }

    const normalizedCode = values.code.trim().toUpperCase();

    const duplicateCode = warehouses.some(
      (warehouse, warehouseIndex) =>
        warehouseIndex !== index &&
        warehouse.code.toUpperCase() === normalizedCode,
    );

    if (duplicateCode) {
      throw new Error('A warehouse with this code already exists.');
    }

    const updatedWarehouse: StoredWarehouse = {
      ...warehouses[index],
      code: normalizedCode,
      name: values.name.trim(),
      address: values.address.trim(),
      managerId: values.managerId,
      status: values.status,
    };

    warehouses[index] = updatedWarehouse;

    writeWarehouses(warehouses);

    return enrichWarehouse(updatedWarehouse);
  },

  updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Warehouse {
    const warehouses = readWarehouses();

    const index = warehouses.findIndex((warehouse) => warehouse.id === id);

    if (index === -1) {
      throw new Error('Warehouse not found.');
    }

    warehouses[index] = {
      ...warehouses[index],
      status,
    };

    writeWarehouses(warehouses);

    return enrichWarehouse(warehouses[index]);
  },

  getStock(warehouseId: string): {
    items: WarehouseStockItem[];
    summary: WarehouseStockSummary;
  } {
    const items = getWarehouseStockRecords(warehouseId);

    return {
      items,
      summary: {
        totalProducts: items.length,
        totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
        lowStockItems: items.filter((item) => item.lowStock).length,
        outOfStockItems: items.filter((item) => item.outOfStock).length,
        inventoryValue: items.reduce(
          (sum, item) => sum + item.inventoryValue,
          0,
        ),
      },
    };
  },

  resetDemoData() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  },
};
