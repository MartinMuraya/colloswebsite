<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\User;

class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $profile_picture,
        public array $roles
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            $user->id,
            $user->name,
            $user->email,
            $user->profile_picture,
            $user->roles->pluck('name')->toArray()
        );
    }
}
