<?php
declare(strict_types=1);

// Notion SDK base feature

class NotionBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(NotionContext $ctx, array $options): void {}
    public function PostConstruct(NotionContext $ctx): void {}
    public function PostConstructEntity(NotionContext $ctx): void {}
    public function SetData(NotionContext $ctx): void {}
    public function GetData(NotionContext $ctx): void {}
    public function GetMatch(NotionContext $ctx): void {}
    public function SetMatch(NotionContext $ctx): void {}
    public function PrePoint(NotionContext $ctx): void {}
    public function PreSpec(NotionContext $ctx): void {}
    public function PreRequest(NotionContext $ctx): void {}
    public function PreResponse(NotionContext $ctx): void {}
    public function PreResult(NotionContext $ctx): void {}
    public function PreDone(NotionContext $ctx): void {}
    public function PreUnexpected(NotionContext $ctx): void {}
}
