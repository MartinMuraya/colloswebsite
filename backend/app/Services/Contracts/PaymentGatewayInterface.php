<?php

namespace App\Services\Contracts;

use App\Models\Order;

interface PaymentGatewayInterface
{
    /**
     * Initiate a payment request for an order.
     * Must return a transaction reference or request ID.
     */
    public function initiatePayment(Order $order, array $paymentDetails): string;

    /**
     * Verify the status of a payment using the request ID.
     */
    public function verifyPayment(string $requestId): array;
}
