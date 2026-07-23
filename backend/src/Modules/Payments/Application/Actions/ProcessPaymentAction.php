<?php

namespace App\Modules\Payments\Application\Actions;

use App\Core\Application\Actions\Action;
use App\Modules\Payments\Application\DTO\ProcessPaymentDTO;
use App\Modules\Payments\Infrastructure\DarajaService;
use Illuminate\Support\Facades\Log;

class ProcessPaymentAction implements Action
{
    private DarajaService $darajaService;

    public function __construct(DarajaService $darajaService)
    {
        $this->darajaService = $darajaService;
    }

    /**
     * @param ProcessPaymentDTO $request
     */
    public function execute(mixed $request): array
    {
        try {
            $response = $this->darajaService->initiateStkPush(
                phoneNumber: $request->phoneNumber,
                amount: $request->amount,
                reference: $request->orderReference,
                description: $request->description
            );

            // Log the CheckoutRequestID to track the transaction state later
            Log::info("STK Push Initiated", [
                'order_reference' => $request->orderReference,
                'checkout_request_id' => $response['CheckoutRequestID'] ?? null,
                'response' => $response
            ]);

            return [
                'status' => 'success',
                'message' => 'Payment prompt sent to user phone',
                'data' => $response
            ];
        } catch (\Exception $e) {
            Log::error("STK Push Failed", [
                'order_reference' => $request->orderReference,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
