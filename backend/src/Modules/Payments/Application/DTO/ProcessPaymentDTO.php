<?php

namespace App\Modules\Payments\Application\DTO;

use App\Core\Application\DTO\DataTransferObject;

class ProcessPaymentDTO implements DataTransferObject
{
    public readonly string $phoneNumber;
    public readonly int $amount;
    public readonly string $orderReference;
    public readonly string $description;

    public function __construct(string $phoneNumber, int $amount, string $orderReference, string $description = 'Order Payment')
    {
        $this->phoneNumber = $phoneNumber;
        $this->amount = $amount;
        $this->orderReference = $orderReference;
        $this->description = $description;
    }

    public function toArray(): array
    {
        return [
            'phone_number' => $this->phoneNumber,
            'amount' => $this->amount,
            'order_reference' => $this->orderReference,
            'description' => $this->description,
        ];
    }
}
