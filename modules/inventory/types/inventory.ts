import type { StockMovementWithDetails } from './stock-movement';

export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export type InventoryRecord = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  inventoryValue: number;
  status: InventoryStatus;
};

export type InventorySummary = {
  totalProducts: number;
  totalUnits: number;
  totalAvailableUnits: number;
  totalInventoryValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  warehouseCount: number;
};

export type InventoryFilters = {
  search: string;
  warehouseId: string;
  categoryId: string;
  status: 'ALL' | InventoryStatus;
};

export type InventorySnapshot = {
  inventory: InventoryRecord[];
  summary: InventorySummary;
  movements: StockMovementWithDetails[];
};

export type StockAdjustmentInput = {
  productId: string;
  warehouseId: string;
  type: 'INCREASE' | 'DECREASE';
  quantity: number;
  reason: 'CYCLE_COUNT_VARIANCE' | 'DAMAGED' | 'LOST' | 'FOUND' | 'OTHER';
  notes?: string;
  performedById: string;
};

export type StockTransferInput = {
  productId: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  quantity: number;
  notes?: string;
  performedById: string;
};

export type StockAdjustmentResult = {
  movementId: string;
  inventoryId: string;
  newQuantity: number;
};

export type StockTransferResult = {
  transferId: string;
  sourceInventoryId: string;
  destinationInventoryId: string;
};
