<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Product;

class ProductData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $sku,
        public float $price,
        public int $stock,
        public string $status,
        public ?string $image_url,
        public string $category,
        public int $category_id,
        public ?string $brand,
        public ?array $attributes
    ) {}

    public static function fromModel(Product $product): self
    {
        return new self(
            (string) $product->id,
            $product->name,
            $product->sku,
            (float) $product->price,
            $product->stock,
            $product->status,
            $product->image_url,
            $product->category->name ?? 'Uncategorized',
            $product->category_id,
            $product->brand,
            $product->attributes
        );
    }
}
