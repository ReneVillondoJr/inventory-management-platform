export type WarehouseStatus = 'ACTIVE' | 'INACTIVE';

export type Warehouse = {
  id: string;
  code: string;
  name: string;
  address: string;
  managerId: string;
  managerName: string;
  status: WarehouseStatus;
};

export type WarehouseFilters = {
  search: string;
  status: 'ALL' | WarehouseStatus;
};

export type WarehouseSummary = {
  totalWarehouses: number;
  activeWarehouses: number;
  inactiveWarehouses: number;
};

export type WarehouseFormValues = {
  code: string;
  name: string;
  address: string;
  managerId: string;
  status: WarehouseStatus;
};

export type WarehouseStockItem = {
  productId: string;
  productName: string;
  sku: string;
  categoryName: string;
  brandName: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  costPrice: number;
  inventoryValue: number;
  lowStock: boolean;
  outOfStock: boolean;
};

export type WarehouseStockSummary = {
  totalProducts: number;
  totalUnits: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryValue: number;
};
