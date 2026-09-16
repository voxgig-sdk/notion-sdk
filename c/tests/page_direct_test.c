// Generated direct-call test for the page entity (mirrors the
// rust TestDirect generator; unit mode uses a mock system.fetch transport).

#include "ctest.h"

#include <stdlib.h>
#include <string.h>

static int CALLS = 0;
static char LAST_URL[1024];

// Mock transport: records the call, returns 200 + the ud response as json.
static voxgig_value* page_mock(void* ud, voxgig_value* args) {
  CALLS++;
  voxgig_value* url = voxgig_getelem(args, v_int(0), NULL);
  if (voxgig_is_string(url)) {
    snprintf(LAST_URL, sizeof(LAST_URL), "%s", voxgig_as_string(url));
  }
  voxgig_value* data = (voxgig_value*)ud;
  return cmap(4,
    "status", v_num(200),
    "statusText", v_str("OK"),
    "headers", v_map(),
    "json", json_thunk(data));
}

static NotionSDK* page_direct_setup(voxgig_value* mockres) {
  voxgig_value* opts = cmap(2,
    "base", v_str("http://localhost:8080"),
    "system", cmap(1, "fetch", vfn(page_mock, mockres)));
  return notion_sdk_new(opts);
}

int main(void) {

  // LOAD
  {
    CALLS = 0;
    voxgig_value* mockres = cmap(1, "id", v_str("direct01"));
    NotionSDK* sdk = page_direct_setup(mockres);
    voxgig_value* params = v_map();
    setp(params, "id", v_str("direct01"));
    PNError* err = NULL;
    voxgig_value* result = sdk_direct(sdk, cmap(3,
      "path", v_str("pages/{id}"),
      "method", v_str("GET"),
      "params", params), &err);
    CHECK(err == NULL, "load: no error");
    voxgig_value* okv = getp(result, "ok");
    CHECK(voxgig_is_bool(okv) && voxgig_as_bool(okv), "load: ok true");
    CHECK_INT_EQ(to_int(getp(result, "status")), 200, "load: status 200");
    voxgig_value* data = getp(result, "data");
    CHECK(!v_is_noval(data), "load: data present");
    if (voxgig_is_map(data)) {
      CHECK_STR_EQ(get_str(data, "id"), "direct01", "load: data.id");
    }
    CHECK_INT_EQ(CALLS, 1, "load: one call");
    CHECK(strstr(LAST_URL, "direct01") != NULL, "load: url has direct01");
  }

  TEST_SUMMARY("notion_page_direct");
}
