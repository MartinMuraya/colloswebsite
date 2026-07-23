<?php

namespace App\Modules\Auth\Application\DTO;

use App\Core\Application\DTO\DataTransferObject;

class RegisterUserDTO implements DataTransferObject
{
    public readonly string $name;
    public readonly string $email;
    public readonly string $password;

    public function __construct(string $name, string $email, string $password)
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
        ];
    }
}
