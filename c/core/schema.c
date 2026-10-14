// Notion SDK: generated schemas. Do not edit.
//
// Built from the model: `main.kit.optspec` and each feature's
// `config.options` for the option spec; entity `fields{}.type` for the
// entity specs.

#include "api.h"

static const char OPTSPEC_DATA[] =
  "{\"allow\":{\"method\":\"GET,PUT,POST,PATCH,DELETE,OPTIONS\",\"op\":\"create,update,patch,load,list,remove,command,direct,graphql\"},\"apikey\":\"\",\"auth\":{\"basic\":false,\"in\":\"\",\"name\":\"\",\"prefix\":\"\"},\"base\":\"http://localhost:8000\",\"clean\":{\"active\":true,\"hint\":\"0\",\"keys\":\"key,secret,token,password,passwd,authorization,cookie,credential,signature\",\"mask\":\"[redacted]\",\"min\":\"4\",\"values\":\"\"},\"entity\":{\"`$CHILD`\":{\"`$OPEN`\":true,\"active\":false,\"alias\":{}}},\"extend\":\"`$ANY`\",\"headers\":{\"`$CHILD`\":\"`$STRING`\"},\"prefix\":\"\",\"secret\":\"\",\"server\":{\"`$CHILD`\":\"\"},\"suffix\":\"\",\"system\":{\"fetch\":\"`$ANY`\"},\"test\":{\"active\":false,\"entity\":{\"`$OPEN`\":true}},\"utility\":{},\"feature\":{\"`$CHILD`\":{\"`$OPEN`\":true,\"active\":false},\"debug\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"max\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"redact\":[\"`$ONE`\",\"`$LIST`\",\"`$NIL`\"],\"now\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"],\"onEntry\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"]},\"`$NIL`\"],\"idempotency\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"header\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"methods\":[\"`$ONE`\",\"`$LIST`\",\"`$NIL`\"],\"ops\":[\"`$ONE`\",\"`$LIST`\",\"`$NIL`\"],\"keygen\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"]},\"`$NIL`\"],\"metrics\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"now\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"]},\"`$NIL`\"],\"paging\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"afterVar\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"cursorParam\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"firstVar\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"limitParam\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"pageParam\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"startPage\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"limit\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"ops\":[\"`$ONE`\",\"`$LIST`\",\"`$NIL`\"]},\"`$NIL`\"],\"ratelimit\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"burst\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"rate\":[\"`$ONE`\",\"`$N"
  "UMBER`\",\"`$NIL`\"],\"now\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"],\"sleep\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"]},\"`$NIL`\"],\"retry\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"factor\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"maxDelay\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"minDelay\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"retries\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"statuses\":[\"`$ONE`\",\"`$LIST`\",\"`$NIL`\"],\"jitter\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"sleep\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"]},\"`$NIL`\"],\"station\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"capture\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"fromEnv\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"instance\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"profile\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"register\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"secret\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"],\"url\":[\"`$ONE`\",\"`$STRING`\",[\"`$EXACT`\",\"\"],\"`$NIL`\"]},\"`$NIL`\"],\"test\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"entity\":[\"`$ONE`\",\"`$MAP`\",\"`$NIL`\"],\"net\":[\"`$ONE`\",\"`$MAP`\",\"`$NIL`\"]},\"`$NIL`\"],\"timeout\":[\"`$ONE`\",{\"`$OPEN`\":true,\"active\":[\"`$ONE`\",\"`$BOOLEAN`\",\"`$NIL`\"],\"ms\":[\"`$ONE`\",\"`$NUMBER`\",\"`$NIL`\"],\"clearTimer\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"],\"now\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"],\"setTimer\":[\"`$ONE`\",\"`$FUNCTION`\",\"`$NIL`\"]},\"`$NIL`\"]}}";

static const char ENTITYSPEC_DATA[] =
  "{}";

voxgig_value* make_optspec(void) {
  return json_parse(OPTSPEC_DATA);
}

voxgig_value* make_entityspec(void) {
  return json_parse(ENTITYSPEC_DATA);
}

// SHARED SPECS, the shape shared_config uses and for the same reasons: the
// spec is read on every client construction and never mutated, so a per-call
// parse would be pure waste. Deliberately never freed: they live for the life
// of the process, like any other program-lifetime singleton.
//
// The returned values are SHARED: treat them as read-only. make_options
// validates AGAINST the spec and writes into the options, never into the spec.
static voxgig_value* shared_optspec_val = NULL;
static voxgig_value* shared_entityspec_val = NULL;

voxgig_value* shared_optspec(void) {
  if (NULL == shared_optspec_val) {
    shared_optspec_val = make_optspec();
  }
  return shared_optspec_val;
}

voxgig_value* shared_entityspec(void) {
  if (NULL == shared_entityspec_val) {
    shared_entityspec_val = make_entityspec();
  }
  return shared_entityspec_val;
}
