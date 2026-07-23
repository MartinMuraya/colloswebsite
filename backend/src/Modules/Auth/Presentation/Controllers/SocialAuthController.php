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
        return Socialite::driver('google')->stateless()->redirect();
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

            Auth::login($user);
            request()->session()->regenerate();

            return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?success=1');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=' . urlencode('oauth_failed: ' . $e->getMessage()));
        }
    }
}
