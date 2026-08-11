<?php

namespace App\Modules\Services\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Data\ServiceCategoryData;
use Illuminate\Http\Request;
use App\Services\ServiceCategoryService;

class ServiceCategoryController extends Controller
{
    public function __construct(
        protected ServiceCategoryService $categoryService
    ) {}

    public function index(Request $request)
    {
        $categories = $this->categoryService->getAll($request->search);
        return response()->json(['data' => ServiceCategoryData::collect($categories)]);
    }

    public function published()
    {
        $categories = $this->categoryService->getPublished();
        return response()->json(['data' => ServiceCategoryData::collect($categories)]);
    }

    public function show($slug)
    {
        $category = $this->categoryService->getBySlug($slug);
        return response()->json(['category' => ServiceCategoryData::from($category)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:service_categories,slug',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:service_categories,id',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
            'show_in_navigation' => 'boolean',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $category = $this->categoryService->create($validated, $request->file('image'));
        return response()->json(['message' => 'Service Category created', 'category' => ServiceCategoryData::from($category)], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:service_categories,slug,'.$id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:service_categories,id',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
            'show_in_navigation' => 'boolean',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $category = $this->categoryService->update($id, $validated, $request->file('image'));
        return response()->json(['message' => 'Service Category updated', 'category' => ServiceCategoryData::from($category)]);
    }

    public function destroy($id)
    {
        $this->categoryService->delete($id);
        return response()->json(['message' => 'Service Category deleted']);
    }
}
