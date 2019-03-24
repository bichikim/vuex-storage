import * as cookie from 'cookie';
import { Request, Response } from 'express';
interface ICookieOptions {
    req?: Request;
    res?: Response;
}
export { CookieSerializeOptions } from 'cookie';
export default class Cookies {
    private _res?;
    private _req?;
    private _isNuxt;
    private _cookies;
    private _isClient;
    private _init;
    constructor(options?: ICookieOptions, isClient?: boolean);
    readonly isClient: boolean;
    get(name: string, options?: cookie.CookieSerializeOptions): any;
    remove(name: string, options?: cookie.CookieSerializeOptions): void;
    set(name: string, value: object | string, options?: cookie.CookieSerializeOptions): void;
    private _updateCookie;
    private _saveCookie;
}
