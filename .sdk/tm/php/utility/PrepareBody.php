<?php
declare(strict_types=1);

// Notion SDK utility: prepare_body

class NotionPrepareBody
{
    public static function call(NotionContext $ctx): mixed
    {
        if ($ctx->op->input === 'data') {
            return ($ctx->utility->transform_request)($ctx);
        }
        return null;
    }
}
