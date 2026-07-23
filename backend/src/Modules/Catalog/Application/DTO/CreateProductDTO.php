<?php

namespace App\Modules\Catalog\Application\DTO;

use App\Core\Application\DTO\DataTransferObject;

class CreateProductDTO implements DataTransferObject
{
    public readonly string $name;
    public readonly string $sku;
    public readonly int $priceAmount;
    public readonly ?string $categoryId;
    public readonly ?string $brandId;

    public function __construct(string $name, string $sku, int $priceAmount, ?string $categoryId = null, ?string $brandId = null)
    {
        $this->name = $name;
        $this->sku = $sku;
        $this->priceAmount = $priceAmount;
        $this->categoryId = $categoryId;
        $this->brandId = $brandId;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'sku' => $this->sku,
            'price_amount' => $this->priceAmount,
            'category_id' => $this->categoryId,
            'brand_id' => $this->brandId,
        ];
    }
}
