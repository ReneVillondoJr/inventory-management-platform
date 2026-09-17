export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export type StockMovementReferenceType =
  | 'PURCHASE_RECEIPT'
  | 'SALES_ORDER'
  | 'STOCK_TRANSFER'
  | 'RETURN'
  | 'INVENTORY_ADJUSTMENT';

export type StockMovement = {
  id: string;
  productId: string;
  warehouseId: string;
  type: StockMovementType;
  quantity: number;
  referenceType: StockMovementReferenceType;
  referenceId: string;
  performedById: string;
  movementDate: string;
  note?: string;
};

export type StockMovementWithDetails = StockMovement & {
  productName: string;
  sku: string;
  warehouseName: string;
  warehouseCode: string;
  performedByName: string;
};

export type StockMovementFilters = {
  search: string;
  warehouseId: string;
  productId: string;
  type: 'ALL' | StockMovementType;
};
