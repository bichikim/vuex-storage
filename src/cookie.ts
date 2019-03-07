import value from '*.json'
import * as cookie from 'cookie'
import {Request, Response} from 'express'
interface ICookieOptions {
  req?: Request
  res?: Response
}
const SET_COOKIE = 'set-cookie'

export default class Cookies {
  private _res?: Response
  private _req?: Request
  private _isNuxt: boolean
  private _cookies: {[key: string]: any}
  private _init: boolean = false
  constructor(options: ICookieOptions = {}) {
    const {req, res} = options
    this._req = req
    this._res = res
    this._updateCookie()
    this._init = true
  }

  // eslint-disable-next-line class-methods-use-this
  get isClient(): boolean {
    return typeof document === 'object'
  }

  get(name: string, options?: cookie.CookieSerializeOptions) {
    this._updateCookie()
    const data = this._cookies[name]
    try{
      return JSON.parse(data)
    }catch{
      return data
    }
  }

  remove(name: string, options?: cookie.CookieSerializeOptions) {
    delete this._cookies[name]
    this._saveCookie(name, '', options)
  }

  set(name: string, value: object | string, options?: cookie.CookieSerializeOptions) {
    let _value = value
    if(typeof _value === 'object'){
      _value = JSON.stringify(value)
    }
    this._cookies[name] = value
    this._saveCookie(name, _value, options)
  }

  private _updateCookie() {
    if(this.isClient){
      this._cookies = cookie.parse(document.cookie)
      return
    }
    const {_res} = this
    const _cookie = _res && _res.getHeader(SET_COOKIE)
    if(_cookie){
      this._cookies = cookie.parse(_cookie.toString())
      return
    }
    if(this._init){
      return
    }
    const {_req} = this
    if(_req && _req.headers){
      let _cookie = _req.headers.cookie || _req.cookies
      if(!_cookie){
        return
      }
      if(typeof _cookie === 'object'){
        this._cookies = _cookie
        return
      }
      this._cookies = cookie.parse(_cookie)
      return
    }
    this._cookies = {}
  }

  private _saveCookie(name: string, value?: string, options?: cookie.CookieSerializeOptions) {
    const cookieData = cookie.serialize(name, value || '', options)
    if(this.isClient){
      document.cookie = cookieData
      return
    }
    const {_req, _res} = this
    if(_res){
      const regex = new RegExp(`^${name}=`)
      const rawCookie = _res.getHeader(SET_COOKIE)
      let cookies: string[] = []
      if(rawCookie){
        rawCookie.toString().split(';')
          .forEach((value: string) => {
            if(!regex.test(value)){
              cookies.push(value)
            }
          })
      }
      if(value){
        cookies.push(cookieData)
      }
      _res.setHeader(SET_COOKIE, cookies.join('; '))
    }
  }
}
