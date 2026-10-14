# Notion SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

NotionUtility.registrar = ->(u) {
  u.clean = NotionUtilities::Clean
  u.clean_add = NotionUtilities::CleanAdd
  u.clean_explain = NotionUtilities::CleanExplain
  u.done = NotionUtilities::Done
  u.make_error = NotionUtilities::MakeError
  u.feature_add = NotionUtilities::FeatureAdd
  u.feature_hook = NotionUtilities::FeatureHook
  u.feature_init = NotionUtilities::FeatureInit
  u.fetcher = NotionUtilities::Fetcher
  u.make_fetch_def = NotionUtilities::MakeFetchDef
  u.make_context = NotionUtilities::MakeContext
  u.make_options = NotionUtilities::MakeOptions
  u.make_request = NotionUtilities::MakeRequest
  u.make_response = NotionUtilities::MakeResponse
  u.make_result = NotionUtilities::MakeResult
  u.make_point = NotionUtilities::MakePoint
  u.make_spec = NotionUtilities::MakeSpec
  u.make_url = NotionUtilities::MakeUrl
  u.param = NotionUtilities::Param
  u.prepare_auth = NotionUtilities::PrepareAuth
  u.prepare_body = NotionUtilities::PrepareBody
  u.prepare_headers = NotionUtilities::PrepareHeaders
  u.prepare_method = NotionUtilities::PrepareMethod
  u.prepare_params = NotionUtilities::PrepareParams
  u.prepare_path = NotionUtilities::PreparePath
  u.prepare_query = NotionUtilities::PrepareQuery
  u.graphql_body = NotionUtilities::GraphqlBody
  u.graphql_errors = NotionUtilities::GraphqlErrors
  u.result_basic = NotionUtilities::ResultBasic
  u.result_body = NotionUtilities::ResultBody
  u.result_headers = NotionUtilities::ResultHeaders
  u.transform_request = NotionUtilities::TransformRequest
  u.transform_response = NotionUtilities::TransformResponse
}
