<?php
declare(strict_types=1);

// Page entity test

require_once __DIR__ . '/../notion_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class PageEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = NotionSDK::test(null, null);
        $ent = $testsdk->Page(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = page_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "update", "load"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "page." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set NOTION_TEST_PAGE_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $page_ref01_ent = $client->Page(null);
        $page_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.page"), "page_ref01"));

        $page_ref01_data_result = $page_ref01_ent->create($page_ref01_data, null);
        $page_ref01_data = Helpers::to_map(is_object($page_ref01_data_result) && method_exists($page_ref01_data_result, 'data_get') ? $page_ref01_data_result->data_get() : $page_ref01_data_result);
        $this->assertNotNull($page_ref01_data);
        $this->assertNotNull($page_ref01_data["id"]);

        // UPDATE
        $page_ref01_data_up0_up = [
            "id" => $page_ref01_data["id"],
        ];

        $page_ref01_markdef_up0_name = "created_time";
        $page_ref01_markdef_up0_value = "Mark01-page_ref01_" . $setup["now"];
        $page_ref01_data_up0_up[$page_ref01_markdef_up0_name] = $page_ref01_markdef_up0_value;

        $page_ref01_resdata_up0_result = $page_ref01_ent->update($page_ref01_data_up0_up, null);
        $page_ref01_resdata_up0 = Helpers::to_map(is_object($page_ref01_resdata_up0_result) && method_exists($page_ref01_resdata_up0_result, 'data_get') ? $page_ref01_resdata_up0_result->data_get() : $page_ref01_resdata_up0_result);
        $this->assertNotNull($page_ref01_resdata_up0);
        $this->assertEquals($page_ref01_resdata_up0["id"], $page_ref01_data_up0_up["id"]);
        $this->assertEquals($page_ref01_resdata_up0[$page_ref01_markdef_up0_name], $page_ref01_markdef_up0_value);

        // LOAD
        $page_ref01_match_dt0 = [
            "id" => $page_ref01_data["id"],
        ];
        $page_ref01_data_dt0_loaded = $page_ref01_ent->load($page_ref01_match_dt0, null);
        $page_ref01_data_dt0_load_result = Helpers::to_map(is_object($page_ref01_data_dt0_loaded) && method_exists($page_ref01_data_dt0_loaded, 'data_get') ? $page_ref01_data_dt0_loaded->data_get() : $page_ref01_data_dt0_loaded);
        $this->assertNotNull($page_ref01_data_dt0_load_result);
        $this->assertEquals($page_ref01_data_dt0_load_result["id"], $page_ref01_data["id"]);

    }
}

function page_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/page/PageTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = NotionSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["page01", "page02", "page03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("NOTION_TEST_PAGE_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "NOTION_TEST_PAGE_ENTID" => $idmap,
        "NOTION_TEST_LIVE" => "FALSE",
        "NOTION_TEST_EXPLAIN" => "FALSE",
        "NOTION_APIKEY" => "",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["NOTION_TEST_PAGE_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["NOTION_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            Runner::live_client_options(),
            [
                "apikey" => $env["NOTION_APIKEY"],
            ],
            // ismap, not a plain "?? []" default: an empty PHP array is a
            // LIST, and a non-map later entry REPLACES the accumulated map in
            // merge - so the no-extras call discarded live_client_options()
            // and the apikey/server map above it.
            Vs::ismap($extra) ? $extra : new \stdClass(),
        ]);
        // "?? []" because merge legitimately answers with a stdClass when every
        // contributing entry is an EMPTY map - an SDK with no apikey and no
        // server variables generates an empty middle entry, so that is the
        // common case, not the edge one. to_map returns null for a non-array by
        // design, and the constructor takes a non-nullable array, so without the
        // fallback every such SDK died on "must be of type array, null given"
        // the moment live mode was switched on. Offline mode never reaches this
        // branch, which is why the offline suite stayed green.
        $client = new NotionSDK(Helpers::to_map($merged_opts) ?? []);
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
