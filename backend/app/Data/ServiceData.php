<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Service;

class ServiceData extends Data
{
    public function __construct(
        public int $id,
        public int $service_category_id,
        public string $name,
        public string $slug,
        public ?string $short_description,
        public ?string $full_description,
        public ?string $icon,
        public ?string $featured_image_url,
        public ?array $gallery_images,
        public ?string $estimated_duration,
        public ?string $service_type,
        public bool $is_residential,
        public bool $is_commercial,
        public bool $is_industrial,
        public bool $is_featured,
        public bool $is_published,
        public bool $show_in_navigation,
        public ?array $features,
        public ?array $tags,
        public ?string $seo_title,
        public ?string $seo_description,
        public ?string $category
    ) {}

    public static function from(mixed ...$payloads): static
    {
        if (isset($payloads[0]) && $payloads[0] instanceof Service) {
            return self::fromModel($payloads[0]);
        }

        return parent::from(...$payloads);
    }

    public static function fromModel(Service $service): self
    {
        return new self(
            $service->id,
            $service->service_category_id,
            $service->name,
            $service->slug,
            $service->short_description,
            $service->full_description,
            $service->icon,
            $service->featured_image_url,
            $service->gallery_images,
            $service->estimated_duration,
            $service->service_type,
            $service->is_residential,
            $service->is_commercial,
            $service->is_industrial,
            $service->is_featured,
            $service->is_published,
            $service->show_in_navigation,
            $service->features,
            $service->tags,
            $service->seo_title,
            $service->seo_description,
            $service->category->name ?? 'Uncategorized'
        );
    }
}
