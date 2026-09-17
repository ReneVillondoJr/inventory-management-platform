import { inventoryService } from './inventory-service';

export const stockService = {
  getStockByProduct(productId: string) {
    return inventoryService
      .getInventoryRecords()
      .filter((item) => item.productId === productId);
  },

  getStockByWarehouse(warehouseId: string) {
    return inventoryService
      .getInventoryRecords()
      .filter((item) => item.warehouseId === warehouseId);
  },

  getLowStock() {
    return inventoryService
      .getInventoryRecords()
      .filter((item) => item.status === 'LOW_STOCK');
  },

  getOutOfStock() {
    return inventoryService
      .getInventoryRecords()
      .filter((item) => item.status === 'OUT_OF_STOCK');
  },

  getTotalUnits() {
    return inventoryService
      .getInventoryRecords()
      .reduce((total, item) => total + item.quantity, 0);
  },

  getTotalInventoryValue() {
    return inventoryService
      .getInventoryRecords()
      .reduce((total, item) => total + item.inventoryValue, 0);
  },
};
