<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\ServiceCategory;

class ServiceCategoryData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public ?string $description,
        public ?string $image_url,
        public ?int $parent_id,
        public int $sort_order,
        public bool $is_published,
        public bool $show_in_navigation,
        public ?string $seo_title,
        public ?string $seo_description
    ) {}

    public static function fromModel(ServiceCategory $category): self
    {
        return new self(
            $category->id,
            $category->name,
            $category->slug,
            $category->description,
            $category->image_url,
            $category->parent_id,
            $category->sort_order,
            $category->is_published,
            $category->show_in_navigation,
            $category->seo_title,
            $category->seo_description
        );
    }
}
