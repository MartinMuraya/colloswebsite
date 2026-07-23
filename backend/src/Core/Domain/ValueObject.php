<?php

namespace App\Core\Domain;

abstract class ValueObject
{
    abstract public function equals(ValueObject $object): bool;
}
