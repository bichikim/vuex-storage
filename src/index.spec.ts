/* tslint:disable:no-unused-expression */
/* eslint-disable no-global-assign,no-new */
import {parse, serialize} from 'cookie'
import {cloneDeep} from 'lodash'
import Cookies from 'universal-cookie'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexStorage from './'
const cookies = new Cookies()
describe('vuex-storage', () => {
  if(!window.process){
    window.process = {} as any
  }
  Vue.config.productionTip = false
  Vue.config.devtools = false
  Vue.use(Vuex)
  const key = 'test'
  const vuexStorageOptions = {
    key,
    local: {
      only: ['localTest', 'deepLocalTest'],
      except: ['deepLocalTest.bar'],
    },
    session: {
      only: ['sessionTest', 'deepSessionTest'],
      except: ['deepSessionTest.bar'],
    },
    cookie: {
      only: ['cookieTest', 'deepCookieTest'],
      except: ['deepCookieTest.bar'],
    },
  }
  const CHANGE_LOCAL_TEST = 'changeLocalTest'
  const CHANGE_SESSION_TEST = 'changeSessionTest'
  const CHANGE_COOKIE_TEST = 'changeCookieTest'
  const CHANGE_RESULT = 'testDone'
  const state: any = {
    state: {
      localTest: null,
      sessionTest: null,
      cookieTest: null,
    },
    modules: {
      deepLocalTest: {
        state: {
          foo: null,
          bar: null,
        },
      },
      deepSessionTest: {
        state: {
          foo: null,
          bar: null,
        },
      },
      deepCookieTest: {
        state: {
          foo: null,
          bar: null,
        },
      },
    },
    mutations: {
      [CHANGE_LOCAL_TEST](state: any) {
        state.localTest = CHANGE_RESULT
        state.deepLocalTest.foo = CHANGE_RESULT
        state.deepLocalTest.bar = CHANGE_RESULT
      },
      [CHANGE_SESSION_TEST](state: any) {
        state.sessionTest = CHANGE_RESULT
        state.deepSessionTest.foo = CHANGE_RESULT
        state.deepSessionTest.bar = CHANGE_RESULT
      },
      [CHANGE_COOKIE_TEST](state: any) {
        state.cookieTest = CHANGE_RESULT
        state.deepCookieTest.foo = CHANGE_RESULT
        state.deepCookieTest.bar = CHANGE_RESULT
      },
    },
  }
  beforeEach(() => {
    window.localStorage.setItem(key, JSON.stringify({
      localTest: 'test',
      deepLocalTest: {
        foo: 'foo',
        bar: 'bar',
      },
    }))
    window.sessionStorage.setItem(key, JSON.stringify({
      sessionTest: 'test',
      deepSessionTest: {
        foo: 'foo',
        bar: 'bar',
      },
    }))
    cookies.set(key, {
      cookieTest: 'test',
      deepCookieTest: {
        foo: 'foo',
        bar: 'bar',
      },
    }, {path: '/'})
  })
  afterEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
    cookies.remove(key, {path: '/'})
    delete window.onNuxtReady
    delete process.server
  })
  describe('plugin', function test() {
    it('should not run plugin twice', () => {
      const twice = () => {
        const vuexStorage = new VuexStorage(vuexStorageOptions)
        new Vuex.Store({
          ...cloneDeep(state),
          plugins: [
            vuexStorage.plugin,
            vuexStorage.plugin,
          ],
        })
      }
      expect(twice).to.throw()
    })
    it('should run with clientSide function option ', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        clientSide: () => (true),
      })
      new Vuex.Store({
        ...cloneDeep(state),
        plugins: [
          vuexStorage.plugin,
        ],
      })
    })
  })
  describe('restore', () => {
    it('should restore for local, session & cookie', function test() {
      const vuexStorage = new VuexStorage(vuexStorageOptions)
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.localTest).to.equal('test')
      expect(store.state.deepLocalTest.foo).to.equal('foo')
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal('test')
      expect(store.state.deepSessionTest.foo).to.equal('foo')
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal('test')
      expect(store.state.deepCookieTest.foo).to.equal('foo')
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should restore with key', function test() {
      const key = 'myTest'
      window.localStorage.setItem(key, JSON.stringify({
        localTest: 'test',
        deepLocalTest: {
          foo: 'foo',
          bar: 'bar',
        },
      }))
      window.sessionStorage.setItem(key, JSON.stringify({
        sessionTest: 'test',
        deepSessionTest: {
          foo: 'foo',
          bar: 'bar',
        },
      }))
      cookies.set(key, {
        cookieTest: 'test',
        deepCookieTest: {
          foo: 'foo',
          bar: 'bar',
        },
      }, {path: '/'})
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        key,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
      })

      expect(store.state.localTest).to.equal('test')
      expect(store.state.deepLocalTest.foo).to.equal('foo')
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal('test')
      expect(store.state.deepSessionTest.foo).to.equal('foo')
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal('test')
      expect(store.state.deepCookieTest.foo).to.equal('foo')
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should not restore with restore false', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        restore: false,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal(null)
      expect(store.state.deepCookieTest.foo).to.equal(null)
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should not restore with no options', function test() {
      const vuexStorage = new VuexStorage()
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal(null)
      expect(store.state.deepCookieTest.foo).to.equal(null)
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should not restore with empty local, session & cookie options', function test() {
      const vuexStorage = new VuexStorage({
        local: {},
        session: {},
        cookie: {},
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal(null)
      expect(store.state.deepCookieTest.foo).to.equal(null)
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should restore with strict true', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        strict: true,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        mutations: {
          ...state.mutations,
          [vuexStorage.mutationName]: vuexStorage.mutation,
        },
        strict: true,
      })
      expect(store.state.localTest).to.equal('test')
      expect(store.state.deepLocalTest.foo).to.equal('foo')
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal('test')
      expect(store.state.deepSessionTest.foo).to.equal('foo')
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal('test')
      expect(store.state.deepCookieTest.foo).to.equal('foo')
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should restore with strict true & mutationName', function test() {
      const mutationName = 'anyMutationName'
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        strict: true,
        mutationName,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        mutations: {
          ...state.mutations,
          [mutationName]: vuexStorage.mutation,
        },
        strict: true,
      })
      expect(store.state.localTest).to.equal('test')
      expect(store.state.deepLocalTest.foo).to.equal('foo')
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal('test')
      expect(store.state.deepSessionTest.foo).to.equal('foo')
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal('test')
      expect(store.state.deepCookieTest.foo).to.equal('foo')
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should restore state with storage first true', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        local: {
          only: ['localTest', 'deepLocalTest'],
        },
        session: {
          only: ['sessionTest', 'deepSessionTest'],
        },
        cookie: {
          only: ['cookieTest', 'deepCookieTest'],
        },
        storageFirst: false,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        state: {
          localTest: null,
          sessionTest: null,
          cookieTest: null,
        },
        modules: {
          deepLocalTest: {
            state: {
              foo: null,
            },
          },
          deepSessionTest: {
            state: {
              foo: null,
            },
          },
          deepCookieTest: {
            state: {
              foo: null,
            },
          },
        },
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal('bar')
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal('bar')
      expect(store.state.cookieTest).to.equal(null)
      expect(store.state.deepCookieTest.foo).to.equal(null)
      expect(store.state.deepCookieTest.bar).to.equal('bar')
    })
    it('should restore state with storage first true & strict true', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        local: {
          only: ['localTest', 'deepLocalTest'],
        },
        session: {
          only: ['sessionTest', 'deepSessionTest'],
        },
        cookie: {
          only: ['cookieTest', 'deepCookieTest'],
        },
        storageFirst: false,
        strict: true,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        state: {
          localTest: null,
          sessionTest: null,
          cookieTest: null,
        },
        modules: {
          deepLocalTest: {
            state: {
              foo: null,
            },
          },
          deepSessionTest: {
            state: {
              foo: null,
            },
          },
          deepCookieTest: {
            state: {
              foo: null,
            },
          },
        },
        strict: true,
        mutations: {
          ...state.mutations,
          [vuexStorage.mutationName]: vuexStorage.mutation,
        },
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal('bar')
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal('bar')
      expect(store.state.cookieTest).to.equal(null)
      expect(store.state.deepCookieTest.foo).to.equal(null)
      expect(store.state.deepCookieTest.bar).to.equal('bar')
    })
    it('should restore Nuxt', function test() {
      let _callback: any
      window.onNuxtReady = (callback) => {
        _callback = callback
      }
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        clientSide: true,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
      })
      expect(_callback).to.be.a('function')
      _callback()
      expect(store.state.localTest).to.equal('test')
      expect(store.state.deepLocalTest.foo).to.equal('foo')
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal('test')
      expect(store.state.deepSessionTest.foo).to.equal('foo')
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal('test')
      expect(store.state.deepCookieTest.foo).to.equal('foo')
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
  })
  describe('save', function test() {
    it('should save', function test() {
      const vuexStorage = new VuexStorage(vuexStorageOptions)
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
      })
      store.commit(CHANGE_LOCAL_TEST)
      store.commit(CHANGE_SESSION_TEST)
      store.commit(CHANGE_COOKIE_TEST)
      expect(store.state.localTest).to.equal(CHANGE_RESULT)
      expect(store.state.deepLocalTest.foo).to.equal(CHANGE_RESULT)
      expect(store.state.deepLocalTest.bar).to.equal(CHANGE_RESULT)
      expect(store.state.sessionTest).to.equal(CHANGE_RESULT)
      expect(store.state.deepSessionTest.foo).to.equal(CHANGE_RESULT)
      expect(store.state.deepSessionTest.bar).to.equal(CHANGE_RESULT)
      expect(store.state.cookieTest).to.equal(CHANGE_RESULT)
      expect(store.state.deepCookieTest.foo).to.equal(CHANGE_RESULT)
      expect(store.state.deepCookieTest.bar).to.equal(CHANGE_RESULT)
      expect(JSON.parse(window.localStorage.getItem(key))).to.deep.equal({
        localTest: CHANGE_RESULT,
        deepLocalTest: {
          foo: CHANGE_RESULT,
        },
      })
      expect(JSON.parse(window.sessionStorage.getItem(key))).to.deep.equal({
        sessionTest: CHANGE_RESULT,
        deepSessionTest: {
          foo: CHANGE_RESULT,
        },
      })
      expect(cookies.get(key)).to.deep.equal({
        cookieTest: CHANGE_RESULT,
        deepCookieTest: {
          foo: CHANGE_RESULT,
        },
      })
    })
  })
  describe('nuxtServerInit', () => {
    const that: any = {}
    let resCookie = serialize('other', JSON.stringify({test: 'test'}))
    beforeEach(() => {
      localStorage.clear()
      sessionStorage.clear()
      // cookies.set(key, {}, {path: '/'})
      process.server = true
      that.cookie = {
        cookieTest: 'test',
        deepCookieTest: {
          foo: 'foo',
          bar: 'bar',
        },
      }
      that.req = {
        path: '/',
        method: 'GET',
        headers: {
          cookie: serialize(key, JSON.stringify({...that.cookie})),
        },
      }

      that.res = {
        getHeader() {
          return resCookie
        },
        setHeader(name: string, cookies: any) {
          expect(name).to.equal('set-cookie')
        },
      }
    })
    it('should init store', async function test() {
      const {req, res} = that
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        clientSide: false,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        actions: {
          nuxtServerInit(store, context) {
            vuexStorage.nuxtServerInit(store, context)
          },
        },
      })
      await store.dispatch('nuxtServerInit', {req, res})
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal('test')
      expect(store.state.deepCookieTest.foo).to.equal('foo')
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
    it('should not init store with restore: false', async function test() {
      const {req, res} = that
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        clientSide: false,
        restore: false,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        actions: {
          nuxtServerInit(store, context) {
            vuexStorage.nuxtServerInit(store, context)
          },
        },
      })
      await store.dispatch('nuxtServerInit', {req, res})
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal(null)
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal(null)
      expect(store.state.cookieTest).to.equal(null)
      expect(store.state.deepCookieTest.foo).to.equal(null)
      expect(store.state.deepCookieTest.bar).to.equal(null)
    })
  })
})
