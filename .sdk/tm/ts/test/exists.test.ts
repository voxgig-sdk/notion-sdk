
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { NotionSDK } from '..'


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await NotionSDK.test()
    equal(null !== testsdk, true)
  })

})
