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

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const databaseEntityLiveStrict = true


func TestDatabaseEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Database(nil)
		if ent == nil {
			t.Fatal("expected non-nil DatabaseEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.Database(nil).Load(map[string]any{"id": 1}, nil)
		if sdkerr, ok := err.(*core.NotionError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
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
		client := setup.client
		_ = client

		// CREATE
		databaseRef01Ent := client.Database(nil)
		databaseRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "database"}), "database_ref01"))

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
	idmap, _ := vs.Transform(
		[]any{"database01", "database02", "database03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("NOTION_TEST_DATABASE_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"NOTION_TEST_DATABASE_ENTID": idmap,
		"NOTION_TEST_LIVE":      "FALSE",
		"NOTION_TEST_EXPLAIN":   "FALSE",
		"NOTION_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["NOTION_TEST_DATABASE_ENTID"])
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
