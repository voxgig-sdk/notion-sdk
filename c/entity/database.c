// Database entity client (generated — mirrors the rust Entity fragment).

#include "api.h"

#include <stdlib.h>
#include <string.h>

typedef struct database_entity {
  Entity base;            // vtable pointer (first member)
  char* name;
  NotionSDK* client;
  Utility* utility;
  voxgig_value* entopts;
  voxgig_value* data;     // Map
  voxgig_value* mtch;     // Map
  Context* entctx;
  // Set once a successful `remove` resolves on this instance.
  bool deleted;
} database_entity;

typedef void (*database_postdone_fn)(database_entity* self, Context* ctx);

// Forward declarations.
static const EntityVT database_VT;
static const char* database_get_name(Entity* e);
static Entity* database_make(Entity* e);
static voxgig_value* database_data(Entity* e, voxgig_value* args);
static voxgig_value* database_matchv(Entity* e, voxgig_value* args);
// Ops resolve to the ENTITY (`list` to a NULL-terminated array of them).
static Entity* database_load(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err);
static Entity** database_list(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err);
static Entity* database_create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err);
static Entity* database_update(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err);
static Entity* database_patch(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err);
static Entity* database_remove(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err);
static void database_mark_deleted(Entity* e);
static bool database_deleted(Entity* e);

static Context* database_ent_ctx(database_entity* self) {
  return self->entctx;
}

Entity* database_entity_new(NotionSDK* client, voxgig_value* entopts) {
  entopts = voxgig_is_map(entopts) ? entopts : voxgig_new_map();

  bool act;
  if (!get_bool(entopts, "active", &act)) {
    setp(entopts, "active", v_bool(true));
  } else if (act != false) {
    setp(entopts, "active", v_bool(true));
  }

  database_entity* self = (database_entity*)calloc(1, sizeof(database_entity));
  self->base.vt = &database_VT;
  self->name = strdup("database");
  self->client = client;
  self->utility = sdk_get_utility(client);
  self->entopts = entopts;
  self->data = voxgig_new_map();
  self->mtch = voxgig_new_map();
  self->entctx = NULL;

  CtxSpec cs;
  memset(&cs, 0, sizeof(cs));
  cs.entity = (Entity*)self;
  cs.entopts = entopts;
  Context* entctx = make_context_util(cs, sdk_get_root_ctx(client));

  feature_hook_util(entctx, "PostConstructEntity");

  self->entctx = entctx;
  return (Entity*)self;
}

// Pipeline: make_point -> make_spec -> make_request -> make_response ->
// make_result -> post_done -> done. Feature hooks fire between stages.
static voxgig_value* database_run_op(database_entity* self, Context* ctx,
                                    database_postdone_fn post_done, PNError** err) {
  Utility* utility = self->utility;
  (void)utility;
  PNError* e = NULL;

  feature_hook_util(ctx, "PrePoint");
  voxgig_value* point = make_point_util(ctx, &e);
  if (e) return make_error_util(ctx, e, err);
  ctx_out_set_point_val(ctx, point);

  feature_hook_util(ctx, "PreSpec");
  Spec* spec = make_spec_util(ctx, &e);
  if (e) return make_error_util(ctx, e, err);
  ctx->out_spec = spec;

  feature_hook_util(ctx, "PreRequest");
  Response* resp = make_request_util(ctx, &e);
  if (e) return make_error_util(ctx, e, err);
  ctx->out_request = resp;

  feature_hook_util(ctx, "PreResponse");
  Response* resp2 = make_response_util(ctx, &e);
  if (e) return make_error_util(ctx, e, err);
  ctx->out_response = resp2;

  feature_hook_util(ctx, "PreResult");
  SdkResult* result = make_result_util(ctx, &e);
  if (e) return make_error_util(ctx, e, err);
  ctx->out_result = result;

  feature_hook_util(ctx, "PreDone");
  post_done(self, ctx);

  return done_util(ctx, err);
}

// The items of what done or make_error hands back: NULL with *err set, or
// under `throw: false` the data there is, as a List.
static voxgig_value* database_stream_items(voxgig_value* data, PNError** err) {
  if (*err) return NULL;
  voxgig_value* out = voxgig_new_list();
  if (voxgig_is_list(data)) {
    voxgig_list* l = voxgig_as_list(data);
    for (size_t i = 0; i < l->len; i++) {
      voxgig_list_push(voxgig_as_list(out), voxgig_retain(l->items[i]));
    }
  } else if (data && !v_is_noval(data) && !v_is_null(data)) {
    voxgig_list_push(voxgig_as_list(out), voxgig_retain(data));
  }
  return out;
}

