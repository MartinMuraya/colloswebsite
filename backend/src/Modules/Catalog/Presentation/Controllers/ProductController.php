<?php

namespace App\Modules\Catalog\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
        }

        // Return all products for the catalog without pagination for now to fit simple UI
        $products = $query->get()->map(function ($product) {
            return [
                'id' => (string) $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'status' => $product->status,
                'category' => $product->category->name ?? 'Uncategorized'
            ];
        });

        return response()->json(['data' => $products]);
    }
}
