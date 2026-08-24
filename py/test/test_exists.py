# Notion SDK exists test

import pytest
from notion_sdk import NotionSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = NotionSDK.test(None, None)
        assert testsdk is not None