// Streaming operation. Runs `action` through the full pipeline and returns a
// List of the result items, so the `streaming` feature's incremental output
// is reachable from a generated entity (a normal op call materialises the
// whole result). This runtime is synchronous and C has no lazy iterators, so
// the returned value is a List cursor the caller walks (voxgig_as_list).
// `callopts` parameterises the call:
//   - inbound (download): the items/chunks the streaming feature produces when
//     active, else the materialised items;
//   - outbound (upload): a `body` in `callopts` is attached to the request
//     (reqdata `body$`) so the transport can stream a payload;
//   - `ctrl` (pipeline control) threads pipeline options.
voxgig_value* database_stream(Entity* e, const char* action, voxgig_value* args,
                             voxgig_value* callopts, PNError** err) {
  database_entity* self = (database_entity*)e;
  *err = NULL;

  voxgig_value* stream_opts = voxgig_is_map(callopts) ? callopts : voxgig_new_map();

  // A copy: the caller's ctrl gains no key, and explain stays its own record.
  voxgig_value* ctrl = voxgig_new_map();
  voxgig_value* given = to_map(getp(stream_opts, "ctrl"));
  if (voxgig_is_map(given)) {
    voxgig_map* gm = voxgig_as_map(given);
    for (size_t i = 0; i < gm->len; i++) {
      setp(ctrl, gm->entries[i].key, voxgig_retain(gm->entries[i].value));
    }
  }
  setp(ctrl, "stream", v_share(stream_opts));

  voxgig_value* reqmatch = to_map(args);
  if (!voxgig_is_map(reqmatch)) reqmatch = voxgig_new_map();

  CtxSpec cs;
  memset(&cs, 0, sizeof(cs));
  cs.opname = action;
  cs.ctrl = ctrl;
  cs.mtch = self->mtch;
  cs.data = self->data;
  cs.reqmatch = reqmatch;
  Context* ctx = make_context_util(cs, database_ent_ctx(self));

  // Outbound: attach a caller `body` so the transport can stream a payload.
  voxgig_value* body = getp(stream_opts, "body");
  if (!v_is_noval(body) && !v_is_null(body)) {
    voxgig_value* reqdata = voxgig_is_map(ctx->reqdata) ? ctx->reqdata : voxgig_new_map();
    setp(reqdata, "body$", v_share(body));
    ctx->reqdata = reqdata;
  }

  PNError* pe = NULL;

  feature_hook_util(ctx, "PrePoint");
  voxgig_value* point = make_point_util(ctx, &pe);
  if (pe) return database_stream_items(make_error_util(ctx, pe, err), err);
  ctx_out_set_point_val(ctx, point);

  feature_hook_util(ctx, "PreSpec");
  Spec* spec = make_spec_util(ctx, &pe);
  if (pe) return database_stream_items(make_error_util(ctx, pe, err), err);
  ctx->out_spec = spec;

  feature_hook_util(ctx, "PreRequest");
  Response* resp = make_request_util(ctx, &pe);
  if (pe) return database_stream_items(make_error_util(ctx, pe, err), err);
  ctx->out_request = resp;

  feature_hook_util(ctx, "PreResponse");
  Response* resp2 = make_response_util(ctx, &pe);
  if (pe) return database_stream_items(make_error_util(ctx, pe, err), err);
  ctx->out_response = resp2;

  feature_hook_util(ctx, "PreResult");
  SdkResult* result = make_result_util(ctx, &pe);
  if (pe) return database_stream_items(make_error_util(ctx, pe, err), err);
  ctx->out_result = result;

  feature_hook_util(ctx, "PreDone");

  // Inbound: prefer the streaming feature's incremental producer; else fall
  // back to the materialised items so `stream` always yields.
  SdkResult* res = ctx->result;
  if (res && res->stream) {
    // done() does not run on this path, so its record is cleaned here.
    clean_explain_util(ctx);
    return res->stream(res->stream_ud);
  }

  return database_stream_items(done_util(ctx, err), err);
}

static const char* database_get_name(Entity* e) {
  return ((database_entity*)e)->name;
}

static Entity* database_make(Entity* e) {
  database_entity* self = (database_entity*)e;
  voxgig_value* opts = voxgig_new_map();
  if (voxgig_is_map(self->entopts)) {
    voxgig_map* m = voxgig_as_map(self->entopts);
    for (size_t i = 0; i < m->len; i++) {
      setp(opts, m->entries[i].key, voxgig_retain(m->entries[i].value));
    }
  }
  return database_entity_new(self->client, opts);
}

static voxgig_value* database_data(Entity* e, voxgig_value* args) {
  database_entity* self = (database_entity*)e;
  if (args && !v_is_noval(args) && !v_is_null(args)) {
    voxgig_value* cloned = to_map(voxgig_clone(args));
    self->data = voxgig_is_map(cloned) ? cloned : voxgig_new_map();
    feature_hook_util(database_ent_ctx(self), "SetData");
  }
  feature_hook_util(database_ent_ctx(self), "GetData");
  return voxgig_clone(self->data);
}

static voxgig_value* database_matchv(Entity* e, voxgig_value* args) {
  database_entity* self = (database_entity*)e;
  if (args && !v_is_noval(args) && !v_is_null(args)) {
    voxgig_value* cloned = to_map(voxgig_clone(args));
    self->mtch = voxgig_is_map(cloned) ? cloned : voxgig_new_map();
    feature_hook_util(database_ent_ctx(self), "SetMatch");
  }
  feature_hook_util(database_ent_ctx(self), "GetMatch");
  return voxgig_clone(self->mtch);
}


