<?php

namespace App\Core\Domain;

interface DomainEvent
{
    public function occurredOn(): \DateTimeImmutable;
}
