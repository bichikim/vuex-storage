import {expect} from 'chai'
import * as cookieModule from 'cookie'
import Cookie from './cookie'

describe('cookie', function test() {
  describe('cookie in browser', () => {
    const that: any = {}
    that.cookie = new Cookie()
    that.testData = {test: 'test'}
    that.test1Data = {test1: 'test1'}
    beforeEach(() => {
      const {cookie, testData, test1Data} = that
      cookie.set('test', testData)
      cookie.set('test1', test1Data)
    })
    afterEach(() => {
      document.cookie = ''
    })
    it('should get', () => {
      const {cookie, testData, test1Data} = that
      const result = cookie.get('test')
      const result1 = cookie.get('test1')
      const realCookie = cookieModule.parse(document.cookie)
      expect(result).to.deep.equal(testData)
      expect(result1).to.deep.equal({test1: 'test1'})
      expect(JSON.parse(realCookie.test)).to.deep.equal(testData)
      expect(JSON.parse(realCookie.test1)).to.deep.equal(test1Data)
    })
    it('should set', () => {
      const {cookie} = that
      const test2Data = {test2: 'test2'}
      const test3Data = 'test3'
      cookie.set('test2', test2Data)
      cookie.set('test3', test3Data)
      const realCookie = cookieModule.parse(document.cookie)
      const result = cookie.get('test2')
      const result3 = cookie.get('test3')
      expect(result).to.deep.equal(test2Data)
      expect(JSON.parse(realCookie.test2)).to.deep.equal(test2Data)
      expect(result3).to.equal(test3Data)
      expect(realCookie.test3).to.equal(test3Data)
    })
    it('should remove', () => {
      const {cookie} = that
      cookie.remove('test')
      const result = cookie.get('test')
      const realCookie = cookieModule.parse(document.cookie)
      expect(result).to.equal('')
      expect(realCookie.test).to.equal('')
    })
  })
  describe('cookie in Nodejs server', function test() {
    const that: any = {} as any
    let resCookie = ''

    before(() => {
      const testData = {test: 'test'}
      that.testData = testData
      that.req = {
        headers: {
          cookie: {
            test: {...testData},
          },
        },
      }
      that.res = {
        getHeader() {
          return resCookie
        },
        setHeader(name: string, value: any) {
          expect(name).to.equal('set-cookie')
          resCookie = value
        },
      }
      const {req, res} = that
      that.cookie = new Cookie({
        req, res,
      }, false)
    })

    it('should get', function test() {
      const {cookie, testData} = that
      const result = cookie.get('test')
      expect(result).to.deep.equal(testData)
    })
  })
  describe('cookie in Nodejs server with req.cookies', function test() {
    const that: any = {}
    let resCookie = ''
    before(() => {
      const testData = {test: 'test'}
      that.testData = testData
      that.req = {
        cookies: {
          test: {...testData},
        },
      }
      that.res = {
        getHeader() {
          return resCookie
        },
        setHeader(name: string, value: any) {
          resCookie = value
        },
      }
      const {req, res} = that
      that.cookie = new Cookie({
        req, res,
      }, false)
    })
    it('should get', function test() {
      const {cookie, testData} = that
      const result = cookie.get('test')
      expect(result).to.deep.equal(testData)
    })
    it('should remove', function test() {
      const {cookie} = that
      cookie.remove('test')
      const result = cookie.get('test')
      expect(cookieModule.parse(resCookie).test).to.equal('')
      expect(result).to.equal('')
    })
    it('should set', function test() {
      const {cookie} = that
      const test1Data = {test1: 'test1'}
      cookie.set('test1', test1Data)
      const result = cookie.get('test1')
      expect(JSON.parse(cookieModule.parse(resCookie).test1)).to.deep.equal(test1Data)
      expect(result).to.deep.equal(test1Data)
    })
  })
})
