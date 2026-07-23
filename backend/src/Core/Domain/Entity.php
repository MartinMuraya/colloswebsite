<?php

namespace App\Core\Domain;

abstract class Entity
{
    protected array $domainEvents = [];

    public function recordEvent(DomainEvent $event): void
    {
        $this->domainEvents[] = $event;
    }

    public function releaseEvents(): array
    {
        $events = $this->domainEvents;
        $this->domainEvents = [];

        return $events;
    }
}
