import { seedData } from '@/data/seed/inventory-seed';

import { inventoryService } from '@/modules/inventory/services/inventory-service';

import type {
  PurchaseOrder,
  PurchaseOrderFormValues,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  PurchaseReceipt,
  PurchaseReceiptItem,
  ReceivePurchaseOrderInput,
} from '../types/purchase-order';

type PurchaseOrderState = {
  orders: {
    id: string;
    number: string;
    supplierId: string;
    warehouseId: string;
    createdById: string;
    status: PurchaseOrderStatus;
    orderDate: string;
    expectedDate: string;
    notes: string;
  }[];

  items: {
    id: string;
    purchaseOrderId: string;
    productId: string;
    quantity: number;
    unitCost: number;
  }[];

  receipts: PurchaseReceipt[];

  receiptItems: PurchaseReceiptItem[];
};

const STORAGE_KEY = 'inventory-management-platform:purchase-orders';

let state: PurchaseOrderState | null = null;

function createInitialState(): PurchaseOrderState {
  return {
    orders: seedData.purchaseOrders.map((order) => ({
      id: order.id,
      number: order.number,
      supplierId: order.supplierId,
      warehouseId: order.warehouseId,
      createdById: order.createdById,
      status: order.status as PurchaseOrderStatus,
      orderDate: order.orderDate,
      expectedDate: order.expectedDate,
      notes: order.notes ?? '',
    })),

    items: seedData.purchaseOrderItems.map((item) => ({
      id: item.id,
      purchaseOrderId: item.purchaseOrderId,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
    })),

    receipts: seedData.goodsReceipts.map((receipt) => ({
      id: receipt.id,
      number: receipt.number,
      purchaseOrderId: receipt.purchaseOrderId,
      warehouseId: receipt.warehouseId,
      receivedById: receipt.receivedById,
      status: receipt.status,
      receivedDate: receipt.receivedDate,
      notes: 'notes' in receipt ? receipt.notes : '',
    })),

    receiptItems: seedData.goodsReceiptItems.map((item) => ({
      id: item.id,
      receiptId: item.receiptId,
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
}

function initialize() {
  if (state) {
    return;
  }

  if (typeof window === 'undefined') {
    state = createInitialState();
    return;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    state = createInitialState();
    return;
  }

  try {
    state = JSON.parse(stored) as PurchaseOrderState;
  } catch {
    state = createInitialState();
  }
}

function persist() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createId(prefix: string) {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getNextNumber(prefix: 'PO' | 'GRN') {
  initialize();

  const values =
    prefix === 'PO' ?
      state?.orders.map((item) => item.number)
    : state?.receipts.map((item) => item.number);

  const numbers = (values ?? [])
    .map((value) => {
      const match = value.match(new RegExp(`${prefix}-2026-(\\d+)`));

      return match ? Number(match[1]) : 0;
    })
    .filter(Boolean);

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `${prefix}-2026-${String(next).padStart(3, '0')}`;
}

function getReceivedQuantity(purchaseOrderItemId: string) {
  initialize();

  const item = state?.items.find((value) => value.id === purchaseOrderItemId);

  if (!item) {
    return 0;
  }

  return (state?.receipts ?? [])
    .filter((receipt) => receipt.purchaseOrderId === item.purchaseOrderId)
    .flatMap((receipt) =>
      (state?.receiptItems ?? []).filter(
        (receiptItem) =>
          receiptItem.receiptId === receipt.id &&
          receiptItem.productId === item.productId,
      ),
    )
    .reduce((total, receiptItem) => total + receiptItem.quantity, 0);
}

function enrichOrder(orderId: string): PurchaseOrder | null {
  initialize();

  const order = state?.orders.find((item) => item.id === orderId);

  if (!order) {
    return null;
  }

  const supplier = seedData.suppliers.find(
    (item) => item.id === order.supplierId,
  );

  const warehouse = seedData.warehouses.find(
    (item) => item.id === order.warehouseId,
  );

  const createdBy = seedData.users.find(
    (item) => item.id === order.createdById,
  );

  const items: PurchaseOrderItem[] = (state?.items ?? [])
    .filter((item) => item.purchaseOrderId === order.id)
    .map((item) => {
      const product = seedData.products.find(
        (product) => product.id === item.productId,
      );

      const receivedQuantity = getReceivedQuantity(item.id);

      const outstandingQuantity = Math.max(item.quantity - receivedQuantity, 0);

      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name ?? 'Unknown product',
        sku: product?.sku ?? 'N/A',
        quantity: item.quantity,
        receivedQuantity,
        outstandingQuantity,
        unitCost: item.unitCost,
        total: item.quantity * item.unitCost,
      };
    });

  const subtotal = items.reduce((total, item) => total + item.total, 0);

  return {
    id: order.id,
    number: order.number,
    supplierId: order.supplierId,
    supplierName: supplier?.name ?? 'Unknown supplier',
    warehouseId: order.warehouseId,
    warehouseName: warehouse?.name ?? 'Unknown warehouse',
    warehouseCode: warehouse?.code ?? 'N/A',
    createdById: order.createdById,
    createdByName: createdBy?.name ?? 'Unknown user',
    status: order.status,
    orderDate: order.orderDate,
    expectedDate: order.expectedDate,
    notes: order.notes,
    subtotal,
    total: subtotal,
    items,
  };
}

export const purchaseOrderService = {
  getAll(): PurchaseOrder[] {
    initialize();

    return (state?.orders ?? [])
      .map((order) => enrichOrder(order.id))
      .filter((order): order is PurchaseOrder => Boolean(order))
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
      );
  },

  getById(id: string): PurchaseOrder | null {
    return enrichOrder(id);
  },

  getReceipts(purchaseOrderId: string) {
    initialize();

    return (state?.receipts ?? [])
      .filter((receipt) => receipt.purchaseOrderId === purchaseOrderId)
      .map((receipt) => ({
        ...receipt,
        receivedByName:
          seedData.users.find((user) => user.id === receipt.receivedById)
            ?.name ?? 'Unknown user',
        items: (state?.receiptItems ?? [])
          .filter((item) => item.receiptId === receipt.id)
          .map((item) => {
            const product = seedData.products.find(
              (product) => product.id === item.productId,
            );

            return {
              ...item,
              productName: product?.name ?? 'Unknown product',
              sku: product?.sku ?? 'N/A',
            };
          }),
      }));
  },

  create(values: PurchaseOrderFormValues, createdById: string) {
    initialize();

    if (values.items.length === 0) {
      throw new Error('At least one product is required.');
    }

    const orderId = createId('po');

    const order = {
      id: orderId,
      number: getNextNumber('PO'),
      supplierId: values.supplierId,
      warehouseId: values.warehouseId,
      createdById,
      status: values.status,
      orderDate: values.orderDate,
      expectedDate: values.expectedDate,
      notes: values.notes.trim(),
    };

    const items = values.items.map((item) => ({
      id: createId('poi'),
      purchaseOrderId: orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
    }));

    state?.orders.push(order);
    state?.items.push(...items);

    persist();

    const result = enrichOrder(orderId);

    if (!result) {
      throw new Error('Purchase order could not be created.');
    }

    return result;
  },

  update(id: string, values: PurchaseOrderFormValues) {
    initialize();

    const order = state?.orders.find((item) => item.id === id);

    if (!order) {
      throw new Error('Purchase order could not be found.');
    }

    if (order.status === 'RECEIVED' || order.status === 'CANCELLED') {
      throw new Error('This purchase order can no longer be edited.');
    }

    const existingItems = (state?.items ?? []).filter(
      (item) => item.purchaseOrderId !== id,
    );

    order.supplierId = values.supplierId;
    order.warehouseId = values.warehouseId;
    order.status = values.status;
    order.orderDate = values.orderDate;
    order.expectedDate = values.expectedDate;
    order.notes = values.notes.trim();

    const nextItems = values.items.map((item) => ({
      id: createId('poi'),
      purchaseOrderId: id,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
    }));

    state!.items = [...existingItems, ...nextItems];

    persist();

    const result = enrichOrder(id);

    if (!result) {
      throw new Error('Purchase order could not be updated.');
    }

    return result;
  },

  updateStatus(id: string, status: PurchaseOrderStatus) {
    initialize();

    const order = state?.orders.find((item) => item.id === id);

    if (!order) {
      throw new Error('Purchase order could not be found.');
    }

    order.status = status;

    persist();

    return enrichOrder(id);
  },

  receive(input: ReceivePurchaseOrderInput) {
    initialize();

    const order = state?.orders.find(
      (item) => item.id === input.purchaseOrderId,
    );

    if (!order) {
      throw new Error('Purchase order could not be found.');
    }

    if (order.status === 'RECEIVED' || order.status === 'CANCELLED') {
      throw new Error('This purchase order cannot receive stock.');
    }

    const enriched = enrichOrder(order.id);

    if (!enriched) {
      throw new Error('Purchase order could not be loaded.');
    }

    const receiveItems = input.items.filter((item) => item.quantity > 0);

    if (!receiveItems.length) {
      throw new Error('Enter at least one receiving quantity.');
    }

    for (const inputItem of receiveItems) {
      const orderItem = enriched.items.find(
        (item) => item.id === inputItem.purchaseOrderItemId,
      );

      if (!orderItem) {
        throw new Error('A purchase order item could not be found.');
      }

      if (inputItem.quantity > orderItem.outstandingQuantity) {
        throw new Error(
          `${orderItem.productName} can only receive ${orderItem.outstandingQuantity} more unit(s).`,
        );
      }
    }

    const receiptId = createId('grn');

    const receipt: PurchaseReceipt = {
      id: receiptId,
      number: getNextNumber('GRN'),
      purchaseOrderId: order.id,
      warehouseId: order.warehouseId,
      receivedById: input.receivedById,
      status: 'COMPLETED',
      receivedDate: input.receivedDate,
      notes: input.notes?.trim() ?? '',
    };

    state?.receipts.push(receipt);

    for (const inputItem of receiveItems) {
      const orderItem = enriched.items.find(
        (item) => item.id === inputItem.purchaseOrderItemId,
      );

      if (!orderItem) {
        continue;
      }

      state?.receiptItems.push({
        id: createId('grni'),
        receiptId,
        productId: orderItem.productId,
        quantity: inputItem.quantity,
      });

      /*
       * The current demo inventory service exposes
       * stock adjustment as its mutation API.
       * In the Prisma/API phase this should become
       * a dedicated PURCHASE_RECEIPT inventory transaction.
       */
      inventoryService.adjustStock({
        productId: orderItem.productId,
        warehouseId: order.warehouseId,
        type: 'INCREASE',
        quantity: inputItem.quantity,
        reason: 'OTHER',
        notes: `Purchase receipt ${receipt.number} for ${order.number}`,
        performedById: input.receivedById,
      });
    }

    const updatedOrder = enrichOrder(order.id);

    if (!updatedOrder) {
      throw new Error('Purchase order could not be updated.');
    }

    const allReceived = updatedOrder.items.every(
      (item) => item.outstandingQuantity === 0,
    );

    const hasReceived = updatedOrder.items.some(
      (item) => item.receivedQuantity > 0,
    );

    order.status =
      allReceived ? 'RECEIVED'
      : hasReceived ? 'PARTIALLY_RECEIVED'
      : order.status;

    persist();

    return {
      receipt,
      purchaseOrder: enrichOrder(order.id),
    };
  },

  cancel(id: string) {
    initialize();

    const order = state?.orders.find((item) => item.id === id);

    if (!order) {
      throw new Error('Purchase order could not be found.');
    }

    if (order.status === 'RECEIVED') {
      throw new Error('A received purchase order cannot be cancelled.');
    }

    order.status = 'CANCELLED';

    persist();

    return enrichOrder(id);
  },

  resetDemoData() {
    state = createInitialState();

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },
};
