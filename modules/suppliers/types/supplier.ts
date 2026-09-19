export type SupplierStatus = 'ACTIVE' | 'INACTIVE';

export type Supplier = {
  id: string;
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: SupplierStatus;
};

export type SupplierFilters = {
  search: string;
  status: 'ALL' | SupplierStatus;
};

export type SupplierSummary = {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
};

export type SupplierFormValues = {
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: SupplierStatus;
};

export type SupplierOrder = {
  id: string;
  number: string;
  warehouseName: string;
  warehouseCode: string;
  orderDate: string;
  expectedDate: string;
  status: string;
  total: number;
  itemCount: number;
};

export type SupplierOrderSummary = {
  totalOrders: number;
  openOrders: number;
  receivedOrders: number;
  totalValue: number;
};
