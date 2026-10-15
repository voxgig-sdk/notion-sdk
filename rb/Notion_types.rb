# frozen_string_literal: true

# Typed models for the Notion SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Database entity data model.
#
# @!attribute [rw] created_time
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] last_edited_time
#   @return [String, nil]
#
# @!attribute [rw] object
#   @return [String, nil]
#
# @!attribute [rw] parent
#   @return [Hash, nil]
#
# @!attribute [rw] properties
#   @return [Hash, nil]
#
# @!attribute [rw] title
#   @return [Array, nil]
Database = Struct.new(
  :created_time,
  :id,
  :last_edited_time,
  :object,
  :parent,
  :properties,
  :title,
  keyword_init: true
)

# Request payload for Database#load.
#
# @!attribute [rw] id
#   @return [String]
DatabaseLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Database#create.
#
# @!attribute [rw] created_time
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] last_edited_time
#   @return [String, nil]
#
# @!attribute [rw] object
#   @return [String, nil]
#
# @!attribute [rw] parent
#   @return [Hash, nil]
#
# @!attribute [rw] properties
#   @return [Hash, nil]
#
# @!attribute [rw] title
#   @return [Array, nil]
DatabaseCreateData = Struct.new(
  :created_time,
  :id,
  :last_edited_time,
  :object,
  :parent,
  :properties,
  :title,
  keyword_init: true
)

# Request payload for Database#update.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] created_time
#   @return [String, nil]
#
# @!attribute [rw] last_edited_time
#   @return [String, nil]
#
# @!attribute [rw] object
#   @return [String, nil]
#
# @!attribute [rw] parent
#   @return [Hash, nil]
#
# @!attribute [rw] properties
#   @return [Hash, nil]
#
# @!attribute [rw] title
#   @return [Array, nil]
DatabaseUpdateData = Struct.new(
  :id,
  :created_time,
  :last_edited_time,
  :object,
  :parent,
  :properties,
  :title,
  keyword_init: true
)

# Page entity data model.
#
# @!attribute [rw] archived
#   @return [Boolean, nil]
#
# @!attribute [rw] created_time
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] last_edited_time
#   @return [String, nil]
#
# @!attribute [rw] object
#   @return [String, nil]
#
# @!attribute [rw] parent
#   @return [Hash, nil]
#
# @!attribute [rw] properties
#   @return [Hash, nil]
Page = Struct.new(
  :archived,
  :created_time,
  :id,
  :last_edited_time,
  :object,
  :parent,
  :properties,
  keyword_init: true
)

# Request payload for Page#load.
#
# @!attribute [rw] id
#   @return [String]
PageLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Page#create.
#
# @!attribute [rw] archived
#   @return [Boolean, nil]
#
# @!attribute [rw] created_time
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] last_edited_time
#   @return [String, nil]
#
# @!attribute [rw] object
#   @return [String, nil]
#
# @!attribute [rw] parent
#   @return [Hash, nil]
#
# @!attribute [rw] properties
#   @return [Hash, nil]
PageCreateData = Struct.new(
  :archived,
  :created_time,
  :id,
  :last_edited_time,
  :object,
  :parent,
  :properties,
  keyword_init: true
)

# Request payload for Page#update.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] archived
#   @return [Boolean, nil]
#
# @!attribute [rw] created_time
#   @return [String, nil]
#
# @!attribute [rw] last_edited_time
#   @return [String, nil]
#
# @!attribute [rw] object
#   @return [String, nil]
#
# @!attribute [rw] parent
#   @return [Hash, nil]
#
# @!attribute [rw] properties
#   @return [Hash, nil]
PageUpdateData = Struct.new(
  :id,
  :archived,
  :created_time,
  :last_edited_time,
  :object,
  :parent,
  :properties,
  keyword_init: true
)

