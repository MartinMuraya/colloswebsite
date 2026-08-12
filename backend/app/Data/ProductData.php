<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Product;

class ProductData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $slug,
        public string $sku,
        public float $price,
        public ?float $sale_price,
        public string $price_visibility,
        public int $stock,
        public string $status,
        public string $unit,
        public bool $is_featured,
        public bool $is_published,
        public bool $show_in_navigation,
        public ?string $image_url,
        public ?array $images,
        public string $category,
        public int $category_id,
        public ?string $brand,
        public ?string $model,
        public ?string $short_description,
        public ?string $full_description,
        public ?array $attributes,
        public ?array $specifications,
        public ?array $tags,
        public ?string $seo_title,
        public ?string $seo_description
    ) {}

    public static function from(mixed ...$payloads): static
    {
        if (isset($payloads[0]) && $payloads[0] instanceof Product) {
            return self::fromModel($payloads[0]);
        }

        return parent::from(...$payloads);
    }

    public static function fromModel(Product $product): self
    {
        return new self(
            (string) $product->id,
            $product->name,
            $product->slug,
            $product->sku,
            (float) $product->price,
            $product->sale_price ? (float) $product->sale_price : null,
            $product->price_visibility,
            $product->stock,
            $product->status,
            $product->unit,
            $product->is_featured,
            $product->is_published,
            $product->show_in_navigation,
            $product->image_url,
            $product->images,
            $product->category->name ?? 'Uncategorized',
            $product->category_id,
            $product->brand,
            $product->model,
            $product->short_description,
            $product->full_description,
            $product->attributes,
            $product->specifications,
            $product->tags,
            $product->seo_title,
            $product->seo_description
        );
    }
}
