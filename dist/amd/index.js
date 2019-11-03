define("cookie", ["require", "exports", "tslib", "cookie", "lodash"], function (require, exports, tslib_1, cookie, lodash_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cookie = tslib_1.__importStar(cookie);
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
                    this._cookies = tslib_1.__assign({}, _cookie_1);
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
define("index", ["require", "exports", "tslib", "lodash", "cookie"], function (require, exports, tslib_2, lodash_2, cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cookie_1 = tslib_2.__importDefault(cookie_1);
    exports.DEFAULT_KEY = 'vuex';
    exports.FILTERS_KEY = 'vuex-filters';
    exports.DEFAULT_SAVE_METHOD = 'localStorage';
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
            var _a = options.restore, restore = _a === void 0 ? true : _a, _b = options.strict, strict = _b === void 0 ? false : _b, _c = options.key, key = _c === void 0 ? exports.DEFAULT_KEY : _c, _d = options.mutationName, mutationName = _d === void 0 ? exports.DEFAULT_MUTATION_NAME : _d, _e = options.storageFirst, storageFirst = _e === void 0 ? true : _e, _f = options.filter, dynamicFilter = _f === void 0 ? {} : _f, clientSide = options.clientSide, _g = options.filterSaveKey, filterSaveKey = _g === void 0 ? exports.FILTERS_KEY : _g, _h = options.filterSaveMethod, filterSaveMethod = _h === void 0 ? exports.DEFAULT_SAVE_METHOD : _h;
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
                    cookie: lodash_2.get(_this._store.state, dynamicFilter.cookie || ''),
                    session: lodash_2.get(_this._store.state, dynamicFilter.session || ''),
                    local: lodash_2.get(_this._store.state, dynamicFilter.local || ''),
                };
            };
            var filters = function () {
                if (!dynamicFilter) {
                    return {};
                }
                return getStateFilter(dynamicFilter);
            };
            this.mutationName = mutationName;
            this.mutation = function (state, payload) {
                // eslint-disable-next-line consistent-this
                var _vm = this._vm;
                Object.keys(payload).forEach(function (moduleKey) {
                    _vm.$set(state, moduleKey, payload[moduleKey]);
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
            var mergeState = function (state) {
                var store = _this._store;
                var _state = state;
                var originalState = lodash_2.cloneDeep(store.state);
                if (storageFirst) {
                    _state = lodash_2.merge(originalState, state);
                }
                else {
                    _state = lodash_2.merge(state, originalState);
                }
                if (strict) {
                    store.commit(mutationName, _state);
                }
                else {
                    store.replaceState(_state);
                }
            };
            this.restoreFilter = function (context) {
                var localState = {};
                var cookieState = {};
                if (filterSaveMethod === 'localStorage') {
                    if (!isClient()) {
                        return;
                    }
                    localState = JSON.parse(localStorage.getItem(filterSaveKey) || '{}');
                }
                else {
                    var cookies = new cookie_1.default(context, isClient());
                    cookieState = cookies.get(filterSaveKey);
                }
                mergeState(lodash_2.merge(localState, cookieState));
            };
            this.restore = function (context) {
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
                    var sessionData = '{}';
                    var localData = '{}';
                    if (session) {
                        sessionData = sessionStorage.getItem(key)
                            || /* istanbul ignore next: tired of writing tests */ '{}';
                        sessionState = storeExceptOrOnly(JSON.parse(sessionData), session.except, session.only);
                    }
                    if (local) {
                        localData = localStorage.getItem(key)
                            || /* istanbul ignore next: tired of writing tests */ '{}';
                        localState = storeExceptOrOnly(JSON.parse(localData), local.except, local.only);
                    }
                }
                mergeState(lodash_2.merge(sessionState, localState, cookieState));
            };
            this.saveFilter = function (state, context) {
                var filterOnly = [];
                var dynamicLocal = dynamicFilter.local, dynamicCookie = dynamicFilter.cookie, dynamicSession = dynamicFilter.session;
                if (dynamicLocal) {
                    filterOnly.push(dynamicLocal);
                }
                if (dynamicCookie) {
                    filterOnly.push(dynamicCookie);
                }
                if (dynamicSession) {
                    filterOnly.push(dynamicSession);
                }
                if (filterSaveMethod === 'localStorage') {
                    if (!isClient()) {
                        return;
                    }
                    localStorage.setItem(filterSaveKey, JSON.stringify(storeExceptOrOnly(state, undefined, filterOnly)));
                }
                else {
                    var cookies = new cookie_1.default(context, isClient());
                    cookies.set(filterSaveKey, storeExceptOrOnly(state, undefined, filterOnly), { path: '/' });
                }
            };
            this.save = function (state, context) {
                var _a = filters(), cookie = _a.cookie, session = _a.session, local = _a.local;
                var cookies = new cookie_1.default(context, isClient());
                if (cookie && cookies) {
                    /* istanbul ignore next */
                    var _b = cookie.options, options_1 = _b === void 0 ? {} : _b;
                    cookies.set(key, storeExceptOrOnly(state, cookie.except, cookie.only), tslib_2.__assign({ path: '/' }, options_1));
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
                _this.restoreFilter(nuxtContext);
                if (restore) {
                    _this.restore(nuxtContext);
                }
                _this.clear();
                _this.saveFilter(_this._store.state, nuxtContext);
                _this.save(_this._store.state, nuxtContext);
            };
            this.plugin = function (store) {
                if (_this._store) {
                    throw new Error('plugin install twice');
                }
                _this._store = store;
                var plugin = function (store) {
                    _this.restoreFilter();
                    // restore state
                    if (restore) {
                        _this.restore();
                    }
                    _this.clear();
                    _this.saveFilter(store.state);
                    _this.save(store.state);
                    store.subscribe(function (mutation, state) {
                        _this.clear();
                        _this.saveFilter(state);
                        _this.save(state);
                    });
                };
                if (isClient() && window.onNuxtReady) {
                    window.onNuxtReady(function () { return (plugin(store)); });
                    return;
                }
                if (process && process.server) {
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