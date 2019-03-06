import Cookie from './cookie'
import {expect} from 'chai'

describe('cookie in browser', () => {
  const cookie = new Cookie()
  beforeEach(() => {
    cookie.set('test', {test: 'test'})
    cookie.set('test1', {test1: 'test1'})
  })
  afterEach(() => {
    cookie.remove('test')
    cookie.remove('test1')
    cookie.remove('test2')
  })
  it('should get', () => {
    const result = cookie.get('test')
    const result1 = cookie.get('test1')
    expect(result).to.deep.equal({test: 'test'})
    expect(result1).to.deep.equal({test1: 'test1'})
  })
  it('should set', () => {
    cookie.set('test2', {test2: 'test2'})
    const result = cookie.get('test2')
    expect(result).to.deep.equal({test2: 'test2'})
  })
  it('should remove', () => {
    cookie.remove('test')
    const result = cookie.get('')
    expect(result).to.be.an('undefined')
  })
})
