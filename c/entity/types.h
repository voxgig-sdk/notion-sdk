// Typed models for the Notion SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types are mapped
// from the canonical type sentinels. Do not edit by hand.
//
// These are DOCUMENTARY: the SDK runtime is dynamic (ops take/return
// `voxgig_value*`), so nothing consumes these structs yet — they mirror the
// entity/op shapes for reference and IDE support. This header is standalone
// and is not #included by any generated .c.

#ifndef NOTION_ENTITY_TYPES_H
#define NOTION_ENTITY_TYPES_H

#include "sdk.h"

// Database is the typed data model for the database entity.
typedef struct {
  char*created_time;  // optional
  char*id;  // optional
  char*last_edited_time;  // optional
  char*object;  // optional
  voxgig_value*parent;  // optional
  voxgig_value*properties;  // optional
  voxgig_value*title;  // optional
} Database;

// DatabaseLoadMatch is the typed request payload for Database.load.
typedef struct {
  char*id;
} DatabaseLoadMatch;

// DatabaseCreateData is the typed request payload for Database.create.
typedef struct {
  char*created_time;  // optional
  char*id;  // optional
  char*last_edited_time;  // optional
  char*object;  // optional
  voxgig_value*parent;  // optional
  voxgig_value*properties;  // optional
  voxgig_value*title;  // optional
} DatabaseCreateData;

// DatabaseUpdateData is the typed request payload for Database.update.
typedef struct {
  char*id;
  char*created_time;  // optional
  char*last_edited_time;  // optional
  char*object;  // optional
  voxgig_value*parent;  // optional
  voxgig_value*properties;  // optional
  voxgig_value*title;  // optional
} DatabaseUpdateData;

// Page is the typed data model for the page entity.
typedef struct {
  bool archived;  // optional
  char*created_time;  // optional
  char*id;  // optional
  char*last_edited_time;  // optional
  char*object;  // optional
  voxgig_value*parent;  // optional
  voxgig_value*properties;  // optional
} Page;

// PageLoadMatch is the typed request payload for Page.load.
typedef struct {
  char*id;
} PageLoadMatch;

// PageCreateData is the typed request payload for Page.create.
typedef struct {
  bool archived;  // optional
  char*created_time;  // optional
  char*id;  // optional
  char*last_edited_time;  // optional
  char*object;  // optional
  voxgig_value*parent;  // optional
  voxgig_value*properties;  // optional
} PageCreateData;

// PageUpdateData is the typed request payload for Page.update.
typedef struct {
  char*id;
  bool archived;  // optional
  char*created_time;  // optional
  char*last_edited_time;  // optional
  char*object;  // optional
  voxgig_value*parent;  // optional
  voxgig_value*properties;  // optional
} PageUpdateData;

#endif // NOTION_ENTITY_TYPES_H
