<?php

namespace App\Modules\Catalog\Domain\ValueObjects;

use App\Core\Domain\ValueObject;
use InvalidArgumentException;

class SKU extends ValueObject
{
    private string $value;

    public function __construct(string $value)
    {
        if (empty($value) || strlen($value) < 3) {
            throw new InvalidArgumentException("SKU must be at least 3 characters long.");
        }
        $this->value = strtoupper($value);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(ValueObject $object): bool
    {
        return $object instanceof SKU && $this->value === $object->getValue();
    }
}
