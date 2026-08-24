<?php
declare(strict_types=1);

// Database entity test

require_once __DIR__ . '/../notion_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class DatabaseEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = NotionSDK::test(null, null);
        $ent = $testsdk->Database(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = database_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "update", "load"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "database." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set NOTION_TEST_DATABASE_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $database_ref01_ent = $client->Database(null);
        $database_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.database"), "database_ref01"));

        $database_ref01_data_result = $database_ref01_ent->create($database_ref01_data, null);
        $database_ref01_data = Helpers::to_map(is_object($database_ref01_data_result) && method_exists($database_ref01_data_result, 'data_get') ? $database_ref01_data_result->data_get() : $database_ref01_data_result);
        $this->assertNotNull($database_ref01_data);
        $this->assertNotNull($database_ref01_data["id"]);

        // UPDATE
        $database_ref01_data_up0_up = [
            "id" => $database_ref01_data["id"],
        ];

        $database_ref01_markdef_up0_name = "created_time";
        $database_ref01_markdef_up0_value = "Mark01-database_ref01_" . $setup["now"];
        $database_ref01_data_up0_up[$database_ref01_markdef_up0_name] = $database_ref01_markdef_up0_value;

        $database_ref01_resdata_up0_result = $database_ref01_ent->update($database_ref01_data_up0_up, null);
        $database_ref01_resdata_up0 = Helpers::to_map(is_object($database_ref01_resdata_up0_result) && method_exists($database_ref01_resdata_up0_result, 'data_get') ? $database_ref01_resdata_up0_result->data_get() : $database_ref01_resdata_up0_result);
        $this->assertNotNull($database_ref01_resdata_up0);
        $this->assertEquals($database_ref01_resdata_up0["id"], $database_ref01_data_up0_up["id"]);
        $this->assertEquals($database_ref01_resdata_up0[$database_ref01_markdef_up0_name], $database_ref01_markdef_up0_value);

        // LOAD
        $database_ref01_match_dt0 = [
            "id" => $database_ref01_data["id"],
        ];
        $database_ref01_data_dt0_loaded = $database_ref01_ent->load($database_ref01_match_dt0, null);
        $database_ref01_data_dt0_load_result = Helpers::to_map(is_object($database_ref01_data_dt0_loaded) && method_exists($database_ref01_data_dt0_loaded, 'data_get') ? $database_ref01_data_dt0_loaded->data_get() : $database_ref01_data_dt0_loaded);
        $this->assertNotNull($database_ref01_data_dt0_load_result);
        $this->assertEquals($database_ref01_data_dt0_load_result["id"], $database_ref01_data["id"]);

    }
}

function database_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/database/DatabaseTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = NotionSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["database01", "database02", "database03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("NOTION_TEST_DATABASE_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "NOTION_TEST_DATABASE_ENTID" => $idmap,
        "NOTION_TEST_LIVE" => "FALSE",
        "NOTION_TEST_EXPLAIN" => "FALSE",
        "NOTION_APIKEY" => "NONE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["NOTION_TEST_DATABASE_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["NOTION_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
                "apikey" => $env["NOTION_APIKEY"],
            ],
            $extra ?? [],
        ]);
        $client = new NotionSDK(Helpers::to_map($merged_opts));
    }

    $live = $env["NOTION_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["NOTION_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
