const { describe, test } = require('node:test')
const { SDK } = require('..')
const { runDefinitionPoint } = require('./definition-runner')
const { isControlSkipped } = require('./utility')


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
  {
    "entity": "database",
    "accessor": "Database",
    "op": "create",
    "method": "POST",
    "path": "/databases",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "object": "x",
      "created_time": "x",
      "last_edited_time": "x",
      "title": [
        {}
      ],
      "properties": {},
      "parent": {
        "page_id": "x"
      }
    },
    "idField": "id"
  },
  {
    "entity": "database",
    "accessor": "Database",
    "op": "load",
    "method": "GET",
    "path": "/databases/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "object": "x",
      "created_time": "x",
      "last_edited_time": "x",
      "title": [
        {}
      ],
      "properties": {},
      "parent": {
        "page_id": "x"
      }
    },
    "idField": "id"
  },
  {
    "entity": "database",
    "accessor": "Database",
    "op": "update",
    "method": "PATCH",
    "path": "/databases/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "object": "x",
      "created_time": "x",
      "last_edited_time": "x",
      "title": [
        {}
      ],
      "properties": {},
      "parent": {
        "page_id": "x"
      }
    },
    "idField": "id"
  },
  {
    "entity": "page",
    "accessor": "Page",
    "op": "create",
    "method": "POST",
    "path": "/pages",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "object": "x",
      "created_time": "x",
      "last_edited_time": "x",
      "archived": true,
      "properties": {},
      "parent": {
        "database_id": "x"
      }
    },
    "idField": "id"
  },
  {
    "entity": "page",
    "accessor": "Page",
    "op": "load",
    "method": "GET",
    "path": "/pages/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "object": "x",
      "created_time": "x",
      "last_edited_time": "x",
      "archived": true,
      "properties": {},
      "parent": {
        "database_id": "x"
      }
    },
    "idField": "id"
  },
  {
    "entity": "page",
    "accessor": "Page",
    "op": "update",
    "method": "PATCH",
    "path": "/pages/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "id": "x",
      "object": "x",
      "created_time": "x",
      "last_edited_time": "x",
      "archived": true,
      "properties": {},
      "parent": {
        "database_id": "x"
      }
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
