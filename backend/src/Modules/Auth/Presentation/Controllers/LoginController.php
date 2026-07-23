<?php

namespace App\Modules\Auth\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            
            // Assign Super Admin role if it matches env and they don't have it
            if ($user->email === env('SUPER_ADMIN_EMAIL', 'gathongomoses14@gmail.com') && !$user->hasRole('Super Admin')) {
                $user->assignRole('Super Admin');
            } elseif (!$user->hasRole('Super Admin') && !$user->hasRole('Admin') && !$user->hasRole('Customer')) {
                $user->assignRole('Customer');
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $user->load('roles'); // Ensure roles are returned
            
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user,
            ], 200);
        }

        return response()->json(['message' => 'The provided credentials do not match our records.'], 401);
    }
}