static void database_load_postdone(database_entity* self, Context* ctx) {
  SdkResult* result = ctx->result;
  if (result) {
    voxgig_value* resmatch = result->resmatch;
    voxgig_value* resdata = result->resdata;
    if (voxgig_is_map(resmatch)) self->mtch = resmatch;
    if (!v_is_noval(resdata) && !v_is_null(resdata)) {
      voxgig_value* m = to_map(voxgig_clone(resdata));
      self->data = voxgig_is_map(m) ? m : voxgig_new_map();
    }
  }
}

static Entity* database_load(Entity* e, voxgig_value* reqmatch, voxgig_value* ctrl, PNError** err) {
  database_entity* self = (database_entity*)e;
  CtxSpec cs;
  memset(&cs, 0, sizeof(cs));
  cs.opname = "load";
  cs.ctrl = ctrl;
  cs.mtch = self->mtch;
  cs.data = self->data;
  cs.reqmatch = reqmatch;
  Context* ctx = make_context_util(cs, database_ent_ctx(self));
  database_run_op(self, ctx, database_load_postdone, err);
  if (*err) return NULL;

  // The operation resolves to THIS entity: run_op has just absorbed the
  // result into it, and the caller reaches the record through vt->data.
  // See AGENTS.md "Entity operations return ENTITIES".

  return e;
}


static Entity** database_list(Entity* e, voxgig_value* reqarg, voxgig_value* ctrl, PNError** err) {
  (void)e; (void)reqarg; (void)ctrl;
  *err = unsupported_op("list", "database");
  return NULL;
}


static void database_create_postdone(database_entity* self, Context* ctx) {
  SdkResult* result = ctx->result;
  if (result) {
    voxgig_value* resdata = result->resdata;
    if (!v_is_noval(resdata) && !v_is_null(resdata)) {
      voxgig_value* m = to_map(voxgig_clone(resdata));
      self->data = voxgig_is_map(m) ? m : voxgig_new_map();
    }
  }
}

static Entity* database_create(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err) {
  database_entity* self = (database_entity*)e;
  CtxSpec cs;
  memset(&cs, 0, sizeof(cs));
  cs.opname = "create";
  cs.ctrl = ctrl;
  cs.mtch = self->mtch;
  cs.data = self->data;
  cs.reqdata = reqdata;
  Context* ctx = make_context_util(cs, database_ent_ctx(self));
  database_run_op(self, ctx, database_create_postdone, err);
  if (*err) return NULL;

  // The operation resolves to THIS entity: run_op has just absorbed the
  // result into it, and the caller reaches the record through vt->data.
  // See AGENTS.md "Entity operations return ENTITIES".

  return e;
}



static void database_update_postdone(database_entity* self, Context* ctx) {
  SdkResult* result = ctx->result;
  if (result) {
    voxgig_value* resmatch = result->resmatch;
    voxgig_value* resdata = result->resdata;
    if (voxgig_is_map(resmatch)) self->mtch = resmatch;
    if (!v_is_noval(resdata) && !v_is_null(resdata)) {
      voxgig_value* m = to_map(voxgig_clone(resdata));
      self->data = voxgig_is_map(m) ? m : voxgig_new_map();
    }
  }
}

static Entity* database_update(Entity* e, voxgig_value* reqdata, voxgig_value* ctrl, PNError** err) {
  database_entity* self = (database_entity*)e;
  CtxSpec cs;
  memset(&cs, 0, sizeof(cs));
  cs.opname = "update";
  cs.ctrl = ctrl;
  cs.mtch = self->mtch;
  cs.data = self->data;
  cs.reqdata = reqdata;
  Context* ctx = make_context_util(cs, database_ent_ctx(self));
  database_run_op(self, ctx, database_update_postdone, err);
  if (*err) return NULL;

  // The operation resolves to THIS entity: run_op has just absorbed the
  // result into it, and the caller reaches the record through vt->data.
  // See AGENTS.md "Entity operations return ENTITIES".

  return e;
}


static Entity* database_patch(Entity* e, voxgig_value* reqarg, voxgig_value* ctrl, PNError** err) {
  (void)e; (void)reqarg; (void)ctrl;
  *err = unsupported_op("patch", "database");
  return NULL;
}

static Entity* database_remove(Entity* e, voxgig_value* reqarg, voxgig_value* ctrl, PNError** err) {
  (void)e; (void)reqarg; (void)ctrl;
  *err = unsupported_op("remove", "database");
  return NULL;
}

// `remove` resolves to the entity, marked. The instance KEEPS the data it
// held - a caller can still read what was deleted - but it is no longer a
// live record.
static void database_mark_deleted(Entity* e) {
  ((database_entity*)e)->deleted = true;
}

static bool database_deleted(Entity* e) {
  return ((database_entity*)e)->deleted;
}

static const EntityVT database_VT = {
  database_get_name,
  database_make,
  database_data,
  database_matchv,
  database_mark_deleted,
  database_deleted,
  database_load,
  database_list,
  database_create,
  database_update,
  database_patch,
  database_remove,
};
