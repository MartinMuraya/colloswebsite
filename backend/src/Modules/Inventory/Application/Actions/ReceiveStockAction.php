<?php

namespace App\Modules\Inventory\Application\Actions;

use App\Core\Application\Actions\Action;
use App\Modules\Inventory\Application\DTO\ReceiveStockDTO;
use App\Modules\Inventory\Domain\Entities\StockMovement;
use App\Modules\Inventory\Domain\ValueObjects\Quantity;
use App\Modules\Catalog\Domain\ValueObjects\SKU;

class ReceiveStockAction implements Action
{
    private $warehouseRepository;
    private $stockMovementRepository;

    public function __construct($warehouseRepository, $stockMovementRepository)
    {
        $this->warehouseRepository = $warehouseRepository;
        $this->stockMovementRepository = $stockMovementRepository;
    }

    /**
     * @param ReceiveStockDTO $request
     */
    public function execute(mixed $request): StockMovement
    {
        $warehouse = $this->warehouseRepository->findById($request->warehouseId);
        
        if (!$warehouse) {
            throw new \Exception("Warehouse not found.");
        }

        $sku = new SKU($request->sku);
        $quantity = new Quantity($request->quantity);

        $movement = StockMovement::createReceive(
            id: uniqid('mov_'),
            sku: $sku,
            warehouse: $warehouse,
            quantity: $quantity,
            reason: $request->reason
        );

        $this->stockMovementRepository->save($movement);

        // Optionally dispatch StockReceivedEvent

        return $movement;
    }
}
