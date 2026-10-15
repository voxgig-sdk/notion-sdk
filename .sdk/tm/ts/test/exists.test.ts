
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { NotionSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = NotionSDK.test()
    equal(testsdk instanceof NotionSDK, true,
      'NotionSDK.test() must return a client synchronously')
  })

})
