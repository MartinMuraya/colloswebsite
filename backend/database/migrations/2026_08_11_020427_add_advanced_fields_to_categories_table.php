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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('description');
            $table->foreignId('parent_id')->nullable()->after('image_url')->constrained('categories')->nullOnDelete();
            $table->integer('sort_order')->default(0)->after('parent_id');
            $table->boolean('is_published')->default(true)->after('sort_order');
            $table->boolean('show_in_navigation')->default(true)->after('is_published');
            $table->string('seo_title')->nullable()->after('show_in_navigation');
            $table->text('seo_description')->nullable()->after('seo_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn([
                'image_url',
                'parent_id',
                'sort_order',
                'is_published',
                'show_in_navigation',
                'seo_title',
                'seo_description'
            ]);
        });
    }
};
