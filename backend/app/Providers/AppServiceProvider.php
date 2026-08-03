<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\ProductRepositoryInterface::class,
            \App\Repositories\Eloquent\ProductRepository::class
        );
        $this->app->bind(
            \App\Services\Contracts\PaymentGatewayInterface::class,
            \App\Services\Gateways\MpesaGateway::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::createUrlUsing(function (object $notifiable) {
            return env('FRONTEND_URL', 'http://localhost:5173') . '/verify-email/' . $notifiable->getKey() . '/' . sha1($notifiable->getEmailForVerification());
        });
    }
}
