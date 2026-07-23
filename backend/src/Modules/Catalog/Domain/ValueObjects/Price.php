<?php

namespace App\Modules\Catalog\Domain\ValueObjects;

use App\Core\Domain\ValueObject;
use InvalidArgumentException;

class Price extends ValueObject
{
    private int $amount; // stored in cents
    private string $currency;

    public function __construct(int $amount, string $currency = 'USD')
    {
        if ($amount < 0) {
            throw new InvalidArgumentException("Price cannot be negative.");
        }
        $this->amount = $amount;
        $this->currency = $currency;
    }

    public function getAmount(): int
    {
        return $this->amount;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function equals(ValueObject $object): bool
    {
        return $object instanceof Price 
            && $this->amount === $object->getAmount() 
            && $this->currency === $object->getCurrency();
    }
}
