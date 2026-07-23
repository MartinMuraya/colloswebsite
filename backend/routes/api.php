<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Presentation\Controllers\RegisterController;
use App\Modules\Auth\Presentation\Controllers\LoginController;
use App\Modules\Payments\Presentation\Controllers\MpesaController;
use App\Modules\Dashboard\Presentation\Controllers\DashboardController;
use App\Modules\Catalog\Presentation\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
});

Route::prefix('catalog')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
});

Route::prefix('payments')->group(function () {
    Route::post('/mpesa/stk-push', [\App\Modules\Payments\Presentation\Controllers\MpesaController::class, 'initiatePayment']);
    Route::post('/mpesa/callback', [\App\Modules\Payments\Presentation\Controllers\MpesaController::class, 'callback']);
});
