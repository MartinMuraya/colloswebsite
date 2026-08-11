<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoryInterface;
use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use App\Traits\UploadsImages;

class ProductService
{
    use UploadsImages;

    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {}

    public function getAllProducts(string $search = null, string $category = null)
    {
        return $this->productRepository->allWithCategory($search, $category);
    }

    public function getProduct(int $id)
    {
        $product = $this->productRepository->findById($id);
        $product->load('category');
        return $product;
    }

    public function createProduct(array $data, ?UploadedFile $image, ?array $images = [])
    {
        if ($image) {
            $data['image_url'] = $this->uploadImage($image, 'products');
        }
        
        if (!empty($images)) {
            $data['images'] = $this->uploadMultipleImages($images, 'products');
        }
        
        $product = $this->productRepository->create($data);
        $product->load('category');
        return $product;
    }

    public function updateProduct(int $id, array $data, ?UploadedFile $image, ?array $images = [])
    {
        if ($image) {
            $data['image_url'] = $this->uploadImage($image, 'products');
        }

        if (!empty($images)) {
            $existingProduct = $this->productRepository->findById($id);
            $existingImages = $existingProduct->images ?? [];
            $newImages = $this->uploadMultipleImages($images, 'products');
            // Simply append new images or overwrite depending on your frontend logic. 
            // For now, we will merge them.
            $data['images'] = array_merge($existingImages, $newImages);
        }

        $product = $this->productRepository->update($id, $data);
        $product->load('category');
        return $product;
    }

    public function deleteProduct(int $id)
    {
        return $this->productRepository->delete($id);
    }
}
