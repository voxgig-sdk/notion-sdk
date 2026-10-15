# Notion SDK utility: prepare_body
require_relative 'media'
module NotionUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return NotionUtilities.raw_body(ctx.reqdata) if NotionUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
