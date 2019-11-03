import { __assign } from "tslib";
import { cloneDeep, get, merge, omit, pick } from 'lodash';
import Cookies from './cookie';
export var DEFAULT_KEY = 'vuex';
export var FILTERS_KEY = 'vuex-filters';
export var DEFAULT_SAVE_METHOD = 'localStorage';
export var DEFAULT_MUTATION_NAME = '__RESTORE_MUTATION';
// saving mutation name
function storeExceptOrOnly(_state, except, only) {
    var state = cloneDeep(_state);
    var clonedState = {};
    if (!only && !except) {
        return clonedState;
    }
    if (only) {
        clonedState = pick(state, only);
    }
    else {
        clonedState = state;
    }
    if (except) {
        clonedState = omit(clonedState, except);
    }
    return clonedState;
}
var VuexStorage = /** @class */ (function () {
    function VuexStorage(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var _a = options.restore, restore = _a === void 0 ? true : _a, _b = options.strict, strict = _b === void 0 ? false : _b, _c = options.key, key = _c === void 0 ? DEFAULT_KEY : _c, _d = options.mutationName, mutationName = _d === void 0 ? DEFAULT_MUTATION_NAME : _d, _e = options.storageFirst, storageFirst = _e === void 0 ? true : _e, _f = options.filter, dynamicFilter = _f === void 0 ? {} : _f, clientSide = options.clientSide, _g = options.filterSaveKey, filterSaveKey = _g === void 0 ? FILTERS_KEY : _g, _h = options.filterSaveMethod, filterSaveMethod = _h === void 0 ? DEFAULT_SAVE_METHOD : _h;
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
                cookie: get(_this._store.state, dynamicFilter.cookie || ''),
                session: get(_this._store.state, dynamicFilter.session || ''),
                local: get(_this._store.state, dynamicFilter.local || ''),
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
            var cookies = new Cookies(context, isClient());
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
            var originalState = cloneDeep(store.state);
            if (storageFirst) {
                _state = merge(originalState, state);
            }
            else {
                _state = merge(state, originalState);
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
                var cookies = new Cookies(context, isClient());
                cookieState = cookies.get(filterSaveKey);
            }
            mergeState(merge(localState, cookieState));
        };
        this.restore = function (context) {
            var cookieState = {};
            var _a = filters(), cookie = _a.cookie, session = _a.session, local = _a.local;
            if (cookie) {
                var cookies = new Cookies(context, isClient());
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
            mergeState(merge(sessionState, localState, cookieState));
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
                var cookies = new Cookies(context, isClient());
                cookies.set(filterSaveKey, storeExceptOrOnly(state, undefined, filterOnly), { path: '/' });
            }
        };
        this.save = function (state, context) {
            var _a = filters(), cookie = _a.cookie, session = _a.session, local = _a.local;
            var cookies = new Cookies(context, isClient());
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
export default VuexStorage;
//# sourceMappingURL=index.js.map