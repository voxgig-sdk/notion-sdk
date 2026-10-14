# Database entity test

require "minitest/autorun"
require "json"
require_relative "../Notion_sdk"
require_relative "runner"

class DatabaseEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = NotionSDK.test(nil, nil)
    ent = testsdk.Database(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = NotionConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = NotionSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Database(nil).load({ "id" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = database_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "update", "load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "database." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # CREATE
    database_ref01_ent = client.Database(nil)
    database_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.database"), "database_ref01"))

    database_ref01_data_result = database_ref01_ent.create(database_ref01_data, nil)
    database_ref01_data = Helpers.to_map(database_ref01_data_result.respond_to?(:data_get) ? database_ref01_data_result.data_get : database_ref01_data_result)
    assert !database_ref01_data.nil?
    assert !database_ref01_data["id"].nil?

    # UPDATE
    database_ref01_data_up0_up = {
      "id" => database_ref01_data["id"],
    }

    database_ref01_markdef_up0_name = "created_time"
    database_ref01_markdef_up0_value = "Mark01-database_ref01_#{setup[:now]}"
    database_ref01_data_up0_up[database_ref01_markdef_up0_name] = database_ref01_markdef_up0_value

    database_ref01_resdata_up0_result = database_ref01_ent.update(database_ref01_data_up0_up, nil)
    database_ref01_resdata_up0 = Helpers.to_map(database_ref01_resdata_up0_result.respond_to?(:data_get) ? database_ref01_resdata_up0_result.data_get : database_ref01_resdata_up0_result)
    assert !database_ref01_resdata_up0.nil?
    assert_equal database_ref01_resdata_up0["id"], database_ref01_data_up0_up["id"]
    assert_equal database_ref01_resdata_up0[database_ref01_markdef_up0_name], database_ref01_markdef_up0_value

    # LOAD
    database_ref01_match_dt0 = {
      "id" => database_ref01_data["id"],
    }
    database_ref01_data_dt0_loaded = database_ref01_ent.load(database_ref01_match_dt0, nil)
    database_ref01_data_dt0_load_result = Helpers.to_map(database_ref01_data_dt0_loaded.respond_to?(:data_get) ? database_ref01_data_dt0_loaded.data_get : database_ref01_data_dt0_loaded)
    assert !database_ref01_data_dt0_load_result.nil?
    assert_equal database_ref01_data_dt0_load_result["id"], database_ref01_data["id"]

  end
end

def database_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "database", "DatabaseTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = NotionSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["database01", "database02", "database03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["NOTION_TEST_DATABASE_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "NOTION_TEST_DATABASE_ENTID" => idmap,
    "NOTION_TEST_LIVE" => "FALSE",
    "NOTION_TEST_EXPLAIN" => "FALSE",
    "NOTION_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["NOTION_TEST_DATABASE_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["NOTION_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["NOTION_APIKEY"],
      },
      extra || {},
    ])
    client = NotionSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["NOTION_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["NOTION_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
