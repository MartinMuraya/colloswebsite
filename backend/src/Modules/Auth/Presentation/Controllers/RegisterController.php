<?php

namespace App\Modules\Auth\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Application\Actions\RegisterUserAction;
use App\Modules\Auth\Application\DTO\RegisterUserDTO;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    private RegisterUserAction $action;

    public function __construct(RegisterUserAction $action)
    {
        $this->action = $action;
    }

    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        $dto = new RegisterUserDTO(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password']
        );

        try {
            $user = $this->action->execute($dto);
            return response()->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail()->getValue(),
                    'roles' => $user->getRoles()
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
