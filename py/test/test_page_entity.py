# Page entity test

import json
import os
import time

import pytest

from notion_sdk.utility.voxgig_struct import voxgig_struct as vs
from notion_sdk import NotionSDK
from notion_sdk.core import helpers
from notion_sdk.config import shared_config
from notion_sdk.feature.base_feature import NotionBaseFeature

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner



# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


class TestPageEntity:

    def test_should_create_instance(self):
        testsdk = NotionSDK.test(None, None)
        ent = testsdk.Page(None)
        assert ent is not None

    def test_should_refuse_an_invalid_request(self):
        if "validate" not in (shared_config().get("feature") or {}):
            pytest.skip("feature not present in this SDK: validate")
        client = NotionSDK.test(
            None, {"feature": {"validate": {"active": True}}})
        with pytest.raises(Exception) as err:
            client.Page(None).load({"id": 1}, None)
        assert "validate_failed" == getattr(err.value, "code", None)

    def test_should_run_basic_flow(self):
        setup = _page_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create", "update", "load"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "page." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        client = setup["client"]

        # CREATE
        page_ref01_ent = client.Page(None)
        page_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.page"), "page_ref01"))

        page_ref01_data = helpers.to_map(runner.entity_data(page_ref01_ent.create(page_ref01_data, None)))
        assert page_ref01_data is not None
        assert page_ref01_data["id"] is not None

        # UPDATE
        page_ref01_data_up0_up = {
            "id": page_ref01_data["id"],
        }

        page_ref01_markdef_up0_name = "created_time"
        page_ref01_markdef_up0_value = "Mark01-page_ref01_" + str(setup["now"])
        page_ref01_data_up0_up[page_ref01_markdef_up0_name] = page_ref01_markdef_up0_value

        page_ref01_resdata_up0 = helpers.to_map(runner.entity_data(page_ref01_ent.update(page_ref01_data_up0_up, None)))
        assert page_ref01_resdata_up0 is not None
        assert page_ref01_resdata_up0["id"] == page_ref01_data_up0_up["id"]
        assert page_ref01_resdata_up0[page_ref01_markdef_up0_name] == page_ref01_markdef_up0_value

        # LOAD
        page_ref01_match_dt0 = {
            "id": page_ref01_data["id"],
        }
        page_ref01_data_dt0_loaded = page_ref01_ent.load(page_ref01_match_dt0, None)
        page_ref01_data_dt0_load_result = helpers.to_map(runner.entity_data(page_ref01_data_dt0_loaded))
        assert page_ref01_data_dt0_load_result is not None
        assert page_ref01_data_dt0_load_result["id"] == page_ref01_data["id"]



def _page_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/page/PageTestData.json")
    with open(entity_data_file, "r", encoding="utf-8") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = NotionSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["page01", "page02", "page03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Whether *_ENTID supplied the idmap, read before env_override consumes
    # it: without it, the ids a live flow binds are the fixture's synthetic ones.
    _entid_env_raw = os.environ.get(
        "NOTION_TEST_PAGE_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "NOTION_TEST_PAGE_ENTID": idmap,
        "NOTION_TEST_LIVE": "FALSE",
        "NOTION_TEST_EXPLAIN": "FALSE",
        "NOTION_APIKEY": "",
    })

    idmap_resolved = helpers.to_map(
        env.get("NOTION_TEST_PAGE_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("NOTION_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            # FIRST, so the generated fields below win: sdk-test-control.json's
            # test.client.options adds to the live client, it does not
            # redirect it.
            runner.live_client_options(),
            {
                "apikey": env.get("NOTION_APIKEY"),
            },
            extra or {},
        ])
        client = NotionSDK(helpers.to_map(merged_opts))

    _live = env.get("NOTION_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("NOTION_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
