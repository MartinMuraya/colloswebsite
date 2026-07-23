<?php

namespace App\Modules\Auth\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Application\Actions\LoginUserAction;
use App\Modules\Auth\Application\DTO\LoginUserDTO;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    private LoginUserAction $action;

    public function __construct(LoginUserAction $action)
    {
        $this->action = $action;
    }

    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $dto = new LoginUserDTO(
            email: $validated['email'],
            password: $validated['password']
        );

        try {
            $result = $this->action->execute($dto);
            $user = $result['user'];
            
            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail()->getValue(),
                    'roles' => $user->getRoles()
                ],
                'token' => $result['token']
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }
}
