<?php

namespace App\Modules\Dashboard\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $totalRevenue = Order::where('status', '!=', 'failed')->sum('total_amount');
        $activeOrders = Order::whereIn('status', ['pending', 'paid'])->count();
        $newCustomers = User::where('created_at', '>=', Carbon::now()->subDays(30))->count();

        // Calculate trends (mocked for simplicity, in production you'd compare to previous month)
        return response()->json([
            'totalRevenue' => [
                'value' => '$' . number_format($totalRevenue, 2),
                'trend' => 'up',
                'percentage' => '+12.5%'
            ],
            'activeOrders' => [
                'value' => $activeOrders,
                'trend' => 'up',
                'percentage' => '+5.2%'
            ],
            'newCustomers' => [
                'value' => $newCustomers,
                'trend' => 'down',
                'percentage' => '-2.1%'
            ]
        ]);
    }

    public function recentOrders(Request $request)
    {
        $orders = Order::with('items')->latest()->take(5)->get()->map(function ($order) {
            return [
                'id' => $order->reference,
                'customer' => $order->customer_name,
                'date' => $order->created_at->format('Y-m-d H:i'),
                'amount' => '$' . number_format($order->total_amount, 2),
                'status' => ucfirst($order->status),
            ];
        });

        return response()->json($orders);
    }
}
