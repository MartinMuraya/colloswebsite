<?php

namespace App\Modules\Auth\Application\Actions;

use App\Core\Application\Actions\Action;
use App\Modules\Auth\Application\DTO\LoginUserDTO;
use App\Modules\Auth\Domain\Entities\User;
use App\Modules\Auth\Domain\ValueObjects\EmailAddress;

class LoginUserAction implements Action
{
    private $userRepository; // interface UserRepository
    private $tokenGenerator; // interface TokenGenerator

    public function __construct($userRepository, $tokenGenerator)
    {
        $this->userRepository = $userRepository;
        $this->tokenGenerator = $tokenGenerator;
    }

    /**
     * @param LoginUserDTO $request
     */
    public function execute(mixed $request): array
    {
        $email = new EmailAddress($request->email);
        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            throw new \Exception("Invalid credentials.");
        }

        if (!$user->getPassword()->verify($request->password)) {
            throw new \Exception("Invalid credentials.");
        }

        $token = $this->tokenGenerator->generateToken($user);

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}
