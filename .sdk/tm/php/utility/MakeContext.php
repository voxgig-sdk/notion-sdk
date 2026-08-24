<?php
declare(strict_types=1);

// Notion SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class NotionMakeContext
{
    public static function call(array $ctxmap, ?NotionContext $basectx): NotionContext
    {
        return new NotionContext($ctxmap, $basectx);
    }
}
