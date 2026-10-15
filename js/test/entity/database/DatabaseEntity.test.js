
const envlocal = __dirname + '/../../../.env.local'
require('../../utility').loadEnvLocal(envlocal)

const Path = require('node:path')
const Fs = require('node:fs')

const { test, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const { createLiveTransport } = require('../../live-runner')
const { runLiveEntity } = require('../../live-entity')


const { NotionSDK, BaseFeature, stdutil, config } = require('../../..')

const {
  envOverride,
  liveClientOptions,
  liveDelay,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
} = require('../../utility')


describe('DatabaseEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NOTION_TEST_LIVE=TRUE.
  afterEach(liveDelay('NOTION_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NotionSDK.test()
    const ent = testsdk.Database()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == config.feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = NotionSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Database().load({"id":1}),
      (err) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"created_time":{"a":true,"h":"Created Time","n":"created_time","r":false,"t":"`$STRING`","key$":"created_time","index$":0},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":1},"last_edited_time":{"a":true,"h":"Last Edited Time","n":"last_edited_time","r":false,"t":"`$STRING`","key$":"last_edited_time","index$":2},"object":{"a":true,"h":"Object","n":"object","r":false,"t":"`$STRING`","key$":"object","index$":3},"parent":{"a":true,"h":"Parent","n":"parent","op":{"create":{"req":true,"type":"`$OBJECT`"}},"r":false,"t":"`$OBJECT`","key$":"parent","index$":4},"properties":{"a":true,"h":"Properties","n":"properties","op":{"create":{"req":true,"type":"`$OBJECT`"}},"r":false,"t":"`$OBJECT`","key$":"properties","index$":5},"title":{"a":true,"h":"Title","n":"title","op":{"create":{"req":true,"type":"`$ARRAY`"}},"r":false,"t":"`$ARRAY`","key$":"title","index$":6}},"id":{"field":"id","name":"id"},"name":"database","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["parent","properties","title"],"co":{"id":"POST /databases","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/databases","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"databases"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /databases/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/databases/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"databases"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"update":{"input":"data","name":"update","points":[{"a":true,"bf":["properties","title"],"co":{"id":"PATCH /databases/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"PATCH","o":"/databases/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"databases"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"database","name__orig":"database","Name":"Database","name_":"database","name-":"database","NAME":"DATABASE","index$":0}, {"active":true,"entity":"database","key$":"BasicDatabaseFlow","kind":"basic","name":"BasicDatabaseFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"database_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{"ref":"database_ref01","srcdatavar":"database_ref01_data","suffix":"_up0","textfield":"created_time"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-database_ref01"}}],"v":[],"index$":1},{"a":true,"d":{},"i":{"ref":"database_ref01","srcdatavar":"database_ref01_data","suffix":"_dt0"},"m":{"id":"database01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-database_ref01"}}],"index$":2}]}, 'Database', {"POST /databases":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["parent","title","properties"],"properties":{"parent":{"type":"object","properties":{"page_id":{"type":"string"}},"key$":"parent"},"title":{"type":"array","items":{"type":"object"},"key$":"title"},"properties":{"type":"object","key$":"properties"}},"x-ref":"#/components/schemas/DatabaseInput","index$":1}}}},"parameters":[]},"GET /databases/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"index$":0}]},"PATCH /databases/{id}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"title":{"type":"array","items":{"type":"object"},"key$":"title"},"properties":{"type":"object","key$":"properties"}},"x-ref":"#/components/schemas/DatabaseUpdateInput","index$":1}}}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const database_ref01_ent = client.Database()
    let database_ref01_data = setup.data.new.database['database_ref01']

    database_ref01_data = (await database_ref01_ent.create(database_ref01_data)).data()
    assert(null != database_ref01_data.id)


    // UPDATE
    const database_ref01_data_up0 = {}
    database_ref01_data_up0.id = database_ref01_data.id

    const database_ref01_markdef_up0 = { name: 'created_time', value: 'Mark01-database_ref01_' + setup.now }
    database_ref01_data_up0 [database_ref01_markdef_up0.name] = database_ref01_markdef_up0.value

    const database_ref01_resdata_up0 = (await database_ref01_ent.update(database_ref01_data_up0)).data()
    assert(database_ref01_resdata_up0.id === database_ref01_data_up0.id)

    assert(database_ref01_resdata_up0[database_ref01_markdef_up0.name] === database_ref01_markdef_up0.value)


    // LOAD
    const database_ref01_match_dt0 = {}
    database_ref01_match_dt0.id = database_ref01_data.id
    const database_ref01_data_dt0 = (await database_ref01_ent.load(database_ref01_match_dt0)).data()
    assert(database_ref01_data_dt0.id === database_ref01_data.id)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra) {
  // TODO: fix test def options
  const options = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname,
      '../../../../.sdk/test/entity/database/DatabaseTestData.json')

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
    ['database01','database02','database03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'NOTION_TEST_DATABASE_ENTID': idmap,
    'NOTION_TEST_LIVE': 'FALSE',
    'NOTION_TEST_EXPLAIN': 'FALSE',
    'NOTION_APIKEY': '',
  })

  idmap = env['NOTION_TEST_DATABASE_ENTID']

  const live = 'TRUE' === env.NOTION_TEST_LIVE
  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['NOTION_TEST_DATABASE_ENTID']
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
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when
      // the last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey and
      // server values above and handed the SDK undefined.
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
  
