<?php

namespace App\Modules\Payments\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class MpesaController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    public function initiatePayment(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'order_reference' => 'required|string',
        ]);

        try {
            $payment = $this->paymentService->processOrderPayment($validated['order_reference'], $validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Payment prompt sent to user phone',
                'payment' => $payment
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Payment initiation failed: ' . $e->getMessage()], 400);
        }
    }

    public function callback(Request $request)
    {
        // Hand off to the service layer to update databases and order statuses safely
        $this->paymentService->handleMpesaCallback($request->all());

        // Always acknowledge receipt to Safaricom to prevent webhook retries
        return response()->json([
            'ResultCode' => 0,
            'ResultDesc' => 'Success'
        ]);
    }
}
