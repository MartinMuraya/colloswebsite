<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Presentation\Controllers\RegisterController;
use App\Modules\Auth\Presentation\Controllers\LoginController;
use App\Modules\Auth\Presentation\Controllers\SocialAuthController;
use App\Modules\Auth\Presentation\Controllers\VerificationController;
use App\Modules\Payments\Presentation\Controllers\MpesaController;
use App\Modules\Dashboard\Presentation\Controllers\DashboardController;
use App\Modules\Catalog\Presentation\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth');

Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
});

Route::prefix('catalog')->group(function () {
    Route::get('/products', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'index']);
    // Admin only routes
    Route::post('/products', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'store'])->middleware('auth');
    Route::post('/products/{id}', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'update'])->middleware('auth');
    Route::delete('/products/{id}', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'destroy'])->middleware('auth');
});

Route::prefix('settings')->group(function () {
    Route::get('/', [\App\Modules\Settings\Presentation\Controllers\SettingsController::class, 'index']);
    // Admin only
    Route::post('/', [\App\Modules\Settings\Presentation\Controllers\SettingsController::class, 'updateStoreSettings'])->middleware('auth');
    Route::post('/profile', [\App\Modules\Settings\Presentation\Controllers\SettingsController::class, 'updateProfile'])->middleware('auth');
});

Route::post('/contact', [\App\Modules\Support\Presentation\Controllers\ContactController::class, 'send']);

// Temporary route to setup the database on Render Free Tier
Route::get('/setup-db', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        return response()->json([
            'message' => 'Database migrated and seeded successfully!',
            'migrate_output' => \Illuminate\Support\Facades\Artisan::output()
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::prefix('auth')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    
    // OAuth
    Route::get('/google/redirect', [SocialAuthController::class, 'redirect']);
    Route::get('/google/callback', [SocialAuthController::class, 'callback']);
    
    // Verification
    Route::post('/email/verify/{id}/{hash}', [VerificationController::class, 'verify']);
    Route::post('/email/resend', [VerificationController::class, 'resend']);
});


Route::prefix('payments')->group(function () {
    Route::get('/', [\App\Modules\Payments\Presentation\Controllers\PaymentController::class, 'index'])->middleware('auth');
    Route::post('/mpesa/stk-push', [\App\Modules\Payments\Presentation\Controllers\MpesaController::class, 'initiatePayment']);
    Route::post('/mpesa/callback', [\App\Modules\Payments\Presentation\Controllers\MpesaController::class, 'callback']);
});
