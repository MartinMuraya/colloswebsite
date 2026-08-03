<?php

namespace App\Modules\Auth\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Data\UserData;

class LoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // Assign default Customer role if they have no roles
            if ($user->roles()->count() === 0) {
                $user->assignRole('Customer');
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $user->load('roles'); // Ensure roles are returned
            
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => UserData::from($user),
            ], 200);
        }

        return response()->json(['message' => 'The provided credentials do not match our records.'], 401);
    }
}
