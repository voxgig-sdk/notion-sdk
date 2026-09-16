// Generated instance test for the database entity.

#include "ctest.h"

int main(void) {
  NotionSDK* sdk = test_sdk(NULL, NULL);
  CHECK(sdk != NULL, "sdk constructed");

  Entity* e = notion_database(sdk, NULL);
  CHECK(e != NULL, "entity instance");
  CHECK_STR_EQ(e->vt->get_name(e), "database", "entity get_name");

  TEST_SUMMARY("database_entity");
}
