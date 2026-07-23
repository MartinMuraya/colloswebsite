<?php

namespace App\Modules\Catalog\Domain\Entities;

use App\Core\Domain\Entity;
use App\Modules\Catalog\Domain\ValueObjects\Price;
use App\Modules\Catalog\Domain\ValueObjects\SKU;

class Product extends Entity
{
    private string $id;
    private string $name;
    private SKU $sku;
    private Price $price;
    private ?Category $category;
    private ?Brand $brand;

    public function __construct(string $id, string $name, SKU $sku, Price $price, ?Category $category = null, ?Brand $brand = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->sku = $sku;
        $this->price = $price;
        $this->category = $category;
        $this->brand = $brand;
    }

    public static function create(string $id, string $name, SKU $sku, Price $price, ?Category $category = null, ?Brand $brand = null): self
    {
        $product = new self($id, $name, $sku, $price, $category, $brand);
        // $product->recordEvent(new ProductCreated($product));
        return $product;
    }

    public function updatePrice(Price $newPrice): void
    {
        $this->price = $newPrice;
        // $this->recordEvent(new ProductPriceUpdated($this->id, $newPrice));
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getSku(): SKU
    {
        return $this->sku;
    }

    public function getPrice(): Price
    {
        return $this->price;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function getBrand(): ?Brand
    {
        return $this->brand;
    }
}
