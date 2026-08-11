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
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'customer_name')) {
                $table->dropColumn('customer_name');
            }
            if (Schema::hasColumn('orders', 'customer_phone')) {
                $table->dropColumn('customer_phone');
            }
            if (!Schema::hasColumn('orders', 'user_id')) {
                $table->foreignId('user_id')->after('reference')->constrained('users')->cascadeOnDelete();
            }
            if (!Schema::hasColumn('orders', 'company_id')) {
                $table->foreignId('company_id')->nullable()->after('user_id')->constrained('companies')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['company_id']);
            $table->dropColumn(['user_id', 'company_id']);
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
        });
    }
};
