# Notion SDK feature factory

from notion_sdk.feature.base_feature import NotionBaseFeature
from notion_sdk.feature.debug_feature import NotionDebugFeature
from notion_sdk.feature.idempotency_feature import NotionIdempotencyFeature
from notion_sdk.feature.metrics_feature import NotionMetricsFeature
from notion_sdk.feature.paging_feature import NotionPagingFeature
from notion_sdk.feature.ratelimit_feature import NotionRatelimitFeature
from notion_sdk.feature.retry_feature import NotionRetryFeature
from notion_sdk.feature.test_feature import NotionTestFeature
from notion_sdk.feature.timeout_feature import NotionTimeoutFeature


_FEATURES = {
    "base": lambda: NotionBaseFeature(),
    "debug": lambda: NotionDebugFeature(),
    "idempotency": lambda: NotionIdempotencyFeature(),
    "metrics": lambda: NotionMetricsFeature(),
    "paging": lambda: NotionPagingFeature(),
    "ratelimit": lambda: NotionRatelimitFeature(),
    "retry": lambda: NotionRetryFeature(),
    "test": lambda: NotionTestFeature(),
    "timeout": lambda: NotionTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
