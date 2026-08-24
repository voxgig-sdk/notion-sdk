<?php
declare(strict_types=1);

// Notion SDK exists test

require_once __DIR__ . '/../notion_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = NotionSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
