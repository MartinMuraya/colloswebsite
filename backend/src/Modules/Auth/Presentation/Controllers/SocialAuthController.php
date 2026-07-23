<?php

namespace App\Modules\Auth\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Auth\Events\Registered;

class SocialAuthController extends Controller
{
    public function redirect()
    {
        try {
            return Socialite::driver('google')->stateless()->redirect();
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google OAuth Redirect Error: ' . $e->getMessage());
            return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=' . urlencode('redirect_failed: ' . $e->getMessage()));
        }
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // Update google ID if it's missing
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
            } else {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => null, // OAuth users don't need a password
                ]);
                
                $user->markEmailAsVerified(); // Since Google already verified them
                event(new Registered($user));
            }

            // Assign roles
            if ($user->email === env('SUPER_ADMIN_EMAIL', 'gathongomoses14@gmail.com')) {
                if (!$user->hasRole('Super Admin')) {
                    $user->assignRole('Super Admin');
                }
            } else {
                if (!$user->hasRole('Customer')) {
                    $user->assignRole('Customer');
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Optional: load roles
            $user->load('roles');

            return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?success=1&token=' . urlencode($token) . '&user=' . urlencode(json_encode($user)));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=' . urlencode('oauth_failed: ' . $e->getMessage()));
        }
    }
}
