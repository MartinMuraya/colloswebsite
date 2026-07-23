<?php

namespace App\Modules\Auth\Domain\ValueObjects;

use App\Core\Domain\ValueObject;
use InvalidArgumentException;

class EmailAddress extends ValueObject
{
    private string $email;

    public function __construct(string $email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email address format.");
        }
        $this->email = $email;
    }

    public function getValue(): string
    {
        return $this->email;
    }

    public function equals(ValueObject $object): bool
    {
        return $object instanceof EmailAddress && $this->email === $object->getValue();
    }
}
