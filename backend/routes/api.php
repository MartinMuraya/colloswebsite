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

Route::group([], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    Route::prefix('dashboard')->middleware('auth:sanctum')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
    });

    Route::prefix('catalog')->group(function () {
        // Public Catalog Routes
        Route::get('/products', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'index']);
        Route::get('/products/{id}', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'show']);
        Route::get('/categories/published', [\App\Modules\Catalog\Presentation\Controllers\CategoryController::class, 'published']);
        Route::get('/categories/{slug}', [\App\Modules\Catalog\Presentation\Controllers\CategoryController::class, 'show']);

        // Admin Catalog Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/products', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'store']);
            Route::post('/products/{id}', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'update']);
            Route::delete('/products/{id}', [\App\Modules\Catalog\Presentation\Controllers\ProductController::class, 'destroy']);

            Route::get('/categories', [\App\Modules\Catalog\Presentation\Controllers\CategoryController::class, 'index']);
            Route::post('/categories', [\App\Modules\Catalog\Presentation\Controllers\CategoryController::class, 'store']);
            Route::post('/categories/{id}', [\App\Modules\Catalog\Presentation\Controllers\CategoryController::class, 'update']);
            Route::delete('/categories/{id}', [\App\Modules\Catalog\Presentation\Controllers\CategoryController::class, 'destroy']);
        });
    });

    Route::prefix('services')->group(function () {
        // Public Services Routes
        Route::get('/', [\App\Modules\Services\Presentation\Controllers\ServiceController::class, 'published']);
        Route::get('/{slug}', [\App\Modules\Services\Presentation\Controllers\ServiceController::class, 'show']);
        
        // Public Service Categories
        Route::get('/categories/published', [\App\Modules\Services\Presentation\Controllers\ServiceCategoryController::class, 'published']);
        Route::get('/categories/{slug}', [\App\Modules\Services\Presentation\Controllers\ServiceCategoryController::class, 'show']);

        // Admin Services Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/admin/all', [\App\Modules\Services\Presentation\Controllers\ServiceController::class, 'index']);
            Route::post('/', [\App\Modules\Services\Presentation\Controllers\ServiceController::class, 'store']);
            Route::post('/{id}', [\App\Modules\Services\Presentation\Controllers\ServiceController::class, 'update']);
            Route::delete('/{id}', [\App\Modules\Services\Presentation\Controllers\ServiceController::class, 'destroy']);

            Route::get('/categories/admin/all', [\App\Modules\Services\Presentation\Controllers\ServiceCategoryController::class, 'index']);
            Route::post('/categories', [\App\Modules\Services\Presentation\Controllers\ServiceCategoryController::class, 'store']);
            Route::post('/categories/{id}', [\App\Modules\Services\Presentation\Controllers\ServiceCategoryController::class, 'update']);
            Route::delete('/categories/{id}', [\App\Modules\Services\Presentation\Controllers\ServiceCategoryController::class, 'destroy']);
        });
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [\App\Modules\Catalog\Presentation\Controllers\OrderController::class, 'index'])->middleware('auth:sanctum');
        Route::get('/my/history', [\App\Modules\Catalog\Presentation\Controllers\OrderController::class, 'myOrders'])->middleware('auth:sanctum');
        Route::post('/', [\App\Modules\Catalog\Presentation\Controllers\OrderController::class, 'store'])->middleware('auth:sanctum');
        Route::get('/{reference}', [\App\Modules\Catalog\Presentation\Controllers\OrderController::class, 'show'])->middleware('auth:sanctum');
    });

    Route::prefix('settings')->group(function () {
        Route::get('/', [\App\Modules\Settings\Presentation\Controllers\SettingsController::class, 'index']);
        // Admin only
        Route::post('/', [\App\Modules\Settings\Presentation\Controllers\SettingsController::class, 'updateStoreSettings'])->middleware('auth:sanctum');
        Route::post('/profile', [\App\Modules\Settings\Presentation\Controllers\SettingsController::class, 'updateProfile'])->middleware('auth:sanctum');
        Route::post('/cms', [\App\Modules\Settings\Presentation\Controllers\SettingsController::class, 'updateCmsSettings'])->middleware('auth:sanctum');
    });

    // Users & Roles Management (Super Admin / Admin)
    Route::prefix('users')->middleware(['auth:sanctum'])->group(function () {
        Route::get('/', [\App\Modules\Auth\Presentation\Controllers\UserController::class, 'index']);
        Route::get('/roles', [\App\Modules\Auth\Presentation\Controllers\UserController::class, 'getRoles']);
        Route::post('/{id}/role', [\App\Modules\Auth\Presentation\Controllers\UserController::class, 'updateRole']);
        Route::delete('/{id}', [\App\Modules\Auth\Presentation\Controllers\UserController::class, 'destroy']);
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
        Route::post('/register', RegisterController::class)->middleware('throttle:10,1');
        Route::post('/login', LoginController::class)->middleware('throttle:10,1');
        Route::post('/logout', \App\Modules\Auth\Presentation\Controllers\LogoutController::class)->middleware('auth:sanctum');
        
        Route::post('/forgot-password', [\App\Modules\Auth\Presentation\Controllers\PasswordResetController::class, 'sendResetLink']);
        Route::post('/reset-password', [\App\Modules\Auth\Presentation\Controllers\PasswordResetController::class, 'reset'])->name('password.reset');

        // OAuth
        Route::get('/google/redirect', [SocialAuthController::class, 'redirect']);
        Route::get('/google/callback', [SocialAuthController::class, 'callback']);
        
        // Verification
        Route::post('/email/verify/{id}/{hash}', [VerificationController::class, 'verify']);
        Route::post('/email/resend', [VerificationController::class, 'resend']);
    });

    Route::prefix('payments')->group(function () {
        Route::get('/', [\App\Modules\Payments\Presentation\Controllers\PaymentController::class, 'index'])->middleware('auth:sanctum');
        Route::post('/mpesa/stk-push', [\App\Modules\Payments\Presentation\Controllers\MpesaController::class, 'initiatePayment']);
        Route::post('/mpesa/callback', [\App\Modules\Payments\Presentation\Controllers\MpesaController::class, 'callback']);
    });
});
