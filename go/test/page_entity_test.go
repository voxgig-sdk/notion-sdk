package sdktest

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/notion-sdk/go"
	"github.com/voxgig-sdk/notion-sdk/go/core"

	vs "github.com/voxgig-sdk/notion-sdk/go/utility/struct"
)

func TestPageEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Page(nil)
		if ent == nil {
			t.Fatal("expected non-nil PageEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := pageBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "update", "load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "page." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set NOTION_TEST_PAGE_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		pageRef01Ent := client.Page(nil)
		pageRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "page"}), "page_ref01"))

		pageRef01DataResult, err := pageRef01Ent.Create(pageRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		pageRef01Data = core.ToMapAny(entityData(pageRef01DataResult))
		if pageRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if pageRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// UPDATE
		pageRef01DataUp0Up := map[string]any{
			"id": pageRef01Data["id"],
		}

		pageRef01MarkdefUp0Name := "created_time"
		pageRef01MarkdefUp0Value := fmt.Sprintf("Mark01-page_ref01_%d", setup.now)
		pageRef01DataUp0Up[pageRef01MarkdefUp0Name] = pageRef01MarkdefUp0Value

		pageRef01ResdataUp0Result, err := pageRef01Ent.Update(pageRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		pageRef01ResdataUp0 := core.ToMapAny(entityData(pageRef01ResdataUp0Result))
		if pageRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if pageRef01ResdataUp0["id"] != pageRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if pageRef01ResdataUp0[pageRef01MarkdefUp0Name] != pageRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", pageRef01MarkdefUp0Name, pageRef01ResdataUp0[pageRef01MarkdefUp0Name])
		}

		// LOAD
		pageRef01MatchDt0 := map[string]any{
			"id": pageRef01Data["id"],
		}
		pageRef01DataDt0Loaded, err := pageRef01Ent.Load(pageRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		pageRef01DataDt0LoadResult := core.ToMapAny(entityData(pageRef01DataDt0Loaded))
		if pageRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if pageRef01DataDt0LoadResult["id"] != pageRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

	})
}

func pageBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "page", "PageTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read page test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse page test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"page01", "page02", "page03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("NOTION_TEST_PAGE_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"NOTION_TEST_PAGE_ENTID": idmap,
		"NOTION_TEST_LIVE":      "FALSE",
		"NOTION_TEST_EXPLAIN":   "FALSE",
		"NOTION_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["NOTION_TEST_PAGE_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["NOTION_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["NOTION_APIKEY"],
			},
			extraOpts,
		})
		client = sdk.NewNotionSDK(core.ToMapAny(mergedOpts))
	}

	live := env["NOTION_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["NOTION_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
