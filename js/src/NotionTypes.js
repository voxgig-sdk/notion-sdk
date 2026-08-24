// Typed models for the Notion SDK (JSDoc typedefs).
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
// edit by hand.

/**
 * @typedef {Object} Database
 * @property {string} [created_time]
 * @property {string} [id]
 * @property {string} [last_edited_time]
 * @property {string} [object]
 * @property {Object} [parent]
 * @property {Object} [properties]
 * @property {Array} [title]
 */

/**
 * @typedef {Object} DatabaseLoadMatch
 * @property {string} id
 */

/**
 * @typedef {Object} DatabaseCreateData
 * @property {string} [created_time]
 * @property {string} [id]
 * @property {string} [last_edited_time]
 * @property {string} [object]
 * @property {Object} [parent]
 * @property {Object} [properties]
 * @property {Array} [title]
 */

/**
 * @typedef {Object} DatabaseUpdateData
 * @property {string} id
 * @property {string} [created_time]
 * @property {string} [last_edited_time]
 * @property {string} [object]
 * @property {Object} [parent]
 * @property {Object} [properties]
 * @property {Array} [title]
 */

/**
 * @typedef {Object} Page
 * @property {boolean} [archived]
 * @property {string} [created_time]
 * @property {string} [id]
 * @property {string} [last_edited_time]
 * @property {string} [object]
 * @property {Object} [parent]
 * @property {Object} [properties]
 */

/**
 * @typedef {Object} PageLoadMatch
 * @property {string} id
 */

/**
 * @typedef {Object} PageCreateData
 * @property {boolean} [archived]
 * @property {string} [created_time]
 * @property {string} [id]
 * @property {string} [last_edited_time]
 * @property {string} [object]
 * @property {Object} [parent]
 * @property {Object} [properties]
 */

/**
 * @typedef {Object} PageUpdateData
 * @property {string} id
 * @property {boolean} [archived]
 * @property {string} [created_time]
 * @property {string} [last_edited_time]
 * @property {string} [object]
 * @property {Object} [parent]
 * @property {Object} [properties]
 */

