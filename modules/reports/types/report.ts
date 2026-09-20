import type { LucideIcon } from 'lucide-react';

export type ReportType =
  | 'inventory'
  | 'purchasing'
  | 'sales'
  | 'stock-movement';

export type ReportDateRange = 'ALL' | '7D' | '30D' | '90D' | 'CUSTOM';

export type ReportFilters = {
  reportType: ReportType;
  search: string;
  warehouseId: string;
  dateRange: ReportDateRange;
  dateFrom: string;
  dateTo: string;
};

export type ReportSummaryItem = {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
};

export type InventoryReportRow = {
  productId: string;
  sku: string;
  productName: string;
  categoryName: string;
  brandName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  costPrice: number;
  inventoryValue: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
};

export type InventoryReportData = {
  rows: InventoryReportRow[];
  totalProducts: number;
  totalUnits: number;
  inventoryValue: number;
  lowStockItems: number;
  outOfStockItems: number;
};

export type PurchasingReportOrder = {
  id: string;
  number: string;
  supplierName: string;
  warehouseName: string;
  warehouseCode: string;
  orderDate: string;
  expectedDate: string;
  status: string;
  total: number;
  itemCount: number;
};

export type PurchasingSupplierRow = {
  supplierName: string;
  orderCount: number;
  openOrders: number;
  receivedOrders: number;
  totalValue: number;
};

export type PurchasingReportData = {
  orders: PurchasingReportOrder[];
  suppliers: PurchasingSupplierRow[];
  totalOrders: number;
  openOrders: number;
  receivedOrders: number;
  totalValue: number;
};

export type SalesReportOrder = {
  id: string;
  number: string;
  customerName: string;
  warehouseName: string;
  warehouseCode: string;
  orderDate: string;
  status: string;
  total: number;
  itemCount: number;
};

export type SalesCustomerRow = {
  customerName: string;
  orderCount: number;
  openOrders: number;
  completedOrders: number;
  totalValue: number;
};

export type SalesReportData = {
  orders: SalesReportOrder[];
  customers: SalesCustomerRow[];
  totalOrders: number;
  openOrders: number;
  completedOrders: number;
  totalValue: number;
};

export type StockMovementType =
  | 'PURCHASE_RECEIPT'
  | 'SALE'
  | 'TRANSFER'
  | 'RETURN'
  | 'ADJUSTMENT'
  | 'OTHER';

export type StockMovementDirection = 'IN' | 'OUT' | 'NEUTRAL';

export type StockMovementReportRow = {
  id: string;
  date: string;
  movementType: StockMovementType;
  direction: StockMovementDirection;
  referenceNumber: string;
  productName: string;
  sku: string;
  warehouseName: string;
  quantity: number;
  unit: string;
  reason: string;
  performedByName: string;
};

export type StockMovementReportData = {
  rows: StockMovementReportRow[];
  totalMovements: number;
  inboundUnits: number;
  outboundUnits: number;
  transferCount: number;
  returnCount: number;
  adjustmentCount: number;
  netUnits: number;
};

export type ReportsData = {
  summary: ReportSummaryItem[];
  inventory: InventoryReportData;
  purchasing: PurchasingReportData;
  sales: SalesReportData;
  stockMovements: StockMovementReportData;
};

export type ReportWarehouseOption = {
  id: string;
  name: string;
  code: string;
};
