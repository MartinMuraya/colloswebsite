<?php

namespace App\Modules\Services\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Data\ServiceData;
use Illuminate\Http\Request;
use App\Services\ServiceService;

class ServiceController extends Controller
{
    public function __construct(
        protected ServiceService $serviceService
    ) {}

    public function index(Request $request)
    {
        $services = $this->serviceService->getAll($request->search);
        return response()->json(['data' => ServiceData::collect($services)]);
    }

    public function published(Request $request)
    {
        $services = $this->serviceService->getPublished($request->category);
        return response()->json(['data' => ServiceData::collect($services)]);
    }

    public function show($slug)
    {
        $service = $this->serviceService->getBySlug($slug);
        return response()->json(['service' => ServiceData::from($service)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_category_id' => 'required|exists:service_categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:services,slug',
            'short_description' => 'nullable|string',
            'full_description' => 'nullable|string',
            'icon' => 'nullable|string',
            'estimated_duration' => 'nullable|string',
            'service_type' => 'nullable|string',
            'is_residential' => 'boolean',
            'is_commercial' => 'boolean',
            'is_industrial' => 'boolean',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'show_in_navigation' => 'boolean',
            'features' => 'nullable|array',
            'tags' => 'nullable|array',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048'
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        }

        $service = $this->serviceService->create(
            $validated, 
            $request->file('featured_image'), 
            $request->file('gallery_images')
        );
        
        return response()->json(['message' => 'Service created', 'service' => ServiceData::from($service)], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'service_category_id' => 'sometimes|exists:service_categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:services,slug,'.$id,
            'short_description' => 'nullable|string',
            'full_description' => 'nullable|string',
            'icon' => 'nullable|string',
            'estimated_duration' => 'nullable|string',
            'service_type' => 'nullable|string',
            'is_residential' => 'boolean',
            'is_commercial' => 'boolean',
            'is_industrial' => 'boolean',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'show_in_navigation' => 'boolean',
            'features' => 'nullable|array',
            'tags' => 'nullable|array',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:2048'
        ]);

        $service = $this->serviceService->update(
            $id,
            $validated, 
            $request->file('featured_image'), 
            $request->file('gallery_images')
        );

        return response()->json(['message' => 'Service updated', 'service' => ServiceData::from($service)]);
    }

    public function destroy($id)
    {
        $this->serviceService->delete($id);
        return response()->json(['message' => 'Service deleted']);
    }
}
