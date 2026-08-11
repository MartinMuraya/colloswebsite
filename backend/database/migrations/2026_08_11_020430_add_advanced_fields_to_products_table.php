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
            $table->string('slug')->unique()->after('name')->nullable();
            $table->text('short_description')->nullable()->after('slug');
            $table->longText('full_description')->nullable()->after('short_description');
            $table->string('model')->nullable()->after('brand');
            $table->decimal('sale_price', 10, 2)->nullable()->after('price');
            $table->enum('price_visibility', ['visible', 'hidden', 'quote_only'])->default('visible')->after('sale_price');
            $table->string('unit')->default('piece')->after('stock');
            $table->boolean('is_featured')->default(false)->after('status');
            $table->boolean('is_published')->default(true)->after('is_featured');
            $table->boolean('show_in_navigation')->default(true)->after('is_published');
            $table->json('images')->nullable()->after('show_in_navigation');
            $table->json('specifications')->nullable()->after('attributes');
            $table->json('tags')->nullable()->after('specifications');
            $table->string('seo_title')->nullable()->after('tags');
            $table->text('seo_description')->nullable()->after('seo_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'short_description',
                'full_description',
                'model',
                'sale_price',
                'price_visibility',
                'unit',
                'is_featured',
                'is_published',
                'show_in_navigation',
                'images',
                'specifications',
                'tags',
                'seo_title',
                'seo_description'
            ]);
        });
    }
};
