import value from '*.json'
import * as cookie from 'cookie'
interface ICookieOptions {
  req?: Request
  res?: Response
}

export default class Cookies {
  private _res?: Response
  private _req?: Request
  private _isNuxt: boolean
  private _cookies: {[key: string]: any}
  constructor(options: ICookieOptions = {}) {
    const {req, res} = options
    this._req = req
    this._res = res
    this._updateCookie()
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
    this._saveCookie(name, '', options)
  }

  set(name: string, value: object | string, options?: cookie.CookieSerializeOptions) {

    let _value = value
    if(typeof _value === 'object'){
      _value = JSON.stringify(value)
    }
    this._saveCookie(name, _value, options)
  }

  private _updateCookie() {
    if(this.isClient){
      this._cookies = cookie.parse(document.cookie)
      return
    }
    const {_req} = this
    if(_req && _req.headers){
      this._cookies = cookie.parse((_req.headers as any).cookie)
    }
  }

  private _saveCookie(name: string, value: string, options?: cookie.CookieSerializeOptions) {
    const cookieData = cookie.serialize(name, value, options)
    if(this.isClient){
      document.cookie = cookieData
      return
    }
    const {_req, _res} = this
    if(_req && _req.headers){
      _req.headers.append('Set-Cookie', cookieData)
    }
    if(_res){
      _res.headers.append('Set-Cookie', cookieData)
    }
  }
}
