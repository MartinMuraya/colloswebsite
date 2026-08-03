<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoryInterface;
use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {}

    public function getAllProducts(string $search = null)
    {
        return $this->productRepository->allWithCategory($search);
    }

    public function getProduct(int $id)
    {
        $product = $this->productRepository->findById($id);
        $product->load('category');
        return $product;
    }

    public function createProduct(array $data, ?UploadedFile $image)
    {
        if ($image) {
            $data['image_url'] = $this->uploadImage($image);
        }
        
        $product = $this->productRepository->create($data);
        $product->load('category');
        return $product;
    }

    public function updateProduct(int $id, array $data, ?UploadedFile $image)
    {
        if ($image) {
            $data['image_url'] = $this->uploadImage($image);
        }

        $product = $this->productRepository->update($id, $data);
        $product->load('category');
        return $product;
    }

    public function deleteProduct(int $id)
    {
        return $this->productRepository->delete($id);
    }

    protected function uploadImage(UploadedFile $image): string
    {
        $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));
        $uploadResult = $cloudinary->uploadApi()->upload($image->getRealPath(), [
            'folder' => 'products'
        ]);
        
        return $uploadResult['secure_url'];
    }
}
