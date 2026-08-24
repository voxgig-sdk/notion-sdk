<?php
declare(strict_types=1);

// Notion SDK utility: result_headers

class NotionResultHeaders
{
    public static function call(NotionContext $ctx): ?NotionResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
