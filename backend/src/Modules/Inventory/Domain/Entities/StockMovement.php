<?php

namespace App\Modules\Inventory\Domain\Entities;

use App\Core\Domain\Entity;
use App\Modules\Inventory\Domain\ValueObjects\Quantity;
use App\Modules\Catalog\Domain\ValueObjects\SKU;

class StockMovement extends Entity
{
    private string $id;
    private SKU $sku;
    private Warehouse $warehouse;
    private Quantity $quantity;
    private string $type; // 'IN' or 'OUT'
    private string $reason; // e.g., 'PURCHASE', 'SALE', 'ADJUSTMENT'
    private \DateTimeImmutable $createdAt;

    public function __construct(string $id, SKU $sku, Warehouse $warehouse, Quantity $quantity, string $type, string $reason)
    {
        $this->id = $id;
        $this->sku = $sku;
        $this->warehouse = $warehouse;
        $this->quantity = $quantity;
        $this->type = $type;
        $this->reason = $reason;
        $this->createdAt = new \DateTimeImmutable();
    }

    public static function createReceive(string $id, SKU $sku, Warehouse $warehouse, Quantity $quantity, string $reason = 'PURCHASE'): self
    {
        return new self($id, $sku, $warehouse, $quantity, 'IN', $reason);
    }

    public static function createDispatch(string $id, SKU $sku, Warehouse $warehouse, Quantity $quantity, string $reason = 'SALE'): self
    {
        return new self($id, $sku, $warehouse, $quantity, 'OUT', $reason);
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getSku(): SKU
    {
        return $this->sku;
    }

    public function getWarehouse(): Warehouse
    {
        return $this->warehouse;
    }

    public function getQuantity(): Quantity
    {
        return $this->quantity;
    }

    public function getType(): string
    {
        return $this->type;
    }
}
