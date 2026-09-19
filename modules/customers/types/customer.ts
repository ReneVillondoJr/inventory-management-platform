export type CustomerStatus = 'ACTIVE' | 'INACTIVE';

export type Customer = {
  id: string;
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: CustomerStatus;
};

export type CustomerFilters = {
  search: string;
  status: 'ALL' | CustomerStatus;
};

export type CustomerSummary = {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
};

export type CustomerFormValues = {
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: CustomerStatus;
};

export type CustomerOrder = {
  id: string;
  number: string;
  warehouseName: string;
  warehouseCode: string;
  orderDate: string;
  status: string;
  total: number;
  itemCount: number;
};

export type CustomerOrderSummary = {
  totalOrders: number;
  openOrders: number;
  completedOrders: number;
  totalValue: number;
};
