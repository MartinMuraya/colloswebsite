<?php

namespace App\Modules\Catalog\Application\Actions;

use App\Core\Application\Actions\Action;
use App\Modules\Catalog\Application\DTO\CreateProductDTO;
use App\Modules\Catalog\Domain\Entities\Product;
use App\Modules\Catalog\Domain\ValueObjects\Price;
use App\Modules\Catalog\Domain\ValueObjects\SKU;

class CreateProductAction implements Action
{
    private $productRepository; // interface ProductRepository
    private $categoryRepository; // interface CategoryRepository
    private $brandRepository; // interface BrandRepository

    public function __construct($productRepository, $categoryRepository, $brandRepository)
    {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
        $this->brandRepository = $brandRepository;
    }

    /**
     * @param CreateProductDTO $request
     */
    public function execute(mixed $request): Product
    {
        $sku = new SKU($request->sku);
        $price = new Price($request->priceAmount); // Assuming default USD

        if ($this->productRepository->findBySku($sku) !== null) {
            throw new \Exception("A product with this SKU already exists.");
        }

        $category = null;
        if ($request->categoryId) {
            $category = $this->categoryRepository->findById($request->categoryId);
        }

        $brand = null;
        if ($request->brandId) {
            $brand = $this->brandRepository->findById($request->brandId);
        }

        $product = Product::create(
            id: uniqid('prod_'),
            name: $request->name,
            sku: $sku,
            price: $price,
            category: $category,
            brand: $brand
        );

        $this->productRepository->save($product);

        return $product;
    }
}
