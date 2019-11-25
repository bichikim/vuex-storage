import * as cookie from 'cookie'
import {Request, Response} from 'express'
import {merge} from './lodash'

const SET_COOKIE = 'set-cookie'

export default class Cookies {
  private _res?: Response
  private _req?: Request
  private _cookies: { [key: string]: any }
  private readonly _isClient: boolean
  private _init: boolean = false

  constructor(options: ICookieOptions = {}, isClient: boolean = true) {
    const {req, res} = options
    this._req = req
    this._res = res
    this._isClient = isClient
    this._updateCookie()
    this._init = true
  }

  // eslint-disable-next-line class-methods-use-this
  get isClient(): boolean {
    return this._isClient
  }

  get(name: string, options?: cookie.CookieParseOptions) {
    this._updateCookie(options)
    const data = this._cookies[name]
    try {
      return JSON.parse(data)
    } catch{
      return data
    }
  }

  remove(name: string, options?: cookie.CookieSerializeOptions) {
    delete this._cookies[name]
    this._saveCookie(name, undefined, options)
  }

  set(
    name: string,
    value: object | string,
    options: cookie.CookieSerializeOptions = {sameSite: true},
    ) {
    let _value = value
    if(typeof _value === 'object') {
      _value = JSON.stringify(value)
    }
    this._cookies[name] = value
    this._saveCookie(name, _value, options)
  }

  private _updateCookie(options?: cookie.CookieParseOptions) {
    if(this.isClient) {
      this._cookies = cookie.parse(document.cookie, options)
      return
    }
    this._cookies = {}
    const {_req} = this
    if(_req && (_req.cookies || _req.headers)) {
      const _cookie = _req.cookies || _req.headers.cookie
      if(typeof _cookie === 'object') {
        this._cookies = {..._cookie}
      } else {
        this._cookies = cookie.parse(_cookie, options)
      }
    }
    const {_res} = this
    const _cookie = _res && _res.getHeader(SET_COOKIE)
    if(_cookie) {
      this._cookies = merge(this._cookies, cookie.parse(_cookie.toString(), options))
    }
  }

  private _saveCookie(name: string, value: string = '', options?: cookie.CookieSerializeOptions) {
    if(this.isClient) {
      document.cookie = cookie.serialize(name, value, options)
      return
    }
    const {_res} = this
    if(_res) {
      const regex = new RegExp(`^${name}=`)
      const rawCookie = _res.getHeader(SET_COOKIE) || ''
      const cookies: string[] = rawCookie
      .toString()
      .split(';')
      .filter((value) => {
        return !regex.test(value)
      })
      cookies.push(cookie.serialize(name, value, options))
      _res.setHeader(SET_COOKIE, cookies.join('; '))
    }
  }
}

export {CookieSerializeOptions} from 'cookie'

interface ICookieOptions {
  req?: Request
  res?: Response
}
