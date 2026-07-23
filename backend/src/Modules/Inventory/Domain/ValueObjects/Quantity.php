<?php

namespace App\Modules\Inventory\Domain\ValueObjects;

use App\Core\Domain\ValueObject;
use InvalidArgumentException;

class Quantity extends ValueObject
{
    private int $value;

    public function __construct(int $value)
    {
        if ($value < 0) {
            throw new InvalidArgumentException("Quantity cannot be negative.");
        }
        $this->value = $value;
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function add(Quantity $other): self
    {
        return new self($this->value + $other->getValue());
    }

    public function subtract(Quantity $other): self
    {
        if ($this->value < $other->getValue()) {
            throw new \Exception("Insufficient quantity to subtract.");
        }
        return new self($this->value - $other->getValue());
    }

    public function equals(ValueObject $object): bool
    {
        return $object instanceof Quantity && $this->value === $object->getValue();
    }
}
