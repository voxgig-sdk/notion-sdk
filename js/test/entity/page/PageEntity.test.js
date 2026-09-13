
const envlocal = __dirname + '/../../../.env.local'
require('dotenv').config({ quiet: true, path: [envlocal] })

const Path = require('node:path')
const Fs = require('node:fs')

const { test, describe, afterEach } = require('node:test')
const assert = require('node:assert')


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


describe('PageEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NOTION_TEST_LIVE=TRUE.
  afterEach(liveDelay('NOTION_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NotionSDK.test()
    const ent = testsdk.Page()
    assert(null != ent)
  })


  test('basic', async () => {

    const setup = basicSetup()
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
    const page_ref01_data_up0 = {}
    page_ref01_data_up0.id = page_ref01_data.id

    const page_ref01_markdef_up0 = { name: 'created_time', value: 'Mark01-page_ref01_' + setup.now }
    page_ref01_data_up0 [page_ref01_markdef_up0.name] = page_ref01_markdef_up0.value

    const page_ref01_resdata_up0 = (await page_ref01_ent.update(page_ref01_data_up0)).data()
    assert(page_ref01_resdata_up0.id === page_ref01_data_up0.id)

    assert(page_ref01_resdata_up0[page_ref01_markdef_up0.name] === page_ref01_markdef_up0.value)


    // LOAD
    const page_ref01_match_dt0 = {}
    page_ref01_match_dt0.id = page_ref01_data.id
    const page_ref01_data_dt0 = (await page_ref01_ent.load(page_ref01_match_dt0)).data()
    assert(page_ref01_data_dt0.id === page_ref01_data.id)


  })
})



function basicSetup(extra) {
  // TODO: fix test def options
  const options = {} // null

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

  if ('TRUE' === env.NOTION_TEST_LIVE) {
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
      extra || {}
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
    now: Date.now(),
  }

  return setup
}
  
