<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
        * Seed the application's database.
        */
    public function run(): void
    {
        // Users
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Categories
        $categories = [
            ['name' => 'Circuit Breakers', 'slug' => 'circuit-breakers', 'description' => 'Industrial and commercial circuit breakers'],
            ['name' => 'Lighting', 'slug' => 'lighting', 'description' => 'LED panels, bulbs, and industrial lighting'],
            ['name' => 'Cables & Wires', 'slug' => 'cables', 'description' => 'Heavy duty cables and wiring'],
            ['name' => 'Transformers', 'slug' => 'transformers', 'description' => 'Power distribution transformers'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Products
        $products = [
            ['category_id' => 1, 'name' => 'Industrial Circuit Breaker', 'sku' => 'ICB-500', 'price' => 24500, 'stock' => 120, 'status' => 'In Stock'],
            ['category_id' => 2, 'name' => 'Commercial LED Panel', 'sku' => 'CLP-202', 'price' => 8999, 'stock' => 450, 'status' => 'In Stock'],
            ['category_id' => 3, 'name' => 'Heavy Duty Cable Reel', 'sku' => 'HDR-100', 'price' => 15000, 'stock' => 12, 'status' => 'Low Stock'],
            ['category_id' => 4, 'name' => 'Smart Power Meter', 'sku' => 'SPM-300', 'price' => 32000, 'stock' => 0, 'status' => 'Out of Stock'],
            ['category_id' => 4, 'name' => 'Distribution Transformer', 'sku' => 'DTX-800', 'price' => 120000, 'stock' => 5, 'status' => 'In Stock'],
            ['category_id' => 1, 'name' => 'Miniature Circuit Breaker', 'sku' => 'MCB-100', 'price' => 1200, 'stock' => 500, 'status' => 'In Stock'],
            ['category_id' => 2, 'name' => 'Outdoor Floodlight', 'sku' => 'OFL-50W', 'price' => 4500, 'stock' => 80, 'status' => 'In Stock'],
        ];

        foreach ($products as $prod) {
            Product::create($prod);
        }

        // Orders
        for ($i = 1; $i <= 5; $i++) {
            $order = Order::create([
                'reference' => 'ORD-' . strtoupper(Str::random(6)),
                'customer_name' => 'Customer ' . $i,
                'customer_phone' => '25470000000' . $i,
                'total_amount' => 0, // Calculate later
                'status' => ['pending', 'paid', 'completed'][rand(0, 2)],
            ]);

            $total = 0;
            $itemsCount = rand(1, 3);
            for ($j = 0; $j < $itemsCount; $j++) {
                $product = Product::inRandomOrder()->first();
                $quantity = rand(1, 5);
                $subtotal = $product->price * $quantity;
                $total += $subtotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update(['total_amount' => $total]);
        }
    }
}
