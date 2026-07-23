<?php

namespace App\Modules\Inventory\Domain\Entities;

use App\Core\Domain\Entity;

class Warehouse extends Entity
{
    private string $id;
    private string $name;
    private string $location;

    public function __construct(string $id, string $name, string $location)
    {
        $this->id = $id;
        $this->name = $name;
        $this->location = $location;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getLocation(): string
    {
        return $this->location;
    }
}
