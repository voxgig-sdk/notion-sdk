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

func TestDatabaseEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Database(nil)
		if ent == nil {
			t.Fatal("expected non-nil DatabaseEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := databaseBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "update", "load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "database." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set NOTION_TEST_DATABASE_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		databaseRef01Ent := client.Database(nil)
		databaseRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "database"}, setup.data), "database_ref01"))

		databaseRef01DataResult, err := databaseRef01Ent.Create(databaseRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		databaseRef01Data = core.ToMapAny(entityData(databaseRef01DataResult))
		if databaseRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if databaseRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// UPDATE
		databaseRef01DataUp0Up := map[string]any{
			"id": databaseRef01Data["id"],
		}

		databaseRef01MarkdefUp0Name := "created_time"
		databaseRef01MarkdefUp0Value := fmt.Sprintf("Mark01-database_ref01_%d", setup.now)
		databaseRef01DataUp0Up[databaseRef01MarkdefUp0Name] = databaseRef01MarkdefUp0Value

		databaseRef01ResdataUp0Result, err := databaseRef01Ent.Update(databaseRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		databaseRef01ResdataUp0 := core.ToMapAny(entityData(databaseRef01ResdataUp0Result))
		if databaseRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if databaseRef01ResdataUp0["id"] != databaseRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if databaseRef01ResdataUp0[databaseRef01MarkdefUp0Name] != databaseRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", databaseRef01MarkdefUp0Name, databaseRef01ResdataUp0[databaseRef01MarkdefUp0Name])
		}

		// LOAD
		databaseRef01MatchDt0 := map[string]any{
			"id": databaseRef01Data["id"],
		}
		databaseRef01DataDt0Loaded, err := databaseRef01Ent.Load(databaseRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		databaseRef01DataDt0LoadResult := core.ToMapAny(entityData(databaseRef01DataDt0Loaded))
		if databaseRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if databaseRef01DataDt0LoadResult["id"] != databaseRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

	})
}

func databaseBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "database", "DatabaseTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read database test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse database test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"database01", "database02", "database03"},
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
	entidEnvRaw := os.Getenv("NOTION_TEST_DATABASE_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"NOTION_TEST_DATABASE_ENTID": idmap,
		"NOTION_TEST_LIVE":      "FALSE",
		"NOTION_TEST_EXPLAIN":   "FALSE",
		"NOTION_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["NOTION_TEST_DATABASE_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["NOTION_TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
				"apikey": env["NOTION_APIKEY"],
			},
			extra,
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
