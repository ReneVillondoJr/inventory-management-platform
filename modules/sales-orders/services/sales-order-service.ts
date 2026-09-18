'use client';

import { seedData } from '@/data/seed/inventory-seed';

import type {
  SalesOrder,
  SalesOrderFormValues,
  SalesOrderItem,
  SalesOrderStatus,
} from '../types/sales-order';

type StoredSalesOrder = {
  id: string;
  number: string;
  customerId: string;
  warehouseId: string;
  createdById: string;
  status: SalesOrderStatus;
  orderDate: string;
  notes: string;
};

type StoredSalesOrderItem = {
  id: string;
  salesOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
};

type SalesOrderState = {
  orders: StoredSalesOrder[];
  items: StoredSalesOrderItem[];
};

const STORAGE_KEY = 'inventory-management-platform:sales-orders';

function createInitialState(): SalesOrderState {
  return {
    orders: seedData.salesOrders.map((order) => ({
      id: order.id,
      number: order.number,
      customerId: order.customerId,
      warehouseId: order.warehouseId,
      createdById: order.createdById,
      status: order.status,
      orderDate: order.orderDate,
      notes: order.notes ?? '',
    })),

    items: seedData.salesOrderItems.map((item) => ({
      id: item.id,
      salesOrderId: item.salesOrderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

function readState(): SalesOrderState {
  if (typeof window === 'undefined') {
    return createInitialState();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createInitialState();
  }

  try {
    return JSON.parse(stored) as SalesOrderState;
  } catch {
    return createInitialState();
  }
}

function writeState(state: SalesOrderState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCustomerName(customerId: string) {
  return (
    seedData.customers.find((customer) => customer.id === customerId)?.name ??
    'Unknown Customer'
  );
}

function getWarehouse(warehouseId: string) {
  return seedData.warehouses.find((warehouse) => warehouse.id === warehouseId);
}

function getCreatedByName(userId: string) {
  return (
    seedData.users.find((user) => user.id === userId)?.name ?? 'Unknown User'
  );
}

function getProduct(productId: string) {
  return seedData.products.find((product) => product.id === productId);
}

function enrichOrder(
  order: StoredSalesOrder,
  items: StoredSalesOrderItem[],
): SalesOrder {
  const warehouse = getWarehouse(order.warehouseId);

  const orderItems: SalesOrderItem[] = items
    .filter((item) => item.salesOrderId === order.id)
    .map((item) => {
      const product = getProduct(item.productId);

      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name ?? 'Unknown Product',
        sku: product?.sku ?? '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      };
    });

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  return {
    id: order.id,
    number: order.number,
    customerId: order.customerId,
    customerName: getCustomerName(order.customerId),
    warehouseId: order.warehouseId,
    warehouseName: warehouse?.name ?? 'Unknown Warehouse',
    warehouseCode: warehouse?.code ?? '',
    createdById: order.createdById,
    createdByName: getCreatedByName(order.createdById),
    status: order.status,
    orderDate: order.orderDate,
    notes: order.notes,
    subtotal,
    total: subtotal,
    items: orderItems,
  };
}

function getNextOrderNumber(orders: StoredSalesOrder[]) {
  const year = new Date().getFullYear();

  const sequenceNumbers = orders
    .map((order) => {
      const match = order.number.match(/SO-\d{4}-(\d+)/);
      return match ? Number(match[1]) : 0;
    })
    .filter((number) => Number.isFinite(number));

  const nextSequence =
    sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) + 1 : 1;

  return `SO-${year}-${String(nextSequence).padStart(3, '0')}`;
}

function getNextItemId(items: StoredSalesOrderItem[]) {
  return `sales_order_item_${String(items.length + 1).padStart(3, '0')}`;
}

function assertEditable(order: StoredSalesOrder) {
  if (order.status === 'COMPLETED') {
    throw new Error('Completed sales orders cannot be edited.');
  }

  if (order.status === 'CANCELLED') {
    throw new Error('Cancelled sales orders cannot be edited.');
  }
}

export const salesOrderService = {
  getAll(): SalesOrder[] {
    const state = readState();

    return state.orders
      .map((order) => enrichOrder(order, state.items))
      .sort((a, b) => {
        return (
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      });
  },

  getById(id: string): SalesOrder | null {
    const state = readState();

    const order = state.orders.find((item) => item.id === id);

    if (!order) {
      return null;
    }

    return enrichOrder(order, state.items);
  },

  create(values: SalesOrderFormValues, createdById: string): SalesOrder {
    const state = readState();

    const orderId = `sales_order_${Date.now()}`;
    const number = getNextOrderNumber(state.orders);

    const order: StoredSalesOrder = {
      id: orderId,
      number,
      customerId: values.customerId,
      warehouseId: values.warehouseId,
      createdById,
      status: values.status,
      orderDate: values.orderDate,
      notes: values.notes,
    };

    const items: StoredSalesOrderItem[] = values.items.map((item, index) => ({
      id: `${getNextItemId(state.items)}_${index + 1}`,
      salesOrderId: orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    state.orders.push(order);
    state.items.push(...items);

    writeState(state);

    return enrichOrder(order, state.items);
  },

  update(id: string, values: SalesOrderFormValues): SalesOrder {
    const state = readState();

    const orderIndex = state.orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) {
      throw new Error('Sales order not found.');
    }

    const currentOrder = state.orders[orderIndex];

    assertEditable(currentOrder);

    const updatedOrder: StoredSalesOrder = {
      ...currentOrder,
      customerId: values.customerId,
      warehouseId: values.warehouseId,
      status: values.status,
      orderDate: values.orderDate,
      notes: values.notes,
    };

    state.orders[orderIndex] = updatedOrder;

    state.items = state.items.filter((item) => item.salesOrderId !== id);

    const updatedItems: StoredSalesOrderItem[] = values.items.map(
      (item, index) => ({
        id: `${id}_item_${index + 1}`,
        salesOrderId: id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }),
    );

    state.items.push(...updatedItems);

    writeState(state);

    return enrichOrder(updatedOrder, state.items);
  },

  updateStatus(id: string, status: SalesOrderStatus): SalesOrder {
    const state = readState();

    const orderIndex = state.orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) {
      throw new Error('Sales order not found.');
    }

    const currentOrder = state.orders[orderIndex];

    if (currentOrder.status === 'COMPLETED') {
      throw new Error('Completed sales orders cannot change status.');
    }

    if (currentOrder.status === 'CANCELLED') {
      throw new Error('Cancelled sales orders cannot change status.');
    }

    if (status === 'DRAFT' && currentOrder.status !== 'DRAFT') {
      throw new Error('Only draft orders can remain in draft status.');
    }

    state.orders[orderIndex] = {
      ...currentOrder,
      status,
    };

    writeState(state);

    return enrichOrder(state.orders[orderIndex], state.items);
  },

  cancel(id: string): SalesOrder {
    return this.updateStatus(id, 'CANCELLED');
  },

  resetDemoData() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  },
};
