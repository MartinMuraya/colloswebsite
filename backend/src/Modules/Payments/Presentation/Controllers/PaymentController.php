<?php

namespace App\Modules\Payments\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::with('order')->latest()->get()->map(function ($payment) {
            return [
                'id' => $payment->id,
                'order_reference' => $payment->order ? $payment->order->reference : 'N/A',
                'customer_name' => $payment->order ? $payment->order->customer_name : 'Unknown',
                'amount' => (float) $payment->amount,
                'payment_method' => $payment->payment_method,
                'receipt_number' => $payment->receipt_number,
                'status' => $payment->status,
                'created_at' => $payment->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json(['data' => $payments]);
    }
}
