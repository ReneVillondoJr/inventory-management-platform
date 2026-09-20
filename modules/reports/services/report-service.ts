import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  FileBarChart,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

import { inventoryService } from '@/modules/inventory/services/inventory-service';
import { purchaseOrderService } from '@/modules/purchase-orders/services/purchase-order-service';
import { salesOrderService } from '@/modules/sales-orders/services/sales-order-service';
import { stockService } from '@/modules/inventory/services/stock-service';
import { warehouseService } from '@/modules/warehouses/services/warehouse-service';

import type {
  InventoryReportData,
  InventoryReportRow,
  PurchasingReportData,
  PurchasingReportOrder,
  PurchasingSupplierRow,
  ReportFilters,
  ReportSummaryItem,
  ReportType,
  ReportWarehouseOption,
  ReportsData,
  SalesCustomerRow,
  SalesReportData,
  SalesReportOrder,
  StockMovementDirection,
  StockMovementReportData,
  StockMovementReportRow,
  StockMovementType,
} from '../types/report';

const STORAGE_KEY = 'inventory-management-platform:stock-movements';

type GenericRecord = Record<string, unknown>;

type DateBounds = {
  from?: string;
  to?: string;
};

function isRecord(value: unknown): value is GenericRecord {
  return typeof value === 'object' && value !== null;
}

function toRecord(value: unknown): GenericRecord {
  return isRecord(value) ? value : {};
}

function toStringValue(value: unknown, fallback = '') {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function toNumberValue(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = Number(value.replace(/,/g, ''));

    return Number.isFinite(normalized) ? normalized : fallback;
  }

  return fallback;
}

function firstString(
  record: GenericRecord,
  keys: readonly string[],
  fallback = '',
) {
  for (const key of keys) {
    const value = toStringValue(record[key]);

    if (value) {
      return value;
    }
  }

  return fallback;
}

function firstNumber(
  record: GenericRecord,
  keys: readonly string[],
  fallback = 0,
) {
  for (const key of keys) {
    const value = toNumberValue(record[key], Number.NaN);

    if (Number.isFinite(value)) {
      return value;
    }
  }

  return fallback;
}

function normalizeDate(value: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function isDateInBounds(dateValue: string, bounds: DateBounds) {
  if (!dateValue) {
    return true;
  }

  if (bounds.from && dateValue < bounds.from) {
    return false;
  }

  if (bounds.to && dateValue > bounds.to) {
    return false;
  }

  return true;
}

function getDaysAgo(dateValue: string, days: number) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  date.setDate(date.getDate() - days);

  return date.toISOString().slice(0, 10);
}

function getDateBounds(filters: ReportFilters, anchorDate: string): DateBounds {
  if (filters.dateRange === 'ALL') {
    return {};
  }

  if (filters.dateRange === 'CUSTOM') {
    return {
      from: filters.dateFrom || undefined,
      to: filters.dateTo || undefined,
    };
  }

  if (!anchorDate) {
    return {};
  }

  const days =
    filters.dateRange === '7D' ? 7
    : filters.dateRange === '30D' ? 30
    : 90;

  return {
    from: getDaysAgo(anchorDate, days),
    to: anchorDate,
  };
}

