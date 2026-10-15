-- Notion SDK error

local json = require("dkjson")

local NotionError = {}
NotionError.__index = NotionError

-- Reachable for a debugger, absent from the table itself: the context holds
-- the live spec and options, and an error is what gets dumped or encoded.
local CONTEXT = setmetatable({}, { __mode = "k" })


function NotionError.new(code, msg, ctx)
  local self = setmetatable({}, NotionError)
  self.is_sdk_error = true
  self.sdk = "Notion"
  self.code = code or ""
  self.msg = msg or ""
  self.result = nil
  self.spec = nil
  CONTEXT[self] = ctx
  return self
end


function NotionError:context()
  return CONTEXT[self]
end


function NotionError:error()
  return self.msg
end


-- What make_error attached is already cleaned; the context is not part of
-- the record.
function NotionError:to_table()
  return {
    sdk = self.sdk,
    code = self.code,
    msg = self.msg,
    status = self.status,
    result = self.result,
    spec = self.spec,
  }
end


function NotionError:to_json()
  return json.encode(self:to_table())
end


function NotionError:__tostring()
  return self.msg
end


function NotionError.__tojson(self)
  return self:to_json()
end


return NotionError
