<?php

namespace App\Modules\Catalog\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Application\Actions\CreateProductAction;
use App\Modules\Catalog\Application\DTO\CreateProductDTO;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private CreateProductAction $createProductAction;

    public function __construct(CreateProductAction $createProductAction)
    {
        $this->createProductAction = $createProductAction;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|min:3|unique:products,sku',
            'price_amount' => 'required|integer|min:0', // assuming cents
            'category_id' => 'nullable|string|exists:categories,id',
            'brand_id' => 'nullable|string|exists:brands,id',
        ]);

        $dto = new CreateProductDTO(
            name: $validated['name'],
            sku: $validated['sku'],
            priceAmount: $validated['price_amount'],
            categoryId: $validated['category_id'] ?? null,
            brandId: $validated['brand_id'] ?? null
        );

        try {
            $product = $this->createProductAction->execute($dto);
            return response()->json([
                'message' => 'Product created successfully',
                'product' => [
                    'id' => $product->getId(),
                    'name' => $product->getName(),
                    'sku' => $product->getSku()->getValue(),
                    'price' => [
                        'amount' => $product->getPrice()->getAmount(),
                        'currency' => $product->getPrice()->getCurrency()
                    ]
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
