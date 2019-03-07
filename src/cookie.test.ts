import {expect} from 'chai'
import {parse, serialize} from 'cookie'
import {createRequest, createResponse} from 'node-mocks-http'
import Cookie from './cookie'
const key = 'key'

describe('cookie in nodejs', () => {
  let req: any, res: any
  it('should set', () => {
    req = createRequest({
      method: 'GET',
      url: '/',
    })
    res = createResponse()
    const cookie = new Cookie({res, req})
    const data = {test: 'test'}
    const name = 'test'
    const name2 = 'test2'
    cookie.set(name, data)
    cookie.set(name2, data)
    const rawData = parse(res.getHeader('set-cookie'))[name]
    expect(JSON.parse(rawData)).to.deep.equal(data)
    expect(cookie.get(name)).to.deep.equal(data)
    expect(cookie.get(name2)).to.deep.equal(data)
  })
  it('should get', () => {
    const data = {test: 'test'}
    const name = 'test'
    req = createRequest({
      method: 'GET',
      url: '/',
      cookies: serialize(name, JSON.stringify(data)) as any,
    })
    res = createResponse()
    const cookie = new Cookie({res, req})
    expect(cookie.get(name)).to.deep.equal(data)
  })
  it('should get with header.cookie', () => {
    const data = {test: 'test'}
    const name = 'test'
    req = createRequest({
      method: 'GET',
      url: '/',
      headers: {
        cookie: serialize(name, JSON.stringify(data)) as any,
      },
    })
    res = createResponse()
    const cookie = new Cookie({res, req})
    expect(cookie.get(name)).to.deep.equal(data)
  })
  it('should remove', () => {
    const data = {test: 'test'}
    const name = 'test'
    req = createRequest({
      method: 'GET',
      url: '/',
      headers: {
        cookie: serialize(name, JSON.stringify(data)) as any,
      },
    })
    res = createResponse()
    const cookie = new Cookie({res, req})
    cookie.remove(name)
    expect(cookie.get(name)).to.be.an('undefined')
  })
})
