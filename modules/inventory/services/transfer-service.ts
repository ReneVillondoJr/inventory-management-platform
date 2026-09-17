import { inventoryService } from './inventory-service';

import type { StockTransferInput } from '../types/inventory';

export const transferService = {
  createTransfer(input: StockTransferInput) {
    return inventoryService.transferStock(input);
  },

  getTransferMovements(transferId: string) {
    return inventoryService
      .getMovements()
      .filter(
        (movement) =>
          movement.referenceType === 'STOCK_TRANSFER' &&
          movement.referenceId === transferId,
      );
  },
};
