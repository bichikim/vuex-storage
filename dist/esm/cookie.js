import { __assign } from "tslib";
import * as cookie from 'cookie';
import { merge } from 'lodash';
var SET_COOKIE = 'set-cookie';
var Cookies = /** @class */ (function () {
    function Cookies(options, isClient) {
        if (options === void 0) { options = {}; }
        if (isClient === void 0) { isClient = true; }
        this._init = false;
        var req = options.req, res = options.res;
        this._req = req;
        this._res = res;
        this._isClient = isClient;
        this._updateCookie();
        this._init = true;
    }
    Object.defineProperty(Cookies.prototype, "isClient", {
        // eslint-disable-next-line class-methods-use-this
        get: function () {
            return this._isClient;
        },
        enumerable: true,
        configurable: true
    });
    Cookies.prototype.get = function (name, options) {
        this._updateCookie(options);
        var data = this._cookies[name];
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    };
    Cookies.prototype.remove = function (name, options) {
        delete this._cookies[name];
        this._saveCookie(name, undefined, options);
    };
    Cookies.prototype.set = function (name, value, options) {
        if (options === void 0) { options = { sameSite: true }; }
        var _value = value;
        if (typeof _value === 'object') {
            _value = JSON.stringify(value);
        }
        this._cookies[name] = value;
        this._saveCookie(name, _value, options);
    };
    Cookies.prototype._updateCookie = function (options) {
        if (this.isClient) {
            this._cookies = cookie.parse(document.cookie, options);
            return;
        }
        this._cookies = {};
        var _req = this._req;
        if (_req && (_req.cookies || _req.headers)) {
            var _cookie_1 = _req.cookies || _req.headers.cookie;
            if (typeof _cookie_1 === 'object') {
                this._cookies = __assign({}, _cookie_1);
            }
            else {
                this._cookies = cookie.parse(_cookie_1, options);
            }
        }
        var _res = this._res;
        var _cookie = _res && _res.getHeader(SET_COOKIE);
        if (_cookie) {
            this._cookies = merge(this._cookies, cookie.parse(_cookie.toString(), options));
        }
    };
    Cookies.prototype._saveCookie = function (name, value, options) {
        if (value === void 0) { value = ''; }
        if (this.isClient) {
            document.cookie = cookie.serialize(name, value, options);
            return;
        }
        var _res = this._res;
        if (_res) {
            var regex_1 = new RegExp("^" + name + "=");
            var rawCookie = _res.getHeader(SET_COOKIE) || '';
            var cookies = rawCookie
                .toString()
                .split(';')
                .filter(function (value) {
                return !regex_1.test(value);
            });
            cookies.push(cookie.serialize(name, value, options));
            _res.setHeader(SET_COOKIE, cookies.join('; '));
        }
    };
    return Cookies;
}());
export default Cookies;
//# sourceMappingURL=cookie.js.map