function matchesSearch(values: readonly string[], search: string) {
  if (!search.trim()) {
    return true;
  }

  const query = search.trim().toLowerCase();

  return values.some((value) => value.toLowerCase().includes(query));
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function matchesWarehouseSelection(
  filters: ReportFilters,
  movement: {
    warehouseId?: string;
    warehouseName?: string;
    warehouseCode?: string;
  },
  selectedWarehouse?: ReportWarehouseOption,
) {
  if (filters.warehouseId === 'ALL') {
    return true;
  }

  const selectedWarehouseName = selectedWarehouse?.name ?? '';
  const selectedWarehouseCode = selectedWarehouse?.code ?? '';

  return (
    movement.warehouseId === filters.warehouseId ||
    movement.warehouseName === filters.warehouseId ||
    movement.warehouseCode === filters.warehouseId ||
    movement.warehouseName === selectedWarehouseName ||
    movement.warehouseCode === selectedWarehouseCode
  );
}

function getRawMovements() {
  try {
    const service = stockService as unknown as {
      getMovements?: () => unknown;
    };

    const serviceMovements = service.getMovements?.();

    if (Array.isArray(serviceMovements)) {
      return serviceMovements.filter(isRecord);
    }

    if (typeof window === 'undefined') {
      return [];
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed.filter(isRecord) : [];
  } catch {
    return [];
  }
}

function normalizeMovement(
  movement: GenericRecord,
  index: number,
): StockMovementReportRow {
  const rawType = firstString(movement, [
    'movementType',
    'type',
    'transactionType',
    'movement',
    'reason',
  ]).toUpperCase();

  const rawDirection = firstString(movement, [
    'direction',
    'stockDirection',
  ]).toUpperCase();

  const rawQuantity = firstNumber(movement, [
    'quantity',
    'quantityChanged',
    'change',
    'units',
  ]);

  const movementType: StockMovementType =
    (
      rawType.includes('PURCHASE') ||
      rawType.includes('RECEIPT') ||
      rawType.includes('GRN')
    ) ?
      'PURCHASE_RECEIPT'
    : rawType.includes('SALE') ? 'SALE'
    : rawType.includes('TRANSFER') ? 'TRANSFER'
    : rawType.includes('RETURN') ? 'RETURN'
    : (
      rawType.includes('ADJUST') ||
      rawType.includes('CYCLE') ||
      rawType.includes('COUNT')
    ) ?
      'ADJUSTMENT'
    : 'OTHER';

  let direction: StockMovementDirection;

  if (rawDirection.includes('IN')) {
    direction = 'IN';
  } else if (rawDirection.includes('OUT')) {
    direction = 'OUT';
  } else if (rawQuantity < 0) {
    direction = 'OUT';
  } else if (movementType === 'PURCHASE_RECEIPT' || movementType === 'RETURN') {
    direction = 'IN';
  } else if (movementType === 'SALE') {
    direction = 'OUT';
  } else {
    direction = 'NEUTRAL';
  }

  const absoluteQuantity = Math.abs(rawQuantity);

  return {
    id: firstString(movement, ['id', 'movementId']) || `movement-${index + 1}`,
    date: normalizeDate(
      firstString(movement, [
        'date',
        'movementDate',
        'transactionDate',
        'createdAt',
        'createdDate',
      ]),
    ),
    movementType,
    direction,
    referenceNumber: firstString(movement, [
      'referenceNumber',
      'reference',
      'transactionNumber',
      'documentNumber',
      'orderNumber',
      'number',
    ]),
    productName: firstString(movement, ['productName', 'itemName']),
    sku: firstString(movement, ['sku', 'productSku']),
    warehouseName: firstString(movement, ['warehouseName', 'warehouse']),
    quantity: absoluteQuantity,
    unit: firstString(movement, ['unit', 'unitName']) || 'unit(s)',
    reason: firstString(movement, ['reason', 'notes', 'description']),
    performedByName: firstString(movement, [
      'performedByName',
      'createdByName',
      'userName',
      'processedByName',
      'performedBy',
    ]),
  };
}

function getLatestMovementDate(movements: readonly GenericRecord[]) {
  return (
    movements
      .map((movement) =>
        normalizeDate(
          firstString(movement, [
            'date',
            'movementDate',
            'transactionDate',
            'createdAt',
            'createdDate',
          ]),
        ),
      )
      .filter(Boolean)
      .sort()
      .at(-1) ?? ''
  );
}

function getLatestOrderDate(
  purchaseOrders: readonly GenericRecord[],
  salesOrders: readonly GenericRecord[],
) {
  const dates = [
    ...purchaseOrders.map((order) =>
      normalizeDate(firstString(order, ['orderDate', 'createdAt'])),
    ),
    ...salesOrders.map((order) =>
      normalizeDate(firstString(order, ['orderDate', 'createdAt'])),
    ),
  ].filter(Boolean);

  return dates.sort().at(-1) ?? '';
}

function getInventoryReport(filters: ReportFilters): InventoryReportData {
  const inventoryRecords = (
    inventoryService.getInventoryRecords() as unknown as readonly unknown[]
  )
    .map(toRecord)
    .filter(Boolean);

  const rows: InventoryReportRow[] = [];

  for (const record of inventoryRecords) {
    const warehouseId = firstString(record, ['warehouseId']);

    if (filters.warehouseId !== 'ALL' && warehouseId !== filters.warehouseId) {
      continue;
    }

    const productName = firstString(record, ['productName', 'name']);

    const sku = firstString(record, ['sku']);

    const categoryName = firstString(record, ['categoryName', 'category']);

    const brandName = firstString(record, ['brandName', 'brand']);

    if (
      !matchesSearch(
        [
          productName,
          sku,
          categoryName,
          brandName,
          firstString(record, ['warehouseName']),
        ],
        filters.search,
      )
    ) {
      continue;
    }

    const quantity = firstNumber(record, ['quantity', 'stock', 'onHand']);

    const reorderLevel = firstNumber(record, [
      'reorderLevel',
      'reorderPoint',
      'minimumStock',
    ]);

    const costPrice = firstNumber(record, ['costPrice', 'unitCost']);

    const inventoryValue = firstNumber(
      record,
      ['inventoryValue', 'totalValue'],
      quantity * costPrice,
    );

    const status =
      quantity <= 0 ? 'OUT_OF_STOCK'
      : quantity <= reorderLevel ? 'LOW_STOCK'
      : 'IN_STOCK';

    rows.push({
      productId: firstString(record, ['productId', 'id']),
      sku,
      productName,
      categoryName,
      brandName,
      warehouseId,
      warehouseName: firstString(record, ['warehouseName', 'warehouse']),
      quantity,
      reorderLevel,
      unit: firstString(record, ['unit']) || 'unit(s)',
      costPrice,
      inventoryValue,
      status,
    });
  }

  rows.sort((a, b) => {
    if (a.status !== b.status) {
      const rank = {
        OUT_OF_STOCK: 0,
        LOW_STOCK: 1,
        IN_STOCK: 2,
      } as const;

      return rank[a.status] - rank[b.status];
    }

    return a.productName.localeCompare(b.productName);
  });

  return {
    rows,
    totalProducts: rows.length,
    totalUnits: rows.reduce((sum, row) => sum + row.quantity, 0),
    inventoryValue: rows.reduce((sum, row) => sum + row.inventoryValue, 0),
    lowStockItems: rows.filter((row) => row.status === 'LOW_STOCK').length,
    outOfStockItems: rows.filter((row) => row.status === 'OUT_OF_STOCK').length,
  };
}

function getPurchasingReport(
  filters: ReportFilters,
  bounds: DateBounds,
): PurchasingReportData {
  const source = (
    purchaseOrderService.getAll() as unknown as readonly unknown[]
  ).map(toRecord);

  const orders: PurchasingReportOrder[] = [];

  for (const record of source) {
    const warehouseId = firstString(record, ['warehouseId']);
    const orderDate = normalizeDate(
      firstString(record, ['orderDate', 'createdAt']),
    );

    if (filters.warehouseId !== 'ALL' && warehouseId !== filters.warehouseId) {
      continue;
    }

    if (!isDateInBounds(orderDate, bounds)) {
      continue;
    }

    const order = {
      id: firstString(record, ['id']),
      number: firstString(record, ['number', 'orderNumber']),
      supplierName: firstString(record, ['supplierName', 'supplier']),
      warehouseName: firstString(record, ['warehouseName', 'warehouse']),
      warehouseCode: firstString(record, ['warehouseCode']),
      orderDate,
      expectedDate: normalizeDate(firstString(record, ['expectedDate'])),
      status: firstString(record, ['status']) || 'DRAFT',
      total: firstNumber(record, ['total', 'subtotal']),
      itemCount:
        Array.isArray(record.items) ?
          record.items.length
        : firstNumber(record, ['itemCount']),
    };

    if (
      !matchesSearch(
        [order.number, order.supplierName, order.warehouseName, order.status],
        filters.search,
      )
    ) {
      continue;
    }

    orders.push(order);
  }

  orders.sort((a, b) => b.orderDate.localeCompare(a.orderDate));

  const supplierMap = new Map<string, PurchasingSupplierRow>();

  for (const order of orders) {
    const key = order.supplierName || 'Unknown Supplier';

    const current = supplierMap.get(key) ?? {
      supplierName: key,
      orderCount: 0,
      openOrders: 0,
      receivedOrders: 0,
      totalValue: 0,
    };

    current.orderCount += 1;
    current.totalValue += order.total;

    if (order.status === 'RECEIVED' || order.status === 'CANCELLED') {
      if (order.status === 'RECEIVED') {
        current.receivedOrders += 1;
      }
    } else {
      current.openOrders += 1;
    }

    supplierMap.set(key, current);
  }

  const suppliers = Array.from(supplierMap.values()).sort(
    (a, b) => b.totalValue - a.totalValue,
  );

  return {
    orders,
    suppliers,
    totalOrders: orders.length,
    openOrders: orders.filter(
      (order) => !['RECEIVED', 'CANCELLED'].includes(order.status),
    ).length,
    receivedOrders: orders.filter((order) => order.status === 'RECEIVED')
      .length,
    totalValue: orders.reduce((sum, order) => sum + order.total, 0),
  };
}

function getSalesReport(
  filters: ReportFilters,
  bounds: DateBounds,
): SalesReportData {
  const source = (
    salesOrderService.getAll() as unknown as readonly unknown[]
  ).map(toRecord);

  const orders: SalesReportOrder[] = [];

  for (const record of source) {
    const warehouseId = firstString(record, ['warehouseId']);
    const orderDate = normalizeDate(
      firstString(record, ['orderDate', 'createdAt']),
    );

    if (filters.warehouseId !== 'ALL' && warehouseId !== filters.warehouseId) {
      continue;
    }

    if (!isDateInBounds(orderDate, bounds)) {
      continue;
    }

    const order = {
      id: firstString(record, ['id']),
      number: firstString(record, ['number', 'orderNumber']),
      customerName: firstString(record, ['customerName', 'customer']),
      warehouseName: firstString(record, ['warehouseName', 'warehouse']),
      warehouseCode: firstString(record, ['warehouseCode']),
      orderDate,
      status: firstString(record, ['status']) || 'DRAFT',
      total: firstNumber(record, ['total', 'subtotal']),
      itemCount:
        Array.isArray(record.items) ?
          record.items.length
        : firstNumber(record, ['itemCount']),
    };

    if (
      !matchesSearch(
        [order.number, order.customerName, order.warehouseName, order.status],
        filters.search,
      )
    ) {
      continue;
    }

    orders.push(order);
  }

  orders.sort((a, b) => b.orderDate.localeCompare(a.orderDate));

  const customerMap = new Map<string, SalesCustomerRow>();

  for (const order of orders) {
    const key = order.customerName || 'Unknown Customer';

    const current = customerMap.get(key) ?? {
      customerName: key,
      orderCount: 0,
      openOrders: 0,
      completedOrders: 0,
      totalValue: 0,
    };

    current.orderCount += 1;
    current.totalValue += order.total;

    if (order.status === 'COMPLETED') {
      current.completedOrders += 1;
    } else if (order.status !== 'CANCELLED') {
      current.openOrders += 1;
    }

    customerMap.set(key, current);
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalValue - a.totalValue,
  );

  return {
    orders,
    customers,
    totalOrders: orders.length,
    openOrders: orders.filter(
      (order) => !['COMPLETED', 'CANCELLED'].includes(order.status),
    ).length,
    completedOrders: orders.filter((order) => order.status === 'COMPLETED')
      .length,
    totalValue: orders.reduce((sum, order) => sum + order.total, 0),
  };
}

function getStockMovementReport(
  filters: ReportFilters,
  bounds: DateBounds,
  rawMovements: readonly GenericRecord[],
): StockMovementReportData {
  const selectedWarehouse =
    filters.warehouseId === 'ALL' ?
      undefined
    : reportService
        .getWarehouses()
        .find((warehouse) => warehouse.id === filters.warehouseId);

  const normalizedRows = rawMovements
    .map(normalizeMovement)
    .filter((movement) => {
      if (!isDateInBounds(movement.date, bounds)) {
        return false;
      }

      const source = rawMovements.find(
        (record) => firstString(record, ['id', 'movementId']) === movement.id,
      );

      if (
        !matchesWarehouseSelection(
          filters,
          {
            warehouseId: source ? firstString(source, ['warehouseId']) : '',
            warehouseName: movement.warehouseName,
            warehouseCode: source ? firstString(source, ['warehouseCode']) : '',
          },
          selectedWarehouse,
        )
      ) {
        return false;
      }

      return matchesSearch(
        [
          movement.referenceNumber,
          movement.productName,
          movement.sku,
          movement.warehouseName,
          movement.reason,
          movement.performedByName,
          movement.movementType,
        ],
        filters.search,
      );
    });

  const filteredRows = normalizedRows.filter((row) => {
    if (filters.warehouseId === 'ALL') {
      return true;
    }

    const source = rawMovements.find(
      (movement) => firstString(movement, ['id', 'movementId']) === row.id,
    );

    if (!source) {
      return true;
    }

    return matchesWarehouseSelection(
      filters,
      {
        warehouseId: firstString(source, ['warehouseId']),
        warehouseName: firstString(source, ['warehouseName', 'warehouse']),
        warehouseCode: firstString(source, ['warehouseCode']),
      },
      selectedWarehouse,
    );
  });

  filteredRows.sort((a, b) => b.date.localeCompare(a.date));

  const inboundUnits = filteredRows
    .filter((movement) => movement.direction === 'IN')
    .reduce((sum, movement) => sum + movement.quantity, 0);

  const outboundUnits = filteredRows
    .filter((movement) => movement.direction === 'OUT')
    .reduce((sum, movement) => sum + movement.quantity, 0);

  return {
    rows: filteredRows,
    totalMovements: filteredRows.length,
    inboundUnits,
    outboundUnits,
    transferCount: filteredRows.filter(
      (movement) => movement.movementType === 'TRANSFER',
    ).length,
    returnCount: filteredRows.filter(
      (movement) => movement.movementType === 'RETURN',
    ).length,
    adjustmentCount: filteredRows.filter(
      (movement) => movement.movementType === 'ADJUSTMENT',
    ).length,
    netUnits: inboundUnits - outboundUnits,
  };
}

function getSummary(
  reportType: ReportType,
  inventory: InventoryReportData,
  purchasing: PurchasingReportData,
  sales: SalesReportData,
  stockMovements: StockMovementReportData,
): ReportSummaryItem[] {
  if (reportType === 'inventory') {
    return [
      {
        label: 'Inventory Value',
        value: formatCurrency(inventory.inventoryValue),
        helper: `${formatCompactNumber(inventory.totalProducts)} tracked products`,
        icon: CircleDollarSign,
      },
      {
        label: 'Units On Hand',
        value: formatCompactNumber(inventory.totalUnits),
        helper: 'Across selected warehouses',
        icon: Boxes,
      },
      {
        label: 'Low Stock',
        value: formatCompactNumber(inventory.lowStockItems),
        helper: 'At or below reorder level',
        icon: PackageSearch,
      },
      {
        label: 'Out of Stock',
        value: formatCompactNumber(inventory.outOfStockItems),
        helper: 'No available stock',
        icon: PackageCheck,
      },
    ];
  }

  if (reportType === 'purchasing') {
    return [
      {
        label: 'Purchase Value',
        value: formatCurrency(purchasing.totalValue),
        helper: `${formatCompactNumber(purchasing.totalOrders)} purchase orders`,
        icon: CircleDollarSign,
      },
      {
        label: 'Purchase Orders',
        value: formatCompactNumber(purchasing.totalOrders),
        helper: 'Matching selected filters',
        icon: ClipboardList,
      },
      {
        label: 'Open Orders',
        value: formatCompactNumber(purchasing.openOrders),
        helper: 'Pending receipt or completion',
        icon: PackageSearch,
      },
      {
        label: 'Received Orders',
        value: formatCompactNumber(purchasing.receivedOrders),
        helper: 'Fully received orders',
        icon: PackageCheck,
      },
    ];
  }

  if (reportType === 'sales') {
    return [
      {
        label: 'Sales Revenue',
        value: formatCurrency(sales.totalValue),
        helper: `${formatCompactNumber(sales.totalOrders)} sales orders`,
        icon: TrendingUp,
      },
      {
        label: 'Sales Orders',
        value: formatCompactNumber(sales.totalOrders),
        helper: 'Matching selected filters',
        icon: ShoppingCart,
      },
      {
        label: 'Open Orders',
        value: formatCompactNumber(sales.openOrders),
        helper: 'Not completed or cancelled',
        icon: PackageSearch,
      },
      {
        label: 'Completed Orders',
        value: formatCompactNumber(sales.completedOrders),
        helper: 'Successfully completed',
        icon: PackageCheck,
      },
    ];
  }

  return [
    {
      label: 'Total Movements',
      value: formatCompactNumber(stockMovements.totalMovements),
      helper: 'Matching selected filters',
      icon: FileBarChart,
    },
    {
      label: 'Inbound Units',
      value: formatCompactNumber(stockMovements.inboundUnits),
      helper: 'Received or returned stock',
      icon: ArrowDownToLine,
    },
    {
      label: 'Outbound Units',
      value: formatCompactNumber(stockMovements.outboundUnits),
      helper: 'Sales and stock issues',
      icon: ArrowUpFromLine,
    },
    {
      label: 'Net Units',
      value: formatCompactNumber(stockMovements.netUnits),
      helper: 'Inbound less outbound',
      icon: RotateCcw,
    },
  ];
}

export const reportService = {
  getWarehouses(): ReportWarehouseOption[] {
    const warehouses = (
      warehouseService.getAll() as unknown as readonly unknown[]
    ).map(toRecord);

    return warehouses
      .map((warehouse) => ({
        id: firstString(warehouse, ['id']),
        name: firstString(warehouse, ['name']),
        code: firstString(warehouse, ['code']),
      }))
      .filter((warehouse) => warehouse.id && warehouse.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  getReportData(filters: ReportFilters): ReportsData {
    const rawMovements = getRawMovements();

    const purchaseOrders = (
      purchaseOrderService.getAll() as unknown as readonly unknown[]
    ).map(toRecord);

    const salesOrders = (
      salesOrderService.getAll() as unknown as readonly unknown[]
    ).map(toRecord);

    const latestOrderDate = getLatestOrderDate(purchaseOrders, salesOrders);

    const latestMovementDate = getLatestMovementDate(rawMovements);

    const anchorDate =
      [latestOrderDate, latestMovementDate].filter(Boolean).sort().at(-1) ?? '';

    const bounds = getDateBounds(filters, anchorDate);

    const inventory = getInventoryReport(filters);

    const purchasing = getPurchasingReport(filters, bounds);

    const sales = getSalesReport(filters, bounds);

    const stockMovements = getStockMovementReport(
      filters,
      bounds,
      rawMovements,
    );

    return {
      summary: getSummary(
        filters.reportType,
        inventory,
        purchasing,
        sales,
        stockMovements,
      ),
      inventory,
      purchasing,
      sales,
      stockMovements,
    };
  },
};
