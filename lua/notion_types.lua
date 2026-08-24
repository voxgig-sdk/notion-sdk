-- Typed models for the Notion SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Database
---@field created_time? string
---@field id? string
---@field last_edited_time? string
---@field object? string
---@field parent? table
---@field properties? table
---@field title? table

---@class DatabaseLoadMatch
---@field id string

---@class DatabaseCreateData
---@field created_time? string
---@field id? string
---@field last_edited_time? string
---@field object? string
---@field parent? table
---@field properties? table
---@field title? table

---@class DatabaseUpdateData
---@field id string
---@field created_time? string
---@field last_edited_time? string
---@field object? string
---@field parent? table
---@field properties? table
---@field title? table

---@class Page
---@field archived? boolean
---@field created_time? string
---@field id? string
---@field last_edited_time? string
---@field object? string
---@field parent? table
---@field properties? table

---@class PageLoadMatch
---@field id string

---@class PageCreateData
---@field archived? boolean
---@field created_time? string
---@field id? string
---@field last_edited_time? string
---@field object? string
---@field parent? table
---@field properties? table

---@class PageUpdateData
---@field id string
---@field archived? boolean
---@field created_time? string
---@field last_edited_time? string
---@field object? string
---@field parent? table
---@field properties? table

local M = {}

return M
