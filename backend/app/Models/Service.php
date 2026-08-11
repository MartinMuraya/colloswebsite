<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    protected function casts(): array
    {
        return [
            'is_residential' => 'boolean',
            'is_commercial' => 'boolean',
            'is_industrial' => 'boolean',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'show_in_navigation' => 'boolean',
            'gallery_images' => 'array',
            'features' => 'array',
            'tags' => 'array',
        ];
    }
}
