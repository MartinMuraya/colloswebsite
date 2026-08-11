<?php

namespace App\Modules\Catalog\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Data\ProductData;
use Illuminate\Http\Request;
use App\Services\ProductService;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}
    public function index(Request $request)
    {
        $products = $this->productService->getAllProducts($request->search, $request->category);

        return response()->json(['data' => ProductData::collect($products)]);
    }

    public function show($id)
    {
        $product = $this->productService->getProduct($id);
        return response()->json(['product' => ProductData::from($product)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $product = $this->productService->createProduct($validated, $request->file('image'));
        return response()->json(['message' => 'Product created', 'product' => ProductData::from($product)], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|unique:products,sku,'.$id,
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'status' => 'sometimes|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $product = $this->productService->updateProduct($id, $validated, $request->file('image'));
        return response()->json(['message' => 'Product updated', 'product' => ProductData::from($product)]);
    }

    public function destroy($id)
    {
        $this->productService->deleteProduct($id);
        return response()->json(['message' => 'Product deleted']);
    }
}
