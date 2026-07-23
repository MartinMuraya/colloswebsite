<?php

namespace App\Modules\Payments\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Application\Actions\ProcessPaymentAction;
use App\Modules\Payments\Application\DTO\ProcessPaymentDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MpesaController extends Controller
{
    private ProcessPaymentAction $processPaymentAction;

    public function __construct(ProcessPaymentAction $processPaymentAction)
    {
        $this->processPaymentAction = $processPaymentAction;
    }

    public function initiatePayment(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'order_reference' => 'required|string',
        ]);

        $dto = new ProcessPaymentDTO(
            phoneNumber: $validated['phone_number'],
            amount: (int)$validated['amount'],
            orderReference: $validated['order_reference']
        );

        try {
            $result = $this->processPaymentAction->execute($dto);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Payment initiation failed: ' . $e->getMessage()], 400);
        }
    }

    public function callback(Request $request)
    {
        $payload = $request->all();
        
        Log::info('M-Pesa Webhook Callback Received', [
            'payload' => $payload
        ]);

        $resultCode = $payload['Body']['stkCallback']['ResultCode'] ?? null;
        $checkoutRequestID = $payload['Body']['stkCallback']['CheckoutRequestID'] ?? null;

        if ($resultCode === 0) {
            // Transaction successful
            $callbackMetadata = $payload['Body']['stkCallback']['CallbackMetadata']['Item'] ?? [];
            $mpesaReceiptNumber = null;
            $amount = null;

            foreach ($callbackMetadata as $item) {
                if ($item['Name'] === 'MpesaReceiptNumber') {
                    $mpesaReceiptNumber = $item['Value'];
                }
                if ($item['Name'] === 'Amount') {
                    $amount = $item['Value'];
                }
            }

            Log::info("Payment Successful", [
                'receipt' => $mpesaReceiptNumber,
                'amount' => $amount,
                'checkout_request_id' => $checkoutRequestID
            ]);

            // Here we would dispatch an event: PaymentSuccessfulEvent($checkoutRequestID, $mpesaReceiptNumber)
            // Which would then update the Order status in the Catalog/Orders module.

        } else {
            // Transaction failed or cancelled
            $resultDesc = $payload['Body']['stkCallback']['ResultDesc'] ?? 'Unknown Error';
            
            Log::warning("Payment Failed", [
                'reason' => $resultDesc,
                'checkout_request_id' => $checkoutRequestID
            ]);
            
            // Dispatch event: PaymentFailedEvent($checkoutRequestID, $resultDesc)
        }

        // Always acknowledge receipt to Safaricom
        return response()->json([
            'ResultCode' => 0,
            'ResultDesc' => 'Success'
        ]);
    }
}
