var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "cookie", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cookie = __importStar(require("cookie"));
    var lodash_1 = require("lodash");
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
            this._updateCookie();
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
            this._saveCookie(name, '', options);
        };
        Cookies.prototype.set = function (name, value, options) {
            var _value = value;
            if (typeof _value === 'object') {
                _value = JSON.stringify(value);
            }
            this._cookies[name] = value;
            this._saveCookie(name, _value, options);
        };
        Cookies.prototype._updateCookie = function () {
            if (this.isClient) {
                this._cookies = cookie.parse(document.cookie);
                return;
            }
            this._cookies = {};
            var _req = this._req;
            if (_req && _req.headers) {
                var _cookie_1 = _req.headers.cookie || _req.cookies;
                if (typeof _cookie_1 === 'object') {
                    this._cookies = _cookie_1;
                }
                else {
                    this._cookies = cookie.parse(_cookie_1);
                }
            }
            var _res = this._res;
            var _cookie = _res && _res.getHeader(SET_COOKIE);
            if (_cookie) {
                this._cookies = lodash_1.merge(this._cookies, cookie.parse(_cookie.toString()));
            }
        };
        Cookies.prototype._saveCookie = function (name, value, options) {
            var cookieData = cookie.serialize(name, value || '', options);
            if (this.isClient) {
                document.cookie = cookieData;
                return;
            }
            var _a = this, _req = _a._req, _res = _a._res;
            if (_res) {
                var regex_1 = new RegExp("^" + name + "=");
                var rawCookie = _res.getHeader(SET_COOKIE);
                var cookies_1 = [];
                if (rawCookie) {
                    rawCookie.toString().split(';')
                        .forEach(function (value) {
                        if (!regex_1.test(value)) {
                            cookies_1.push(value);
                        }
                    });
                }
                if (value) {
                    cookies_1.push(cookieData);
                }
                _res.setHeader(SET_COOKIE, cookies_1.join('; '));
            }
        };
        return Cookies;
    }());
    exports.default = Cookies;
});
//# sourceMappingURL=cookie.js.map