<?php
declare(strict_types=1);

// Typed models for the Notion SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Database entity data model. */
class Database
{
    public ?string $created_time = null;
    public ?string $id = null;
    public ?string $last_edited_time = null;
    public ?string $object = null;
    public ?array $parent = null;
    public ?array $properties = null;
    public ?array $title = null;
}

/** Request payload for Database#load. */
class DatabaseLoadMatch
{
    public string $id;
}

/** Request payload for Database#create. */
class DatabaseCreateData
{
    public ?string $created_time = null;
    public ?string $id = null;
    public ?string $last_edited_time = null;
    public ?string $object = null;
    public ?array $parent = null;
    public ?array $properties = null;
    public ?array $title = null;
}

/** Request payload for Database#update. */
class DatabaseUpdateData
{
    public string $id;
    public ?string $created_time = null;
    public ?string $last_edited_time = null;
    public ?string $object = null;
    public ?array $parent = null;
    public ?array $properties = null;
    public ?array $title = null;
}

/** Page entity data model. */
class Page
{
    public ?bool $archived = null;
    public ?string $created_time = null;
    public ?string $id = null;
    public ?string $last_edited_time = null;
    public ?string $object = null;
    public ?array $parent = null;
    public ?array $properties = null;
}

/** Request payload for Page#load. */
class PageLoadMatch
{
    public string $id;
}

/** Request payload for Page#create. */
class PageCreateData
{
    public ?bool $archived = null;
    public ?string $created_time = null;
    public ?string $id = null;
    public ?string $last_edited_time = null;
    public ?string $object = null;
    public ?array $parent = null;
    public ?array $properties = null;
}

/** Request payload for Page#update. */
class PageUpdateData
{
    public string $id;
    public ?bool $archived = null;
    public ?string $created_time = null;
    public ?string $last_edited_time = null;
    public ?string $object = null;
    public ?array $parent = null;
    public ?array $properties = null;
}

