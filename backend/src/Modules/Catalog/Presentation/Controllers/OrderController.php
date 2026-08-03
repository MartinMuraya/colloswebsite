<?php

namespace App\Modules\Catalog\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->orderBy('created_at', 'desc');
        
        if ($search = $request->search) {
            $query->where('reference', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
        }

        return response()->json(['data' => $query->get()]);
    }

    public function myOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
                       ->orderBy('created_at', 'desc')
                       ->get();
        return response()->json(['data' => $orders]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'total_amount' => 'required|numeric|min:1',
            'items' => 'required|array|min:1',
        ]);

        $order = Order::create([
            'reference' => 'ORD-' . strtoupper(Str::random(8)),
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'total_amount' => $validated['total_amount'],
            'status' => 'pending',
            'user_id' => $request->user()?->id,
        ]);

        Log::info("Order Created: {$order->reference}");

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ], 201);
    }

    public function show($reference)
    {
        $order = Order::where('reference', $reference)->firstOrFail();
        return response()->json(['order' => $order]);
    }
}
