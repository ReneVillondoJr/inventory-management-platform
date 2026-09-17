import { seedData } from '@/data/seed/inventory-seed';

import type {
  InventoryRecord,
  InventoryStatus,
  StockAdjustmentInput,
  StockAdjustmentResult,
  StockTransferInput,
  StockTransferResult,
} from '../types/inventory';

import type {
  StockMovement,
  StockMovementWithDetails,
} from '../types/stock-movement';

type MutableInventory = {
  id: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
};

const INVENTORY_STORAGE_KEY = 'inventory-management-platform:inventory';

const MOVEMENTS_STORAGE_KEY = 'inventory-management-platform:stock-movements';

let inventoryState: MutableInventory[] | null = null;
let movementsState: StockMovement[] | null = null;

function cloneInventory(): MutableInventory[] {
  return seedData.inventory.map((item) => ({
    id: item.id,
    warehouseId: item.warehouseId,
    productId: item.productId,
    quantity: item.quantity,
    reservedQuantity: item.reservedQuantity,
    reorderLevel: item.reorderLevel,
  }));
}

function cloneMovements(): StockMovement[] {
  return seedData.stockMovements.map((movement) => ({
    id: movement.id,
    productId: movement.productId,
    warehouseId: movement.warehouseId,
    type: movement.type,
    quantity: movement.quantity,
    referenceType: movement.referenceType,
    referenceId: movement.referenceId,
    performedById: movement.performedById,
    movementDate: movement.movementDate,
  }));
}

function saveState() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    INVENTORY_STORAGE_KEY,
    JSON.stringify(inventoryState),
  );

  window.localStorage.setItem(
    MOVEMENTS_STORAGE_KEY,
    JSON.stringify(movementsState),
  );
}

function initializeState() {
  if (inventoryState && movementsState) {
    return;
  }

  if (typeof window === 'undefined') {
    inventoryState = cloneInventory();
    movementsState = cloneMovements();
    return;
  }

  const storedInventory = window.localStorage.getItem(INVENTORY_STORAGE_KEY);

  const storedMovements = window.localStorage.getItem(MOVEMENTS_STORAGE_KEY);

  inventoryState =
    storedInventory ? JSON.parse(storedInventory) : cloneInventory();

  movementsState =
    storedMovements ? JSON.parse(storedMovements) : cloneMovements();
}

function getInventoryStatus(
  quantity: number,
  reorderLevel: number,
): InventoryStatus {
  if (quantity <= 0) {
    return 'OUT_OF_STOCK';
  }

  if (quantity <= reorderLevel) {
    return 'LOW_STOCK';
  }

  return 'IN_STOCK';
}

