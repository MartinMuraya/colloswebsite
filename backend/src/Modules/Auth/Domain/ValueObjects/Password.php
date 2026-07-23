<?php

namespace App\Modules\Auth\Domain\ValueObjects;

use App\Core\Domain\ValueObject;
use InvalidArgumentException;

class Password extends ValueObject
{
    private string $hashedPassword;

    public function __construct(string $hashedPassword)
    {
        if (empty($hashedPassword)) {
            throw new InvalidArgumentException("Password hash cannot be empty.");
        }
        $this->hashedPassword = $hashedPassword;
    }

    public static function hash(string $plainTextPassword): self
    {
        if (strlen($plainTextPassword) < 8) {
            throw new InvalidArgumentException("Password must be at least 8 characters long.");
        }
        return new self(password_hash($plainTextPassword, PASSWORD_BCRYPT));
    }

    public function verify(string $plainTextPassword): bool
    {
        return password_verify($plainTextPassword, $this->hashedPassword);
    }

    public function getHash(): string
    {
        return $this->hashedPassword;
    }

    public function equals(ValueObject $object): bool
    {
        return $object instanceof Password && $this->hashedPassword === $object->getHash();
    }
}
