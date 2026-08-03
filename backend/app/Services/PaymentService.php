<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Services\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function __construct(
        protected PaymentGatewayInterface $gateway
    ) {}

    public function processOrderPayment(string $orderReference, array $paymentDetails)
    {
        $order = Order::where('reference', $orderReference)->firstOrFail();

        // 1. Delegate to the Polymorphic Gateway
        $checkoutRequestId = $this->gateway->initiatePayment($order, $paymentDetails);

        // 2. Record the pending payment in our database safely correlated
        $payment = Payment::create([
            'order_id' => $order->id,
            'amount' => $order->total_amount,
            'payment_method' => 'M-Pesa',
            'checkout_request_id' => $checkoutRequestId,
            'status' => 'pending'
        ]);

        return $payment;
    }

    public function handleMpesaCallback(array $payload)
    {
        Log::info('Processing M-Pesa Webhook', ['payload' => $payload]);

        $resultCode = $payload['Body']['stkCallback']['ResultCode'] ?? null;
        $checkoutRequestID = $payload['Body']['stkCallback']['CheckoutRequestID'] ?? null;

        if (!$checkoutRequestID) {
            Log::error('Invalid M-Pesa Callback: Missing CheckoutRequestID');
            return false;
        }

        $payment = Payment::where('checkout_request_id', $checkoutRequestID)->first();

        if (!$payment) {
            Log::error("Payment record not found for CheckoutRequestID: {$checkoutRequestID}");
            return false;
        }

        if ($resultCode === 0) {
            // Success
            $callbackMetadata = $payload['Body']['stkCallback']['CallbackMetadata']['Item'] ?? [];
            $mpesaReceiptNumber = null;

            foreach ($callbackMetadata as $item) {
                if ($item['Name'] === 'MpesaReceiptNumber') {
                    $mpesaReceiptNumber = $item['Value'];
                }
            }

            $payment->update([
                'status' => 'completed',
                'receipt_number' => $mpesaReceiptNumber
            ]);

            $payment->order->update(['status' => 'paid']);

            Log::info("Payment Completed", ['order_id' => $payment->order_id, 'receipt' => $mpesaReceiptNumber]);
            return true;
        } else {
            // Failed
            $resultDesc = $payload['Body']['stkCallback']['ResultDesc'] ?? 'Unknown Error';
            
            $payment->update(['status' => 'failed']);
            $payment->order->update(['status' => 'failed']);

            Log::warning("Payment Failed", ['order_id' => $payment->order_id, 'reason' => $resultDesc]);
            return false;
        }
    }
}
