<?php

namespace App\Services\Gateways;

use App\Models\Order;
use App\Services\Contracts\PaymentGatewayInterface;
use App\Modules\Payments\Infrastructure\DarajaService;

class MpesaGateway implements PaymentGatewayInterface
{
    public function __construct(
        protected DarajaService $darajaService
    ) {}

    public function initiatePayment(Order $order, array $paymentDetails): string
    {
        $phoneNumber = $paymentDetails['phone_number'] ?? throw new \InvalidArgumentException("Phone number is required for M-Pesa STK Push.");
        
        $response = $this->darajaService->initiateStkPush(
            phoneNumber: $phoneNumber,
            amount: (int) $order->total_amount,
            reference: $order->reference,
            description: "Payment for Order {$order->reference}"
        );

        // M-Pesa returns CheckoutRequestID which is our unique handle for this transaction
        return $response['CheckoutRequestID'];
    }

    public function verifyPayment(string $requestId): array
    {
        // Reserved for future polling implementations. 
        // We currently rely on Webhook callbacks.
        return [];
    }
}
