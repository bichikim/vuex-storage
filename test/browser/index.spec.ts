/* eslint-disable max-lines */
import VuexStorage, {DEFAULT_KEY, FILTERS_KEY} from '@/index'
import {serialize} from 'cookie'
import {cloneDeep} from 'lodash'
import Cookies from 'universal-cookie'
import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'

const cookies = new Cookies()

interface IDefaultState {
  localTest: string | number
  sessionTest: string | number
  cookieTest: string | number
  __local: { only: string[], except: string[] }
  __session: { only: string[], except: string[] }
  __cookie: { only: string[], except: string[] }
}

describe('vuex-storage', () => {
  // if(!window.process) {
  //   window.process = {} as any
  // }
  Vue.config.productionTip = false
  Vue.config.devtools = false
  Vue.use(Vuex)
  const key = DEFAULT_KEY
  const filtersKey = FILTERS_KEY
  const keySec = 'testSec'
  const vuexStorageOptions = {
    filter: {
      local: '__local',
      session: '__session',
      cookie: '__cookie',
    },
  }
  const state: StoreOptions<IDefaultState | any> = {
    state: {
      localTest: null,
      sessionTest: null,
      cookieTest: null,
    },
    modules: {
      deepLocalTest: {
        namespaced: true,
        state: {
          foo: null,
          bar: null,
        },
        mutations: {
          saveFoo(state: any, payload: any) {
            state.foo = payload
          },
          saveBar(state: any, payload: any) {
            state.foo = payload
          },
        },
      },
      deepSessionTest: {
        namespaced: true,
        state: {
          foo: null,
          bar: null,
        },
        mutations: {
          saveFoo(state: any, payload: any) {
            state.foo = payload
          },
          saveBar(state: any, payload: any) {
            state.foo = payload
          },
        },
      },
      deepCookieTest: {
        namespaced: true,
        state: {
          foo: null,
          bar: null,
        },
        mutations: {
          saveFoo(state: any, payload: any) {
            state.foo = payload
          },
          saveBar(state: any, payload: any) {
            state.foo = payload
          },
        },
      },
      __local: {
        namespaced: true,
        state: {
          only: ['localTest', 'deepLocalTest'],
          except: ['deepLocalTest.bar'],
        },
        mutations: {
          saveOnly(state: any, payload: any) {
            state.only = payload
          },
          saveExcept(state: any, payload: any) {
            state.except = payload
          },
        },
      },
      __session: {
        namespaced: true,
        state: {
          only: ['sessionTest', 'deepSessionTest'],
          except: ['deepSessionTest.bar'],
        },
        mutations: {
          saveOnly(state: any, payload: any) {
            state.only = payload
          },
          saveExcept(state: any, payload: any) {
            state.except = payload
          },
        },
      },
      __cookie: {
        namespaced: true,
        state: {
          only: ['cookieTest', 'deepCookieTest'],
          except: ['deepCookieTest.bar'],
        },
        mutations: {
          saveOnly(state: any, payload: any) {
            state.only = payload
          },
          saveExcept(state: any, payload: any) {
            state.except = payload
          },
        },
      },
    },
    mutations: {
      saveLocalTest(state, payload) {
        state.localTest = payload
      },
      saveSessionTest(state, payload) {
        state.sessionTest = payload
      },
      saveCookieTest(state, payload) {
        state.cookieTest = payload
      },
    },
  }
  beforeEach('set storage', () => {

    // for default key
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
    // for sec key
    window.localStorage.setItem(keySec, JSON.stringify({
      localTest: 'test',
      deepLocalTest: {
        foo: 'foo',
        bar: 'bar',
      },
    }))
    window.sessionStorage.setItem(keySec, JSON.stringify({
      sessionTest: 'test',
      deepSessionTest: {
        foo: 'foo',
        bar: 'bar',
      },
    }))
    cookies.set(keySec, {
      cookieTest: 'test',
      deepCookieTest: {
        foo: 'foo',
        bar: 'bar',
      },
    }, {path: '/'})
  })
  afterEach('clear storage & global value', () => {
    window.sessionStorage.clear()
    window.localStorage.clear()
    cookies.remove(key, {path: '/'})
    cookies.remove(keySec, {path: '/'})
    delete window.onNuxtReady
    delete process.server
  })
  describe('plugin', function test() {
    it('should not run plugin twice', () => {
      const twice = () => {
        const vuexStorage = new VuexStorage(vuexStorageOptions)
        const test = new Vuex.Store({
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
      const localTestData = 'localTest'
      const sessionTestData = 'sessionTest'
      const cookieTestData = 'cookieTest'
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        clientSide: () => (true),
      })
      const store = new Vuex.Store({
        ...cloneDeep(state),
        plugins: [
          vuexStorage.plugin,
        ],
      })
      store.commit('saveLocalTest', localTestData)
      expect(JSON.parse(localStorage.getItem(key) || '').localTest).to.equal(localTestData)
      store.commit('saveSessionTest', sessionTestData)
      expect(JSON.parse(sessionStorage.getItem(key) || '').sessionTest).to.equal(sessionTestData)
      store.commit('saveCookieTest', cookieTestData)
      expect(cookies.get(key).cookieTest).to.equal(cookieTestData)
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
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        key: keySec,
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
    it('should not restore if restore is false', function test() {
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
        ...vuexStorageOptions,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        modules: {
          ...state.modules,
          __local: {},
          __session: {},
          __cookie: {},
        },
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
    it('should restore with only except options', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        modules: {
          ...state.modules,
          __local: {
            state: {
              except: ['deepLocalTest.bar'],
            },
          },
          __session: {
            state: {
              except: ['deepSessionTest.bar'],
            },
          },
          __cookie: {
            state: {
              except: ['deepCookieTest.bar'],
            },
          },
        },
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
    it('should restore state with storage first false', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        storageFirst: false,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        modules: {
          deepLocalTest: {
            namespaced: true,
            state: {
              foo: null,
              bar: 'bar',
            },
          },
          deepSessionTest: {
            namespaced: true,
            state: {
              foo: null,
              bar: 'bar',
            },
          },
          deepCookieTest: {
            namespaced: true,
            state: {
              foo: null,
              bar: 'bar',
            },
          },
          __local: {
            namespaced: true,
            state: {
              only: ['localTest', 'deepLocalTest'],
            },
          },
          __session: {
            namespaced: true,
            state: {
              only: ['sessionTest', 'deepSessionTest'],
            },

          },
          __cookie: {
            namespaced: true,
            state: {
              only: ['cookieTest', 'deepCookieTest'],
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
    it('should restore state with storage first false & strict true', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
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
              bar: 'bar',
            },
          },
          deepSessionTest: {
            state: {
              foo: null,
              bar: 'bar',
            },
          },
          deepCookieTest: {
            state: {
              foo: null,
              bar: 'bar',
            },
          },
          __local: {
            namespaced: true,
            state: {
              only: ['localTest', 'deepLocalTest'],
            },

          },
          __session: {
            namespaced: true,
            state: {
              only: ['sessionTest', 'deepSessionTest'],
            },

          },
          __cookie: {
            namespaced: true,
            state: {
              only: ['cookieTest', 'deepCookieTest'],
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
    it('should restore after calling onNuxtReady', function test() {
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
      // noinspection JSUnusedAssignment
      expect(_callback).to.be.a('function')
      // noinspection JSUnusedAssignment
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
    it('should restore state with dynamic filter', function test() {
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        strict: true,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        modules: {
          ...state.modules,
          __local: {
            namespaced: true,
            state: {
              only: [],
            },
            mutations: {
              saveOnly(state, payload) {
                state.only = payload
              },
            },
          },
          __cookie: {
            namespaced: true,
            state: {
              only: [],
            },
            mutations: {
              saveOnly(state, payload) {
                state.only = payload
              },
            },
          },
          __session: {
            namespaced: true,
            state: {
              only: [],
            },
            mutations: {
              saveOnly(state, payload) {
                state.only = payload
              },
            },
          },
        },
        mutations: {
          ...state.mutations,
          [vuexStorage.mutationName]: vuexStorage.mutation,
        },
        strict: true,
      })

      // local
      expect(store.state.localTest).to.equal(null)
      expect(store.state.deepLocalTest.foo).to.equal(null)
      expect(store.state.deepLocalTest.bar).to.equal(null)
      store.commit('deepLocalTest/saveFoo', 'foo')
      expect(JSON.parse(localStorage.getItem(key) || '').deepLocalTest).to.be.an('undefined')
      store.commit('__local/saveOnly', ['deepLocalTest'])
      expect(JSON.parse(localStorage.getItem(key) || '').deepLocalTest.foo).to.equal('foo')

      // cookie
      expect(store.state.cookieTest).to.equal(null)
      expect(store.state.deepCookieTest.foo).to.equal(null)
      expect(store.state.deepCookieTest.bar).to.equal(null)
      store.commit('deepCookieTest/saveFoo', 'foo')
      expect(cookies.get(key).deepCookieTest).to.be.an('undefined')
      store.commit('__cookie/saveOnly', ['deepCookieTest'])
      expect(cookies.get(key).deepCookieTest.foo).to.equal('foo')

      // session
      expect(store.state.sessionTest).to.equal(null)
      expect(store.state.deepSessionTest.foo).to.equal(null)
      expect(store.state.deepSessionTest.bar).to.equal(null)
      store.commit('deepSessionTest/saveFoo', 'foo')
      expect(JSON.parse(sessionStorage.getItem(key) || '').deepSessionTest).to.be.an('undefined')
      store.commit('__session/saveOnly', ['deepSessionTest'])
      expect(JSON.parse(sessionStorage.getItem(key) || '').deepSessionTest.foo).to.equal('foo')
    })
  })
  describe('restore filter', function test() {
    it('should restore filter state', function test() {
      window.localStorage.setItem(filtersKey, JSON.stringify({
        __local: {
          only: ['localTest', 'deepLocalTest'],
          except: ['deepLocalTest.bar'],
        },
        __session: {
          only: ['sessionTest', 'deepSessionTest'],
          except: ['deepSessionTest.bar'],
        },
        __cookie: {
          only: ['cookieTest', 'deepCookieTest'],
          except: ['deepCookieTest.bar'],
        },
      }))
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        modules: {
          ...state.modules,
          __local: {},
          __session: {},
          __cookie: {},
        },
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
  })
  describe('save', function test() {
    const CHANGE_RESULT = 'testDone'
    const CHANGE_LOCAL_TEST = 'changeLocalTest'
    const CHANGE_SESSION_TEST = 'changeSessionTest'
    const CHANGE_COOKIE_TEST = 'changeCookieTest'
    const mutations = {
      ...state.mutations,
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
    }
    it('should save', function test() {
      const vuexStorage = new VuexStorage(vuexStorageOptions)
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        mutations,
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
      expect(JSON.parse(window.localStorage.getItem(key) || '')).to.deep.equal({
        localTest: CHANGE_RESULT,
        deepLocalTest: {
          foo: CHANGE_RESULT,
        },
      })
      expect(JSON.parse(window.sessionStorage.getItem(key) || '')).to.deep.equal({
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
    it('should save with dynamic filter', function test() {
      const vuexStorage = new VuexStorage(vuexStorageOptions)
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        mutations,
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
      expect(JSON.parse(window.localStorage.getItem(key) || '')).to.deep.equal({
        localTest: CHANGE_RESULT,
        deepLocalTest: {
          foo: CHANGE_RESULT,
        },
      })
      expect(JSON.parse(window.sessionStorage.getItem(key) || '')).to.deep.equal({
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
      store.commit('__local/saveExcept', [])
      store.commit('__session/saveExcept', [])
      store.commit('__cookie/saveExcept', [])
      expect(JSON.parse(window.localStorage.getItem(key) || '')).to.deep.equal({
        localTest: CHANGE_RESULT,
        deepLocalTest: {
          foo: CHANGE_RESULT,
          bar: CHANGE_RESULT,
        },
      })
      expect(JSON.parse(window.sessionStorage.getItem(key) || '')).to.deep.equal({
        sessionTest: CHANGE_RESULT,
        deepSessionTest: {
          foo: CHANGE_RESULT,
          bar: CHANGE_RESULT,
        },
      })
      expect(cookies.get(key)).to.deep.equal({
        cookieTest: CHANGE_RESULT,
        deepCookieTest: {
          foo: CHANGE_RESULT,
          bar: CHANGE_RESULT,
        },
      })
    })
  })
  describe('save filter', function test() {
    it('should restore filter state', function test() {
      window.localStorage.setItem(filtersKey, JSON.stringify({
        __local: {
          only: ['localTest', 'deepLocalTest'],
          except: ['deepLocalTest.bar'],
        },
        __session: {
          only: ['sessionTest', 'deepSessionTest'],
          except: ['deepSessionTest.bar'],
        },
        __cookie: {
          only: ['cookieTest', 'deepCookieTest'],
          except: ['deepCookieTest.bar'],
        },
      }))
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        modules: {
          ...state.modules,
          __local: {
            namespaced: true,
            mutations: {
              saveOnly(state: any, payload: any) {
                state.only = payload
              },
              saveExcept(state: any, payload: any) {
                state.except = payload
              },
            },
          },
          __session: {
            namespaced: true,
            mutations: {
              saveOnly(state: any, payload: any) {
                state.only = payload
              },
              saveExcept(state: any, payload: any) {
                state.except = payload
              },
            },
          },
          __cookie: {
            namespaced: true,
            mutations: {
              saveOnly(state: any, payload: any) {
                state.only = payload
              },
              saveExcept(state: any, payload: any) {
                state.except = payload
              },
            },
          },
        },
      })
      store.commit('__local/saveOnly', ['deepLocalTest'])
      store.commit('__session/saveOnly', ['deepSessionTest'])
      store.commit('__cookie/saveOnly', ['deepCookieTest'])
      const filter = JSON.parse(window.localStorage.getItem(filtersKey) || '')
      expect(filter.__local).to.deep.equal({
        only: ['deepLocalTest'],
        except: ['deepLocalTest.bar'],
      })
      expect(filter.__session).to.deep.equal({
        only: ['deepSessionTest'],
        except: ['deepSessionTest.bar'],
      })
      expect(filter.__cookie).to.deep.equal({
        only: ['deepCookieTest'],
        except: ['deepCookieTest.bar'],
      })
    })
    it('should restore filter state with cookie & filter key options', function test() {
      const filterData = {
        __local: {
          only: ['localTest', 'deepLocalTest'],
          except: ['deepLocalTest.bar'],
        },
        __session: {
          only: ['sessionTest', 'deepSessionTest'],
          except: ['deepSessionTest.bar'],
        },
        __cookie: {
          only: ['cookieTest', 'deepCookieTest'],
          except: ['deepCookieTest.bar'],
        },
      }
      const filterSaveKey = 'vfk'
      cookies.set(filterSaveKey, filterData)
      const vuexStorage = new VuexStorage({
        ...vuexStorageOptions,
        filterSaveMethod: 'cookie',
        filterSaveKey,
      })
      const store = new Vuex.Store<any>({
        ...cloneDeep(state),
        plugins: [vuexStorage.plugin],
        modules: {
          ...state.modules,
          __local: {
            namespaced: true,
            mutations: {
              saveOnly(state: any, payload: any) {
                state.only = payload
              },
              saveExcept(state: any, payload: any) {
                state.except = payload
              },
            },
          },
          __session: {
            namespaced: true,
            mutations: {
              saveOnly(state: any, payload: any) {
                state.only = payload
              },
              saveExcept(state: any, payload: any) {
                state.except = payload
              },
            },
          },
          __cookie: {
            namespaced: true,
            mutations: {
              saveOnly(state: any, payload: any) {
                state.only = payload
              },
              saveExcept(state: any, payload: any) {
                state.except = payload
              },
            },
          },
        },
      })
      store.commit('__local/saveOnly', ['deepLocalTest'])
      store.commit('__session/saveOnly', ['deepSessionTest'])
      store.commit('__cookie/saveOnly', ['deepCookieTest'])
      const filter = cookies.get(filterSaveKey)
      expect(filter.__local).to.deep.equal({
        only: ['deepLocalTest'],
        except: ['deepLocalTest.bar'],
      })
      expect(filter.__session).to.deep.equal({
        only: ['deepSessionTest'],
        except: ['deepSessionTest.bar'],
      })
      expect(filter.__cookie).to.deep.equal({
        only: ['deepCookieTest'],
        except: ['deepCookieTest.bar'],
      })
    })
  })
  describe('nuxtServerInit', () => {
    const that: any = {}
    const resCookie = serialize('other', JSON.stringify({test: 'test'}))
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
        setHeader(name: string) {
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
