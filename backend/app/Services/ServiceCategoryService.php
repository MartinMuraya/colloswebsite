<?php

namespace App\Services;

use App\Models\ServiceCategory;
use App\Traits\UploadsImages;
use Illuminate\Http\UploadedFile;

class ServiceCategoryService
{
    use UploadsImages;

    public function getAll(string $search = null)
    {
        $query = ServiceCategory::query();
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        return $query->orderBy('sort_order')->get();
    }

    public function getPublished()
    {
        return ServiceCategory::where('is_published', true)
            ->where('show_in_navigation', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function getBySlug(string $slug)
    {
        return ServiceCategory::where('slug', $slug)->firstOrFail();
    }

    public function create(array $data, ?UploadedFile $image)
    {
        if ($image) {
            $data['image_url'] = $this->uploadImage($image, 'service_categories');
        }
        return ServiceCategory::create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $image)
    {
        $category = ServiceCategory::findOrFail($id);
        if ($image) {
            $data['image_url'] = $this->uploadImage($image, 'service_categories');
        }
        $category->update($data);
        return $category;
    }

    public function delete(int $id)
    {
        return ServiceCategory::findOrFail($id)->delete();
    }
}
