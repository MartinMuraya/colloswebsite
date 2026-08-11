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
        $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));
        $uploadResult = $cloudinary->uploadApi()->upload($image->getRealPath(), [
            'folder' => $folder
        ]);
        
        return $uploadResult['secure_url'];
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
