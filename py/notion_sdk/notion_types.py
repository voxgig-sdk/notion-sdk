# Typed models for the Notion SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Database(TypedDict, total=False):
    created_time: str
    id: str
    last_edited_time: str
    object: str
    parent: dict
    properties: dict
    title: list


class DatabaseLoadMatch(TypedDict):
    id: str


class DatabaseCreateData(TypedDict, total=False):
    created_time: str
    id: str
    last_edited_time: str
    object: str
    parent: dict
    properties: dict
    title: list


class DatabaseUpdateDataRequired(TypedDict):
    id: str


class DatabaseUpdateData(DatabaseUpdateDataRequired, total=False):
    created_time: str
    last_edited_time: str
    object: str
    parent: dict
    properties: dict
    title: list


class Page(TypedDict, total=False):
    archived: bool
    created_time: str
    id: str
    last_edited_time: str
    object: str
    parent: dict
    properties: dict


class PageLoadMatch(TypedDict):
    id: str


class PageCreateData(TypedDict, total=False):
    archived: bool
    created_time: str
    id: str
    last_edited_time: str
    object: str
    parent: dict
    properties: dict


class PageUpdateDataRequired(TypedDict):
    id: str


class PageUpdateData(PageUpdateDataRequired, total=False):
    archived: bool
    created_time: str
    last_edited_time: str
    object: str
    parent: dict
    properties: dict
