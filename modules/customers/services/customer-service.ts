'use client';

import { seedData } from '@/data/seed/inventory-seed';

import { salesOrderService } from '@/modules/sales-orders/services/sales-order-service';

import type { SalesOrder } from '@/modules/sales-orders/types/sales-order';

import type {
  Customer,
  CustomerFormValues,
  CustomerOrder,
  CustomerOrderSummary,
} from '../types/customer';

type StoredCustomer = {
  id: string;
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
};

const STORAGE_KEY = 'inventory-management-platform:customers';

function createInitialState(): StoredCustomer[] {
  return seedData.customers.map((customer) => ({
    id: customer.id,
    code: customer.code,
    name: customer.name,
    contactName: customer.contactName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    status: customer.status,
  }));
}

function readState(): StoredCustomer[] {
  if (typeof window === 'undefined') {
    return createInitialState();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createInitialState();
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return createInitialState();
    }

    return parsed as StoredCustomer[];
  } catch {
    return createInitialState();
  }
}

function writeState(customers: StoredCustomer[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

function enrichCustomer(customer: StoredCustomer): Customer {
  return {
    id: customer.id,
    code: customer.code,
    name: customer.name,
    contactName: customer.contactName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    status: customer.status,
  };
}

function getNextCustomerCode(customers: StoredCustomer[]) {
  const sequenceNumbers = customers
    .map((customer) => {
      const match = customer.code.match(/CUS-(\d+)/i);

      return match ? Number(match[1]) : 0;
    })
    .filter((value) => Number.isFinite(value));

  const nextSequence =
    sequenceNumbers.length > 0 ?
      Math.max(...sequenceNumbers) + 1
    : customers.length + 1;

  return `CUS-${String(nextSequence).padStart(3, '0')}`;
}

function toCustomerOrder(order: SalesOrder): CustomerOrder {
  return {
    id: order.id,
    number: order.number,
    warehouseName: order.warehouseName,
    warehouseCode: order.warehouseCode,
    orderDate: order.orderDate,
    status: order.status,
    total: order.total,
    itemCount: order.items.length,
  };
}

export const customerService = {
  getAll(): Customer[] {
    return readState()
      .map(enrichCustomer)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  getById(id: string): Customer | null {
    const customer = readState().find((item) => item.id === id);

    return customer ? enrichCustomer(customer) : null;
  },

  create(values: CustomerFormValues): Customer {
    const customers = readState();

    const normalizedCode = values.code.trim().toUpperCase();

    const duplicateCode = customers.some(
      (customer) => customer.code.toUpperCase() === normalizedCode,
    );

    if (duplicateCode) {
      throw new Error('A customer with this code already exists.');
    }

    const id = `customer_${Date.now()}`;

    const customer: StoredCustomer = {
      id,
      code: normalizedCode || getNextCustomerCode(customers),
      name: values.name.trim(),
      contactName: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      status: values.status,
    };

    customers.push(customer);

    writeState(customers);

    return enrichCustomer(customer);
  },

  update(id: string, values: CustomerFormValues): Customer {
    const customers = readState();

    const index = customers.findIndex((customer) => customer.id === id);

    if (index === -1) {
      throw new Error('Customer not found.');
    }

    const normalizedCode = values.code.trim().toUpperCase();

    const duplicateCode = customers.some(
      (customer, customerIndex) =>
        customerIndex !== index &&
        customer.code.toUpperCase() === normalizedCode,
    );

    if (duplicateCode) {
      throw new Error('A customer with this code already exists.');
    }

    const updatedCustomer: StoredCustomer = {
      ...customers[index],
      code: normalizedCode,
      name: values.name.trim(),
      contactName: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      status: values.status,
    };

    customers[index] = updatedCustomer;

    writeState(customers);

    return enrichCustomer(updatedCustomer);
  },

  updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Customer {
    const customers = readState();

    const index = customers.findIndex((customer) => customer.id === id);

    if (index === -1) {
      throw new Error('Customer not found.');
    }

    customers[index] = {
      ...customers[index],
      status,
    };

    writeState(customers);

    return enrichCustomer(customers[index]);
  },

  getOrders(customerId: string): CustomerOrder[] {
    return salesOrderService
      .getAll()
      .filter((order) => order.customerId === customerId)
      .map(toCustomerOrder)
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
      );
  },

  getOrderSummary(customerId: string): CustomerOrderSummary {
    const orders = salesOrderService
      .getAll()
      .filter((order) => order.customerId === customerId);

    return {
      totalOrders: orders.length,

      openOrders: orders.filter((order) =>
        ['CONFIRMED', 'PROCESSING'].includes(order.status),
      ).length,

      completedOrders: orders.filter((order) => order.status === 'COMPLETED')
        .length,

      totalValue: orders.reduce((sum, order) => sum + order.total, 0),
    };
  },

  resetDemoData() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  },
};
