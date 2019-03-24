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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash", "./cookie"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lodash_1 = require("lodash");
    var cookie_1 = __importDefault(require("./cookie"));
    // saving mutation name
    function storeExceptOrOnly(_state, except, only) {
        var state = lodash_1.cloneDeep(_state);
        var clonedState = {};
        if (except) {
            clonedState = lodash_1.omit(state, except);
        }
        else {
            clonedState = state;
        }
        if (only) {
            clonedState = lodash_1.pick(clonedState, only);
        }
        return clonedState;
    }
    var VuexStorage = /** @class */ (function () {
        function VuexStorage(options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            var cookie = options.cookie, _a = options.restore, restore = _a === void 0 ? true : _a, isRun = options.isRun, _b = options.strict, strict = _b === void 0 ? false : _b, _c = options.key, key = _c === void 0 ? 'vuex' : _c, local = options.local, _d = options.mutationName, mutationName = _d === void 0 ? '__RESTORE_MUTATION' : _d, session = options.session, _e = options.storageFirst, storageFirst = _e === void 0 ? true : _e, clientSide = options.clientSide;
            /* istanbul ignore if */
            if (isRun) {
                console.warn('please do not use the isRun option');
            }
            var isClient = function () {
                if (typeof clientSide === 'function') {
                    return clientSide(_this._store, options);
                }
                if (typeof clientSide === 'boolean') {
                    return clientSide;
                }
                return typeof document === 'object';
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
                if (cookie) {
                    var cookies = new cookie_1.default(context, isClient());
                    cookieState = storeExceptOrOnly(cookies.get(key), cookie.except, cookie.only);
                }
                var sessionState = {};
                var localState = {};
                if (isClient()) {
                    var sessionStorage_1 = window.sessionStorage, localStorage_1 = window.localStorage;
                    var sessionData = '{}';
                    var localData = '{}';
                    if (session) {
                        sessionData = sessionStorage_1.getItem(key) || '{}';
                        sessionState = storeExceptOrOnly(JSON.parse(sessionData), session.except, session.only);
                    }
                    if (local) {
                        localData = localStorage_1.getItem(key) || '{}';
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
                var cookies = new cookie_1.default(context, isClient());
                if (cookie && cookies) {
                    var _a = cookie.options, options_1 = _a === void 0 ? {} : _a;
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