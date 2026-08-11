<?php

namespace App\Services;

use App\Models\Service;
use App\Traits\UploadsImages;
use Illuminate\Http\UploadedFile;

class ServiceService
{
    use UploadsImages;

    public function getAll(string $search = null, string $category = null)
    {
        $query = Service::query()->with('category');

        if ($category) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        return $query->latest()->get();
    }

    public function getPublished(string $category = null)
    {
        $query = Service::with('category')
            ->where('is_published', true);

        if ($category) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        return $query->latest()->get();
    }

    public function getBySlug(string $slug)
    {
        return Service::with('category')->where('slug', $slug)->firstOrFail();
    }

    public function create(array $data, ?UploadedFile $featuredImage, ?array $galleryImages = [])
    {
        if ($featuredImage) {
            $data['featured_image_url'] = $this->uploadImage($featuredImage, 'services');
        }
        
        if (!empty($galleryImages)) {
            $data['gallery_images'] = $this->uploadMultipleImages($galleryImages, 'services');
        }

        $service = Service::create($data);
        $service->load('category');
        return $service;
    }

    public function update(int $id, array $data, ?UploadedFile $featuredImage, ?array $galleryImages = [])
    {
        $service = Service::findOrFail($id);

        if ($featuredImage) {
            $data['featured_image_url'] = $this->uploadImage($featuredImage, 'services');
        }

        if (!empty($galleryImages)) {
            $existingImages = $service->gallery_images ?? [];
            $newImages = $this->uploadMultipleImages($galleryImages, 'services');
            $data['gallery_images'] = array_merge($existingImages, $newImages);
        }

        $service->update($data);
        $service->load('category');
        return $service;
    }

    public function delete(int $id)
    {
        return Service::findOrFail($id)->delete();
    }
}
