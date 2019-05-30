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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "lodash", "./cookie"], function (require, exports, lodash_1, cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cookie_1 = __importDefault(cookie_1);
    exports.DEFAULT_KEY = 'vuex';
    exports.DEFAULT_MUTATION_NAME = '__RESTORE_MUTATION';
    // saving mutation name
    function storeExceptOrOnly(_state, except, only) {
        var state = lodash_1.cloneDeep(_state);
        var clonedState = {};
        if (!only && !except) {
            return clonedState;
        }
        if (only) {
            clonedState = lodash_1.pick(state, only);
        }
        else {
            clonedState = state;
        }
        if (except) {
            clonedState = lodash_1.omit(clonedState, except);
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
                var state = lodash_1.merge(sessionState, localState, cookieState);
                var originalState = lodash_1.cloneDeep(store.state);
                if (storageFirst) {
                    state = lodash_1.merge(originalState, state);
                }
                else {
                    state = lodash_1.merge(state, originalState);
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