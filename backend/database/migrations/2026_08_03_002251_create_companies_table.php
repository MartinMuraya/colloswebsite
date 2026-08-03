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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('registration_number')->nullable()->unique();
            $table->string('vat_number')->nullable()->unique();
            $table->string('industry')->nullable();
            $table->string('contact_email');
            $table->string('contact_phone');
            $table->text('billing_address')->nullable();
            $table->boolean('is_approved')->default(false); // For B2B wholesale approval
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
