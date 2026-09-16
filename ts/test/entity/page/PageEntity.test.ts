

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { NotionSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
loadEnvLocal(__dirname + '/../../../.env.local')


describe('PageEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NOTION_TEST_LIVE=TRUE.
  afterEach(liveDelay('NOTION_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NotionSDK.test()
    const ent = testsdk.Page()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.NOTION_TEST_LIVE
    for (const op of ['create', 'update', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'page.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"archived","req":false,"type":"`$BOOLEAN`","index$":0},{"active":true,"name":"created_time","req":false,"type":"`$STRING`","index$":1},{"active":true,"name":"id","req":false,"type":"`$STRING`","index$":2},{"active":true,"name":"last_edited_time","req":false,"type":"`$STRING`","index$":3},{"active":true,"name":"object","req":false,"type":"`$STRING`","index$":4},{"active":true,"name":"parent","op":{"create":{"req":true,"type":"`$OBJECT`"}},"req":false,"type":"`$OBJECT`","index$":5},{"active":true,"name":"properties","op":{"create":{"req":true,"type":"`$OBJECT`"}},"req":false,"type":"`$OBJECT`","index$":6}],"id":{"field":"id","name":"id"},"name":"page","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{},"contract":{"id":"POST /pages","json":"{\"operationId\":\"createPage\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"parent\":{\"properties\":{\"database_id\":{\"type\":\"string\"}},\"type\":\"object\"},\"properties\":{\"type\":\"object\"}},\"required\":[\"parent\",\"properties\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"archived\":{\"type\":\"boolean\"},\"created_time\":{\"type\":\"string\"},\"id\":{\"type\":\"string\"},\"last_edited_time\":{\"type\":\"string\"},\"object\":{\"type\":\"string\"},\"parent\":{\"properties\":{\"database_id\":{\"type\":\"string\"}},\"type\":\"object\"},\"properties\":{\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"The created page\"}},\"security\":[{\"bearerAuth\":[]}],\"securitySchemes\":{\"bearerAuth\":{\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/pages","segments":[{"lit":"pages"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"id","orig":"id","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"GET /pages/{id}","json":"{\"operationId\":\"getPage\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"archived\":{\"type\":\"boolean\"},\"created_time\":{\"type\":\"string\"},\"id\":{\"type\":\"string\"},\"last_edited_time\":{\"type\":\"string\"},\"object\":{\"type\":\"string\"},\"parent\":{\"properties\":{\"database_id\":{\"type\":\"string\"}},\"type\":\"object\"},\"properties\":{\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"The requested page\"}},\"security\":[{\"bearerAuth\":[]}],\"securitySchemes\":{\"bearerAuth\":{\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/pages/{id}","segments":[{"lit":"pages"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"update":{"input":"data","name":"update","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"id","orig":"id","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"PATCH /pages/{id}","json":"{\"operationId\":\"updatePage\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"archived\":{\"type\":\"boolean\"},\"properties\":{\"type\":\"object\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"archived\":{\"type\":\"boolean\"},\"created_time\":{\"type\":\"string\"},\"id\":{\"type\":\"string\"},\"last_edited_time\":{\"type\":\"string\"},\"object\":{\"type\":\"string\"},\"parent\":{\"properties\":{\"database_id\":{\"type\":\"string\"}},\"type\":\"object\"},\"properties\":{\"type\":\"object\"}},\"type\":\"object\"}}},\"description\":\"The updated page\"}},\"security\":[{\"bearerAuth\":[]}],\"securitySchemes\":{\"bearerAuth\":{\"scheme\":\"bearer\",\"type\":\"http\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"PATCH","orig":"/pages/{id}","segments":[{"lit":"pages"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"page","name__orig":"page","Name":"Page","name_":"page","name-":"page","NAME":"PAGE","index$":1}, {"active":true,"entity":"page","key$":"BasicPageFlow","kind":"basic","name":"BasicPageFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"page_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0},{"active":true,"data":{},"input":{"ref":"page_ref01","srcdatavar":"page_ref01_data","suffix":"_up0","textfield":"created_time"},"match":{},"op":"update","spec":[{"apply":"TextFieldMark","def":{"mark":"Mark01-page_ref01"}}],"valid":[],"index$":1},{"active":true,"data":{},"input":{"ref":"page_ref01","srcdatavar":"page_ref01_data","suffix":"_dt0"},"match":{"id":"page01"},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-page_ref01"}}],"index$":2}]}, 'Page')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const page_ref01_ent = client.Page()
    let page_ref01_data = setup.data.new.page['page_ref01']

    page_ref01_data = (await page_ref01_ent.create(page_ref01_data)).data()
    assert(null != page_ref01_data.id)


    // UPDATE
    const page_ref01_data_up0: any = {}
    page_ref01_data_up0.id = page_ref01_data.id

    const page_ref01_markdef_up0 = { name: 'created_time', value: 'Mark01-page_ref01_' + setup.now }
    ;(page_ref01_data_up0 as any)[page_ref01_markdef_up0.name] = page_ref01_markdef_up0.value

    const page_ref01_resdata_up0 = (await page_ref01_ent.update(page_ref01_data_up0)).data()
    assert(page_ref01_resdata_up0.id === page_ref01_data_up0.id)

    assert((page_ref01_resdata_up0 as any)[page_ref01_markdef_up0.name] === page_ref01_markdef_up0.value)


    // LOAD
    const page_ref01_match_dt0: any = {}
    page_ref01_match_dt0.id = page_ref01_data.id
    const page_ref01_data_dt0 = (await page_ref01_ent.load(page_ref01_match_dt0)).data()
    assert(page_ref01_data_dt0.id === page_ref01_data.id)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/page/PageTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = NotionSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['page01','page02','page03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'NOTION_TEST_PAGE_ENTID': idmap,
    'NOTION_TEST_LIVE': 'FALSE',
    'NOTION_TEST_EXPLAIN': 'FALSE',
    'NOTION_APIKEY': '',
  })

  idmap = env['NOTION_TEST_PAGE_ENTID']

  const live = 'TRUE' === env.NOTION_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['NOTION_TEST_PAGE_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new NotionSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.NOTION_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.NOTION_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
