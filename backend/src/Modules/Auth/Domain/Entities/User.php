<?php

namespace App\Modules\Auth\Domain\Entities;

use App\Core\Domain\Entity;
use App\Modules\Auth\Domain\ValueObjects\EmailAddress;
use App\Modules\Auth\Domain\ValueObjects\Password;

class User extends Entity
{
    private string $id;
    private string $name;
    private EmailAddress $email;
    private Password $password;
    private array $roles;

    public function __construct(string $id, string $name, EmailAddress $email, Password $password, array $roles = [])
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->roles = $roles;
    }

    public static function create(string $id, string $name, EmailAddress $email, Password $password): self
    {
        $user = new self($id, $name, $email, $password);
        
        // Example: $user->recordEvent(new UserRegistered($user));

        return $user;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): EmailAddress
    {
        return $this->email;
    }

    public function getPassword(): Password
    {
        return $this->password;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function assignRole(string $role): void
    {
        if (!in_array($role, $this->roles)) {
            $this->roles[] = $role;
            // Example: $this->recordEvent(new RoleAssigned($this->id, $role));
        }
    }
}
