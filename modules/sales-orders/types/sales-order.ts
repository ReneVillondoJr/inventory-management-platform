export type SalesOrderStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

export type SalesOrderItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type SalesOrderLineItem = {
  id?: string;
  productId: string;
  productName?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  total?: number;
};

export type SalesOrder = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  createdById: string;
  createdByName: string;
  status: SalesOrderStatus;
  orderDate: string;
  notes: string;
  subtotal: number;
  total: number;
  items: SalesOrderItem[];
};

export type SalesOrderFilters = {
  search: string;
  customerId: string;
  warehouseId: string;
  status: 'ALL' | SalesOrderStatus;
};

export type SalesOrderSummary = {
  totalOrders: number;
  draftOrders: number;
  openOrders: number;
  completedOrders: number;
  totalValue: number;
};

export type SalesOrderFormValues = {
  customerId: string;
  warehouseId: string;
  orderDate: string;
  status: SalesOrderStatus;
  notes: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
};
export type ProductOption = {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
};

export type NormalizedLineItem = {
  id?: string;
  productId: string;
  productName?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  total: number;
};
