<?php

namespace App\Modules\Auth\Application\Actions;

use App\Core\Application\Actions\Action;
use App\Modules\Auth\Application\DTO\RegisterUserDTO;
use App\Modules\Auth\Domain\Entities\User;
use App\Modules\Auth\Domain\ValueObjects\EmailAddress;
use App\Modules\Auth\Domain\ValueObjects\Password;

class RegisterUserAction implements Action
{
    private $userRepository; // interface UserRepository
    private $eventDispatcher;

    public function __construct($userRepository, $eventDispatcher)
    {
        $this->userRepository = $userRepository;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param RegisterUserDTO $request
     */
    public function execute(mixed $request): User
    {
        // 1. Convert primitive data to Value Objects
        $email = new EmailAddress($request->email);
        $password = Password::hash($request->password);

        // 2. Business logic (e.g., check if email is unique)
        if ($this->userRepository->findByEmail($email) !== null) {
            throw new \Exception("Email is already registered.");
        }

        // 3. Create Entity
        $user = User::create(
            id: uniqid('usr_'), // Typically a UUID generator would be injected
            name: $request->name,
            email: $email,
            password: $password
        );

        $user->assignRole('customer');

        // 4. Persist
        $this->userRepository->save($user);

        // 5. Dispatch Domain Events
        foreach ($user->releaseEvents() as $event) {
            $this->eventDispatcher->dispatch($event);
        }

        return $user;
    }
}
