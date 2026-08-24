# Notion SDK utility: make_context

from notion_sdk.core.context import NotionContext


def make_context_util(ctxmap, basectx):
    return NotionContext(ctxmap, basectx)
