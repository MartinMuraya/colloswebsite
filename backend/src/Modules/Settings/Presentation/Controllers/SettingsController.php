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
            $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));
            $uploadResult = $cloudinary->uploadApi()->upload($request->file('business_logo')->getRealPath(), [
                'folder' => 'logos'
            ]);
            $settingsToUpdate['business_logo'] = $uploadResult['secure_url'];
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
            $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));
            $uploadResult = $cloudinary->uploadApi()->upload($request->file('profile_picture')->getRealPath(), [
                'folder' => 'profiles'
            ]);
            $user->profile_picture = $uploadResult['secure_url'];
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Update CMS content (dynamic images and text)
     */
    public function updateCmsSettings(Request $request)
    {
        $settingsToUpdate = [];
        $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));

        // Handle text fields (anything that is not a file)
        foreach ($request->except(['_token', '_method']) as $key => $value) {
            if (!$request->hasFile($key) && !is_array($value)) {
                $settingsToUpdate[$key] = $value;
            }
        }

        // Handle file uploads dynamically
        foreach ($request->allFiles() as $key => $file) {
            if ($file->isValid()) {
                $uploadResult = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                    'folder' => 'cms'
                ]);
                $settingsToUpdate[$key] = $uploadResult['secure_url'];
            }
        }

        foreach ($settingsToUpdate as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json([
            'message' => 'CMS settings updated successfully.',
            'settings' => Setting::all()->pluck('value', 'key')
        ]);
    }
}
