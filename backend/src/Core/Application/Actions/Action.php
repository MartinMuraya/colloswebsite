<?php

namespace App\Core\Application\Actions;

interface Action
{
    public function execute(mixed $request): mixed;
}
