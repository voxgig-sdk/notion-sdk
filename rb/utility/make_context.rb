# Notion SDK utility: make_context
require_relative '../core/context'
module NotionUtilities
  MakeContext = ->(ctxmap, basectx) {
    NotionContext.new(ctxmap, basectx)
  }
end
