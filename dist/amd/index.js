var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("cookie", ["require", "exports", "cookie", "lodash"], function (require, exports, cookie, lodash_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cookie = __importStar(cookie);
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
                this._cookies = lodash_1.merge(this._cookies, cookie.parse(_cookie.toString(), options));
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
    exports.default = Cookies;
});
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("index", ["require", "exports", "lodash", "cookie"], function (require, exports, lodash_2, cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cookie_1 = __importDefault(cookie_1);
    exports.DEFAULT_KEY = 'vuex';
    exports.DEFAULT_MUTATION_NAME = '__RESTORE_MUTATION';
    // saving mutation name
    function storeExceptOrOnly(_state, except, only) {
        var state = lodash_2.cloneDeep(_state);
        var clonedState = {};
        if (!only && !except) {
            return clonedState;
        }
        if (only) {
            clonedState = lodash_2.pick(state, only);
        }
        else {
            clonedState = state;
        }
        if (except) {
            clonedState = lodash_2.omit(clonedState, except);
        }
        return clonedState;
    }
    var VuexStorage = /** @class */ (function () {
        function VuexStorage(options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var _a = options.restore, restore = _a === void 0 ? true : _a, _b = options.strict, strict = _b === void 0 ? false : _b, _c = options.key, key = _c === void 0 ? exports.DEFAULT_KEY : _c, _d = options.mutationName, mutationName = _d === void 0 ? exports.DEFAULT_MUTATION_NAME : _d, _e = options.storageFirst, storageFirst = _e === void 0 ? true : _e, dynamicFilter = options.filter, clientSide = options.clientSide;
            var isClient = function () {
                if (typeof clientSide === 'function') {
                    return clientSide(_this._store, options);
                }
                if (typeof clientSide === 'boolean') {
                    return clientSide;
                }
                return typeof document === 'object';
            };
            var getStateFilter = function (dynamicFilter) {
                return {
                    cookie: _this._store.state[dynamicFilter.cookie],
                    session: _this._store.state[dynamicFilter.session],
                    local: _this._store.state[dynamicFilter.local],
                };
            };
            var filters = function () {
                if (!dynamicFilter) {
                    return {};
                }
                return typeof dynamicFilter === 'function' ?
                    dynamicFilter(_this._store, options) :
                    getStateFilter(dynamicFilter);
            };
            this.mutationName = mutationName;
            this.mutation = function (state, payload) {
                // eslint-disable-next-line consistent-this
                var that = this;
                Object.keys(payload).forEach(function (moduleKey) {
                    that._vm.$set(state, moduleKey, payload[moduleKey]);
                });
            };
            this.clear = function (context) {
                var cookies = new cookie_1.default(context, isClient());
                cookies.set(key, {}, { path: '/' });
                if (!isClient()) {
                    return;
                }
                var sessionStorage = window.sessionStorage, localStorage = window.localStorage;
                sessionStorage.setItem(key, '{}');
                localStorage.setItem(key, '{}');
            };
            this.restore = function (context) {
                var store = _this._store;
                var cookieState = {};
                var _a = filters(), cookie = _a.cookie, session = _a.session, local = _a.local;
                if (cookie) {
                    var cookies = new cookie_1.default(context, isClient());
                    cookieState = storeExceptOrOnly(cookies.get(key), cookie.except, cookie.only);
                }
                var sessionState = {};
                var localState = {};
                // get client storage data if it is client side
                if (isClient()) {
                    var sessionStorage_1 = window.sessionStorage, localStorage_1 = window.localStorage;
                    var sessionData = '{}';
                    var localData = '{}';
                    if (session) {
                        sessionData = sessionStorage_1.getItem(key)
                            || /* istanbul ignore next: tired of writing tests */ '{}';
                        sessionState = storeExceptOrOnly(JSON.parse(sessionData), session.except, session.only);
                    }
                    if (local) {
                        localData = localStorage_1.getItem(key)
                            || /* istanbul ignore next: tired of writing tests */ '{}';
                        localState = storeExceptOrOnly(JSON.parse(localData), local.except, local.only);
                    }
                }
                var state = lodash_2.merge(sessionState, localState, cookieState);
                var originalState = lodash_2.cloneDeep(store.state);
                if (storageFirst) {
                    state = lodash_2.merge(originalState, state);
                }
                else {
                    state = lodash_2.merge(state, originalState);
                }
                if (strict) {
                    store.commit(mutationName, state);
                }
                else {
                    store.replaceState(state);
                }
            };
            this.save = function (state, context) {
                _this.clear();
                var _a = filters(), cookie = _a.cookie, session = _a.session, local = _a.local;
                var cookies = new cookie_1.default(context, isClient());
                if (cookie && cookies) {
                    /* istanbul ignore next */
                    var _b = cookie.options, options_1 = _b === void 0 ? {} : _b;
                    cookies.set(key, storeExceptOrOnly(state, cookie.except, cookie.only), __assign({ path: '/' }, options_1));
                }
                if (!isClient()) {
                    return;
                }
                var sessionStorage = window.sessionStorage, localStorage = window.localStorage;
                if (session) {
                    sessionStorage.setItem(key, JSON.stringify(storeExceptOrOnly(state, session.except, session.only)));
                }
                if (local) {
                    localStorage.setItem(key, JSON.stringify(storeExceptOrOnly(state, local.except, local.only)));
                }
            };
            this.nuxtServerInit = function (actionContext, nuxtContext) {
                if (restore) {
                    _this.restore(nuxtContext);
                }
                _this.save(_this._store.state, nuxtContext);
            };
            this.plugin = function (store) {
                if (_this._store) {
                    throw new Error('plugin install twice');
                }
                _this._store = store;
                var plugin = function (store) {
                    // restore state
                    if (restore) {
                        _this.restore();
                    }
                    _this.save(store.state);
                    store.subscribe(function (mutation, state) {
                        _this.save(state);
                    });
                };
                if (isClient() && window.onNuxtReady) {
                    window.onNuxtReady(function () { return (plugin(store)); });
                    return;
                }
                if (process.server) {
                    return;
                }
                plugin(store);
            };
        }
        return VuexStorage;
    }());
    exports.default = VuexStorage;
});
//# sourceMappingURL=index.js.map