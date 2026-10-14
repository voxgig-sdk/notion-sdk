

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { NotionSDK, BaseFeature, config, stdutil } from '../../..'

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


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = NotionSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Page().load({"id":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.NOTION_TEST_LIVE
    for (const op of ['create', 'update', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'page.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"archived":{"a":true,"h":"Archived","n":"archived","r":false,"t":"`$BOOLEAN`","key$":"archived","index$":0},"created_time":{"a":true,"h":"Created Time","n":"created_time","r":false,"t":"`$STRING`","key$":"created_time","index$":1},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":2},"last_edited_time":{"a":true,"h":"Last Edited Time","n":"last_edited_time","r":false,"t":"`$STRING`","key$":"last_edited_time","index$":3},"object":{"a":true,"h":"Object","n":"object","r":false,"t":"`$STRING`","key$":"object","index$":4},"parent":{"a":true,"h":"Parent","n":"parent","op":{"create":{"req":true,"type":"`$OBJECT`"}},"r":false,"t":"`$OBJECT`","key$":"parent","index$":5},"properties":{"a":true,"h":"Properties","n":"properties","op":{"create":{"req":true,"type":"`$OBJECT`"}},"r":false,"t":"`$OBJECT`","key$":"properties","index$":6}},"id":{"field":"id","name":"id"},"name":"page","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["parent","properties"],"co":{"id":"POST /pages","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/pages","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"pages"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /pages/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/pages/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"pages"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"update":{"input":"data","name":"update","points":[{"a":true,"bf":["archived","properties"],"co":{"id":"PATCH /pages/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"PATCH","o":"/pages/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"pages"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"page","name__orig":"page","Name":"Page","name_":"page","name-":"page","NAME":"PAGE","index$":1}, {"active":true,"entity":"page","key$":"BasicPageFlow","kind":"basic","name":"BasicPageFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"page_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{"ref":"page_ref01","srcdatavar":"page_ref01_data","suffix":"_up0","textfield":"created_time"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-page_ref01"}}],"v":[],"index$":1},{"a":true,"d":{},"i":{"ref":"page_ref01","srcdatavar":"page_ref01_data","suffix":"_dt0"},"m":{"id":"page01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-page_ref01"}}],"index$":2}]}, 'Page', {"POST /pages":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["parent","properties"],"properties":{"parent":{"type":"object","properties":{"database_id":{"type":"string"}},"key$":"parent"},"properties":{"type":"object","key$":"properties"}},"x-ref":"#/components/schemas/PageInput","index$":1}}}},"parameters":[]},"GET /pages/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"index$":0}]},"PATCH /pages/{id}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"properties":{"type":"object","key$":"properties"},"archived":{"type":"boolean","key$":"archived"}},"x-ref":"#/components/schemas/PageUpdateInput","index$":1}}}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"index$":0}]}}, { strict: LIVE_STRICT, t })
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



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

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
  
