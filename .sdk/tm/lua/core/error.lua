-- Notion SDK error

local NotionError = {}
NotionError.__index = NotionError


function NotionError.new(code, msg, ctx)
  local self = setmetatable({}, NotionError)
  self.is_sdk_error = true
  self.sdk = "Notion"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function NotionError:error()
  return self.msg
end


function NotionError:__tostring()
  return self.msg
end


return NotionError