function createMovementId() {
  return `movement_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createTransferId() {
  return `transfer_runtime_${Date.now()}`;
}

function createAdjustmentId() {
  return `adjustment_runtime_${Date.now()}`;
}

export const inventoryService = {
  getRawInventory() {
    initializeState();

    return inventoryState ?? [];
  },

  getRawMovements() {
    initializeState();

    return movementsState ?? [];
  },

  getInventoryRecords(): InventoryRecord[] {
    initializeState();

    const inventory = inventoryState ?? [];

    return inventory.map((item) => {
      const product = seedData.products.find(
        (product) => product.id === item.productId,
      );

      const category = seedData.categories.find(
        (category) => category.id === product?.categoryId,
      );

      const brand = seedData.brands.find(
        (brand) => brand.id === product?.brandId,
      );

      const warehouse = seedData.warehouses.find(
        (warehouse) => warehouse.id === item.warehouseId,
      );

      const availableQuantity = Math.max(
        item.quantity - item.reservedQuantity,
        0,
      );

      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name ?? 'Unknown product',
        sku: product?.sku ?? 'N/A',
        categoryId: product?.categoryId ?? '',
        categoryName: category?.name ?? 'Uncategorized',
        brandId: product?.brandId ?? '',
        brandName: brand?.name ?? 'Unknown brand',
        warehouseId: item.warehouseId,
        warehouseName: warehouse?.name ?? 'Unknown warehouse',
        warehouseCode: warehouse?.code ?? 'N/A',
        quantity: item.quantity,
        reservedQuantity: item.reservedQuantity,
        availableQuantity,
        reorderLevel: item.reorderLevel,
        costPrice: product?.costPrice ?? 0,
        sellingPrice: product?.sellingPrice ?? 0,
        inventoryValue: item.quantity * (product?.costPrice ?? 0),
        status: getInventoryStatus(item.quantity, item.reorderLevel),
      };
    });
  },

  getMovements(): StockMovementWithDetails[] {
    initializeState();

    const movements = movementsState ?? [];

    return movements
      .map((movement) => {
        const product = seedData.products.find(
          (product) => product.id === movement.productId,
        );

        const warehouse = seedData.warehouses.find(
          (warehouse) => warehouse.id === movement.warehouseId,
        );

        const user = seedData.users.find(
          (user) => user.id === movement.performedById,
        );

        return {
          ...movement,
          productName: product?.name ?? 'Unknown product',
          sku: product?.sku ?? 'N/A',
          warehouseName: warehouse?.name ?? 'Unknown warehouse',
          warehouseCode: warehouse?.code ?? 'N/A',
          performedByName: user?.name ?? 'Unknown user',
        };
      })
      .sort(
        (a, b) =>
          new Date(b.movementDate).getTime() -
          new Date(a.movementDate).getTime(),
      );
  },

  adjustStock(input: StockAdjustmentInput): StockAdjustmentResult {
    initializeState();

    if (!inventoryState || !movementsState) {
      throw new Error('Inventory state is not initialized.');
    }

    const inventory = inventoryState.find(
      (item) =>
        item.productId === input.productId &&
        item.warehouseId === input.warehouseId,
    );

    if (!inventory) {
      throw new Error(
        'Inventory record was not found for this product and warehouse.',
      );
    }

    if (input.quantity <= 0) {
      throw new Error('Adjustment quantity must be greater than zero.');
    }

    if (input.type === 'DECREASE' && inventory.quantity < input.quantity) {
      throw new Error('Cannot decrease stock below the current quantity.');
    }

    inventory.quantity =
      input.type === 'INCREASE' ?
        inventory.quantity + input.quantity
      : inventory.quantity - input.quantity;

    const movementId = createMovementId();

    movementsState.push({
      id: movementId,
      productId: input.productId,
      warehouseId: input.warehouseId,
      type: 'ADJUSTMENT',
      quantity: input.type === 'INCREASE' ? input.quantity : -input.quantity,
      referenceType: 'INVENTORY_ADJUSTMENT',
      referenceId: createAdjustmentId(),
      performedById: input.performedById,
      movementDate: new Date().toISOString(),
      note: input.notes,
    });

    saveState();

    return {
      movementId,
      inventoryId: inventory.id,
      newQuantity: inventory.quantity,
    };
  },

  transferStock(input: StockTransferInput): StockTransferResult {
    initializeState();

    if (!inventoryState || !movementsState) {
      throw new Error('Inventory state is not initialized.');
    }

    if (input.sourceWarehouseId === input.destinationWarehouseId) {
      throw new Error('Source and destination warehouses must be different.');
    }

    if (input.quantity <= 0) {
      throw new Error('Transfer quantity must be greater than zero.');
    }

    const sourceInventory = inventoryState.find(
      (item) =>
        item.productId === input.productId &&
        item.warehouseId === input.sourceWarehouseId,
    );

    if (!sourceInventory) {
      throw new Error('Source warehouse inventory was not found.');
    }

    if (sourceInventory.quantity < input.quantity) {
      throw new Error('Insufficient stock available in the source warehouse.');
    }

    let destinationInventory = inventoryState.find(
      (item) =>
        item.productId === input.productId &&
        item.warehouseId === input.destinationWarehouseId,
    );

    if (!destinationInventory) {
      const product = seedData.products.find(
        (item) => item.id === input.productId,
      );

      destinationInventory = {
        id: `inventory_runtime_${Date.now()}`,
        productId: input.productId,
        warehouseId: input.destinationWarehouseId,
        quantity: 0,
        reservedQuantity: 0,
        reorderLevel: product?.reorderLevel ?? 0,
      };

      inventoryState.push(destinationInventory);
    }

    sourceInventory.quantity -= input.quantity;
    destinationInventory.quantity += input.quantity;

    const transferId = createTransferId();

    movementsState.push(
      {
        id: createMovementId(),
        productId: input.productId,
        warehouseId: input.sourceWarehouseId,
        type: 'OUT',
        quantity: -input.quantity,
        referenceType: 'STOCK_TRANSFER',
        referenceId: transferId,
        performedById: input.performedById,
        movementDate: new Date().toISOString(),
        note: input.notes,
      },
      {
        id: createMovementId(),
        productId: input.productId,
        warehouseId: input.destinationWarehouseId,
        type: 'IN',
        quantity: input.quantity,
        referenceType: 'STOCK_TRANSFER',
        referenceId: transferId,
        performedById: input.performedById,
        movementDate: new Date().toISOString(),
        note: input.notes,
      },
    );

    saveState();

    return {
      transferId,
      sourceInventoryId: sourceInventory.id,
      destinationInventoryId: destinationInventory.id,
    };
  },

  resetDemoData() {
    inventoryState = cloneInventory();
    movementsState = cloneMovements();

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(INVENTORY_STORAGE_KEY);
      window.localStorage.removeItem(MOVEMENTS_STORAGE_KEY);
    }
  },
};
