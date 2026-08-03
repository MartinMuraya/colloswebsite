<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function parent()
    {
        return $this->belongsTo(Product::class, 'parent_id');
    }

    public function variants()
    {
        return $this->hasMany(Product::class, 'parent_id');
    }

    protected function casts(): array
    {
        return [
            'is_variant' => 'boolean',
            'attributes' => 'array',
        ];
    }
}
