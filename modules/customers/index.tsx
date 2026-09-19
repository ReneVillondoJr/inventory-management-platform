export { CustomerDetails } from './components/customer-details';
export { CustomerForm } from './components/customer-form';
export { CustomerList } from './components/customer-list';
export { CustomerOrders } from './components/customer-orders';
export { CustomerTable } from './components/customer-table';

export { useCustomerForm } from './hooks/use-customer-form';

export { customerService } from './services/customer-service';

export {
  customerSchema,
  type CustomerSchemaValues,
} from './schemas/customer-schema';

export type {
  Customer,
  CustomerFilters,
  CustomerFormValues,
  CustomerOrder,
  CustomerOrderSummary,
  CustomerStatus,
  CustomerSummary,
} from './types/customer';
