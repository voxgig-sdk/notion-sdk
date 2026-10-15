# Notion SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/debug_feature'
require_relative 'feature/idempotency_feature'
require_relative 'feature/metrics_feature'
require_relative 'feature/paging_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/station_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module NotionFeatures
  def self.make_feature(name)
    case name
    when "base"
      NotionBaseFeature.new
    when "debug"
      NotionDebugFeature.new
    when "idempotency"
      NotionIdempotencyFeature.new
    when "metrics"
      NotionMetricsFeature.new
    when "paging"
      NotionPagingFeature.new
    when "ratelimit"
      NotionRatelimitFeature.new
    when "retry"
      NotionRetryFeature.new
    when "station"
      NotionStationFeature.new
    when "test"
      NotionTestFeature.new
    when "timeout"
      NotionTimeoutFeature.new
    else
      NotionBaseFeature.new
    end
  end
end
