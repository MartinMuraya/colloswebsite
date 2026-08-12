<?php

namespace App\Traits;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

trait UploadsImages
{
    /**
     * Upload a single image to Cloudinary
     */
    protected function uploadImage(UploadedFile $image, string $folder = 'uploads'): string
    {
        if (env('CLOUDINARY_URL')) {
            try {
                $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));
                $uploadResult = $cloudinary->uploadApi()->upload($image->getRealPath(), [
                    'folder' => $folder
                ]);
                
                return $uploadResult['secure_url'];
            } catch (\Throwable $e) {
                // Fall back to local disk storage if Cloudinary upload fails
            }
        }

        $path = $image->store($folder, 'public');
        return \Illuminate\Support\Facades\Storage::url($path);
    }

    /**
     * Upload multiple images to Cloudinary
     */
    protected function uploadMultipleImages(array $images, string $folder = 'uploads'): array
    {
        $urls = [];
        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $urls[] = $this->uploadImage($image, $folder);
            }
        }
        return $urls;
    }
}
