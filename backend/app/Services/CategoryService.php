<?php

namespace App\Services;

use App\Models\Category;
use App\Traits\UploadsImages;
use Illuminate\Http\UploadedFile;

class CategoryService
{
    use UploadsImages;

    public function getAll(string $search = null)
    {
        $query = Category::query();
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        return $query->orderBy('sort_order')->get();
    }

    public function getPublished()
    {
        return Category::where('is_published', true)
            ->where('show_in_navigation', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function getBySlug(string $slug)
    {
        return Category::where('slug', $slug)->firstOrFail();
    }

    public function create(array $data, ?UploadedFile $image)
    {
        if ($image) {
            $data['image_url'] = $this->uploadImage($image, 'categories');
        }
        return Category::create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $image)
    {
        $category = Category::findOrFail($id);
        if ($image) {
            $data['image_url'] = $this->uploadImage($image, 'categories');
        }
        $category->update($data);
        return $category;
    }

    public function delete(int $id)
    {
        return Category::findOrFail($id)->delete();
    }
}
