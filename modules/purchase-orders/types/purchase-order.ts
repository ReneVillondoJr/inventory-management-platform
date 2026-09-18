export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'APPROVED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'CANCELLED';

export type PurchaseOrderItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  receivedQuantity: number;
  outstandingQuantity: number;
  unitCost: number;
  total: number;
};

export type PurchaseOrderLineItem = {
  id?: string;
  productId: string;
  productName?: string;
  sku?: string;
  quantity: number;
  receivedQuantity?: number;
  outstandingQuantity?: number;
  unitCost: number;
  total?: number;
};

export type PurchaseOrder = {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  createdById: string;
  createdByName: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDate: string;
  notes: string;
  subtotal: number;
  total: number;
  items: PurchaseOrderItem[];
};

export type PurchaseOrderFilters = {
  search: string;
  supplierId: string;
  warehouseId: string;
  status: 'ALL' | PurchaseOrderStatus;
};

export type PurchaseOrderSummary = {
  totalOrders: number;
  draftOrders: number;
  openOrders: number;
  receivedOrders: number;
  totalValue: number;
};

export type PurchaseOrderFormValues = {
  supplierId: string;
  warehouseId: string;
  orderDate: string;
  expectedDate: string;
  status: PurchaseOrderStatus;
  notes: string;
  items: {
    productId: string;
    quantity: number;
    unitCost: number;
  }[];
};

export type ReceivePurchaseOrderInput = {
  purchaseOrderId: string;
  items: {
    purchaseOrderItemId: string;
    quantity: number;
  }[];
  receivedById: string;
  receivedDate: string;
  notes?: string;
};

export type PurchaseReceipt = {
  id: string;
  number: string;
  purchaseOrderId: string;
  warehouseId: string;
  receivedById: string;
  status: 'COMPLETED';
  receivedDate: string;
  notes?: string;
};

export type PurchaseReceiptItem = {
  id: string;
  receiptId: string;
  productId: string;
  quantity: number;
};
