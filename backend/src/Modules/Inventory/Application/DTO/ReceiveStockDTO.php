<?php

namespace App\Modules\Inventory\Application\DTO;

use App\Core\Application\DTO\DataTransferObject;

class ReceiveStockDTO implements DataTransferObject
{
    public readonly string $sku;
    public readonly string $warehouseId;
    public readonly int $quantity;
    public readonly string $reason;

    public function __construct(string $sku, string $warehouseId, int $quantity, string $reason = 'PURCHASE')
    {
        $this->sku = $sku;
        $this->warehouseId = $warehouseId;
        $this->quantity = $quantity;
        $this->reason = $reason;
    }

    public function toArray(): array
    {
        return [
            'sku' => $this->sku,
            'warehouse_id' => $this->warehouseId,
            'quantity' => $this->quantity,
            'reason' => $this->reason,
        ];
    }
}
