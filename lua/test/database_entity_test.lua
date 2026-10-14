-- Database entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("notion_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

-- main.kit.test.live.strict is true (the default is true): a live
-- request that fails, or a live test missing an input it needs,
-- fails the test.
-- An account with no record for a test to read skips it either way.
local LIVE_STRICT = true


describe("DatabaseEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Database(nil)
    assert.is_not_nil(ent)
  end)

  it("should refuse an invalid request", function()
    local config = require("config_shared")()
    if type(config.feature) ~= "table" or config.feature.validate == nil then
      pending("feature not present in this SDK: validate")
      return
    end
    local client = sdk.test(nil, { feature = { validate = { active = true } } })
    local _, err = client:Database(nil):load({ ["id"] = 1 }, nil)
    assert.are.equal("validate_failed", type(err) == "table" and err.code or nil)
  end)

  it("should run basic flow", function()
    local setup = database_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"create", "update", "load"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "database." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    local client = setup.client

    -- CREATE
    local database_ref01_ent = client:Database(nil)
    local database_ref01_data = helpers.to_map(vs.getprop(
      vs.getpath(setup.data, "new.database"), "database_ref01"))

    local database_ref01_data_result, err = database_ref01_ent:create(database_ref01_data, nil)
    assert.is_nil(err)
    database_ref01_data = helpers.to_map(type(database_ref01_data_result) == 'table' and database_ref01_data_result.data_get and database_ref01_data_result:data_get() or database_ref01_data_result)
    assert.is_not_nil(database_ref01_data)
    assert.is_not_nil(database_ref01_data["id"])

    -- UPDATE
    local database_ref01_data_up0_up = {
      id = database_ref01_data["id"],
    }

    local database_ref01_markdef_up0_name = "created_time"
    local database_ref01_markdef_up0_value = "Mark01-database_ref01_" .. tostring(setup.now)
    database_ref01_data_up0_up[database_ref01_markdef_up0_name] = database_ref01_markdef_up0_value

    local database_ref01_resdata_up0_result, err = database_ref01_ent:update(database_ref01_data_up0_up, nil)
    assert.is_nil(err)
    local database_ref01_resdata_up0 = helpers.to_map(type(database_ref01_resdata_up0_result) == 'table' and database_ref01_resdata_up0_result.data_get and database_ref01_resdata_up0_result:data_get() or database_ref01_resdata_up0_result)
    assert.is_not_nil(database_ref01_resdata_up0)
    assert.are.equal(database_ref01_resdata_up0["id"], database_ref01_data_up0_up["id"])
    assert.are.equal(database_ref01_resdata_up0[database_ref01_markdef_up0_name], database_ref01_markdef_up0_value)

    -- LOAD
    local database_ref01_match_dt0 = {
      id = database_ref01_data["id"],
    }
    local database_ref01_data_dt0_loaded, err = database_ref01_ent:load(database_ref01_match_dt0, nil)
    assert.is_nil(err)
    local database_ref01_data_dt0_load_result = helpers.to_map(type(database_ref01_data_dt0_loaded) == 'table' and database_ref01_data_dt0_loaded.data_get and database_ref01_data_dt0_loaded:data_get() or database_ref01_data_dt0_loaded)
    assert.is_not_nil(database_ref01_data_dt0_load_result)
    assert.are.equal(database_ref01_data_dt0_load_result["id"], database_ref01_data["id"])

  end)
end)

function database_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/database/DatabaseTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read database test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "database01", "database02", "database03" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Whether *_ENTID supplied the idmap, read before env_override consumes
  -- it: without it, the ids a live flow binds are the fixture's synthetic ones.
  local entid_env_raw = os.getenv("NOTION_TEST_DATABASE_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["NOTION_TEST_DATABASE_ENTID"] = idmap,
    ["NOTION_TEST_LIVE"] = "FALSE",
    ["NOTION_TEST_EXPLAIN"] = "FALSE",
    ["NOTION_APIKEY"] = "",
  })

  local idmap_resolved = helpers.to_map(
    env["NOTION_TEST_DATABASE_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["NOTION_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      -- FIRST, so the generated fields below win: sdk-test-control.json's
      -- test.client.options adds to the live client, it does not redirect it.
      runner.live_client_options(),
      {
        apikey = env["NOTION_APIKEY"],
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["NOTION_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["NOTION_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
