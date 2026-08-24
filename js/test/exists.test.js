
const { test, describe } = require('node:test')
const { equal } = require('node:assert')


const { NotionSDK } = require('..')


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await NotionSDK.test()
    equal(null !== testsdk, true)
  })

})
