import { StockLevelTable } from './components/stock-level-table';
import { StockMovementTable } from './components/stock-movement-table';
import { inventoryService } from './services/inventory-service';

export { InventoryOverview } from './components/inventory-overview';
export { StockLevelTable } from './components/stock-level-table';
export { StockAdjustmentForm } from './components/stock-adjustment-form';
export { StockTransferForm } from './components/stock-transfer-form';
export { StockMovementTable } from './components/stock-movement-table';
export { StockHistory } from './components/stock-history';

export { useInventory } from './hooks/use-inventory';
export { useStockAdjustment } from './hooks/use-stock-adjustment';
export { useStockTransfer } from './hooks/use-stock-transfer';

export { inventoryService } from './services/inventory-service';
export { stockService } from './services/stock-service';
export { transferService } from './services/transfer-service';

export function StockLevelsView() {
  const inventory = inventoryService.getInventoryRecords();

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Inventory
        </p>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight'>
          Stock levels
        </h1>
      </div>

      <StockLevelTable inventory={inventory} />
    </div>
  );
}

export function StockMovementsView() {
  const movements = inventoryService.getMovements();

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Inventory activity
        </p>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight'>
          Stock movements
        </h1>
      </div>

      <StockMovementTable movements={movements} />
    </div>
  );
}

export function StockMovementDetails({ id }: { id: string }) {
  const movement = inventoryService
    .getMovements()
    .find((item) => item.id === id);

  if (!movement) {
    return (
      <div className='rounded-2xl border border-dashed border-border/60 bg-background p-6 text-sm text-muted-foreground'>
        Movement {id} was not found.
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
          Inventory activity
        </p>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight'>
          Movement details
        </h1>
      </div>

      <div className='rounded-2xl border border-border/60 bg-background p-6 text-sm text-muted-foreground'>
        <p className='font-medium text-foreground'>Movement #{movement.id}</p>
        <p className='mt-2'>Product: {movement.productName}</p>
        <p>Warehouse: {movement.warehouseName}</p>
        <p>Quantity: {movement.quantity}</p>
        <p>Reference: {movement.referenceType}</p>
      </div>
    </div>
  );
}
