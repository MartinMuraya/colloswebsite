<?php

namespace App\Modules\Settings\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Get all settings as a key-value object
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Update global store settings
     */
    public function updateStoreSettings(Request $request)
    {
        $request->validate([
            'store_name' => 'nullable|string|max:255',
            'business_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'social_facebook' => 'nullable|url',
            'social_instagram' => 'nullable|url',
            'social_twitter' => 'nullable|url',
        ]);

        $settingsToUpdate = $request->only(['store_name', 'social_facebook', 'social_instagram', 'social_twitter']);

        // Handle logo upload
        if ($request->hasFile('business_logo')) {
            // Using Cloudinary or S3 depending on config
            $path = $request->file('business_logo')->store('logos', 'cloudinary');
            // Storage::disk('cloudinary')->url($path) would be used if we just stored path, 
            // but Cloudinary driver usually returns the full URL from storeOnCloudinary.
            // Wait, cloudinary-laravel has a specific method `storeOnCloudinary`
            $url = $request->file('business_logo')->storeOnCloudinary('logos')->getSecurePath();
            $settingsToUpdate['business_logo'] = $url;
        }

        foreach ($settingsToUpdate as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json([
            'message' => 'Store settings updated successfully.',
            'settings' => Setting::all()->pluck('value', 'key')
        ]);
    }

    /**
     * Update User Profile (Admin)
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = $request->user();
        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->hasFile('profile_picture')) {
            $url = $request->file('profile_picture')->storeOnCloudinary('profiles')->getSecurePath();
            $user->profile_picture = $url;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }
}
