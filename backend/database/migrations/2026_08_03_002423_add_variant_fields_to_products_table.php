<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('category_id')->constrained('products')->cascadeOnDelete();
            $table->boolean('is_variant')->default(false)->after('parent_id');
            $table->string('brand')->nullable()->after('status');
            $table->string('manufacturer_part_number')->nullable()->after('brand');
            $table->decimal('weight', 8, 2)->nullable()->after('manufacturer_part_number');
            $table->json('attributes')->nullable()->after('weight'); // e.g., {"color": "red", "voltage": "220V"}
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'is_variant', 'brand', 'manufacturer_part_number', 'weight', 'attributes']);
        });
    }
};
