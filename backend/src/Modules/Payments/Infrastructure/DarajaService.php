<?php

namespace App\Modules\Payments\Infrastructure;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class DarajaService
{
    private string $environment;
    private string $consumerKey;
    private string $consumerSecret;
    private string $passkey;
    private string $shortcode;
    private string $callbackUrl;
    
    public function __construct()
    {
        $this->environment = config('mpesa.environment');
        $this->consumerKey = config('mpesa.consumer_key');
        $this->consumerSecret = config('mpesa.consumer_secret');
        $this->passkey = config('mpesa.passkey');
        $this->shortcode = config('mpesa.shortcode');
        $this->callbackUrl = config('mpesa.callback_url');
    }

    private function getAuthUrl(): string
    {
        return config("mpesa.urls.{$this->environment}.auth");
    }

    private function getStkPushUrl(): string
    {
        return config("mpesa.urls.{$this->environment}.stk_push");
    }

    public function getAccessToken(): string
    {
        return Cache::remember('mpesa_access_token', 3590, function () {
            $credentials = base64_encode("{$this->consumerKey}:{$this->consumerSecret}");
            
            $response = Http::withHeaders([
                'Authorization' => "Basic {$credentials}"
            ])->get($this->getAuthUrl());

            if ($response->successful()) {
                return $response->json()['access_token'];
            }

            throw new \Exception('Failed to retrieve M-Pesa Access Token: ' . $response->body());
        });
    }

    public function initiateStkPush(string $phoneNumber, int $amount, string $reference, string $description): array
    {
        $token = $this->getAccessToken();
        $timestamp = date('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);
        
        // Format phone number to start with 254
        if (str_starts_with($phoneNumber, '0')) {
            $phoneNumber = '254' . substr($phoneNumber, 1);
        } elseif (str_starts_with($phoneNumber, '+')) {
            $phoneNumber = substr($phoneNumber, 1);
        }

        $payload = [
            'BusinessShortCode' => $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline', // Or CustomerBuyGoodsOnline
            'Amount' => $amount,
            'PartyA' => $phoneNumber,
            'PartyB' => $this->shortcode,
            'PhoneNumber' => $phoneNumber,
            'CallBackURL' => $this->callbackUrl,
            'AccountReference' => $reference,
            'TransactionDesc' => $description
        ];

        $response = Http::withToken($token)
            ->post($this->getStkPushUrl(), $payload);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('M-Pesa STK Push Failed: ' . $response->body());
    }
}
