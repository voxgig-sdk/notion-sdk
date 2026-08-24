<?php
declare(strict_types=1);

// Notion SDK utility: result_body

class NotionResultBody
{
    public static function call(NotionContext $ctx): ?NotionResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
