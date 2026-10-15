<?php
declare(strict_types=1);

// Notion SDK feature factory

require_once __DIR__ . '/feature/BaseFeature.php';
require_once __DIR__ . '/feature/DebugFeature.php';
require_once __DIR__ . '/feature/IdempotencyFeature.php';
require_once __DIR__ . '/feature/MetricsFeature.php';
require_once __DIR__ . '/feature/PagingFeature.php';
require_once __DIR__ . '/feature/RatelimitFeature.php';
require_once __DIR__ . '/feature/RetryFeature.php';
require_once __DIR__ . '/feature/StationFeature.php';
require_once __DIR__ . '/feature/TestFeature.php';
require_once __DIR__ . '/feature/TimeoutFeature.php';


class NotionFeatures
{
    public static function make_feature(string $name)
    {
        switch ($name) {
            case "base":
                return new NotionBaseFeature();
            case "debug":
                return new NotionDebugFeature();
            case "idempotency":
                return new NotionIdempotencyFeature();
            case "metrics":
                return new NotionMetricsFeature();
            case "paging":
                return new NotionPagingFeature();
            case "ratelimit":
                return new NotionRatelimitFeature();
            case "retry":
                return new NotionRetryFeature();
            case "station":
                return new NotionStationFeature();
            case "test":
                return new NotionTestFeature();
            case "timeout":
                return new NotionTimeoutFeature();
            default:
                return new NotionBaseFeature();
        }
    }

    /**
     * Does a generated feature class back this name? False for a name only
     * an options extend instance can supply (the station adopt path) - the
     * constructor uses this to skip make_feature for such names instead of
     * adding a stray BaseFeature.
     */
    public static function has_feature(string $name): bool
    {
        switch ($name) {
            case "base":
            case "debug":
            case "idempotency":
            case "metrics":
            case "paging":
            case "ratelimit":
            case "retry":
            case "station":
            case "test":
            case "timeout":
                return true;
            default:
                return false;
        }
    }
}
