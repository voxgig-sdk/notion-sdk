// Notion SDK public API (generated).

#ifndef NOTION_API_H
#define NOTION_API_H

#include "sdk.h"

// Database entity.
Entity* database_entity_new(NotionSDK* client, voxgig_value* entopts);
Entity* notion_database(NotionSDK* client, voxgig_value* entopts);
voxgig_value* database_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);
// Page entity.
Entity* page_entity_new(NotionSDK* client, voxgig_value* entopts);
Entity* notion_page(NotionSDK* client, voxgig_value* entopts);
voxgig_value* page_stream(Entity* e, const char* action, voxgig_value* args, voxgig_value* callopts, PNError** err);

#endif // NOTION_API_H
