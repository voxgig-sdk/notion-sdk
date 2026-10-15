# Notion SDK exists test

require "minitest/autorun"
require_relative "../Notion_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = NotionSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
