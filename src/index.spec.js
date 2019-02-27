/* eslint-disable no-global-assign */
import VuexStorage from './'
import Vuex from 'vuex'
import Vue from 'vue'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
describe('vuex-storage', () => {
  if(!window.process){
    window.process = {}
  }
  Vue.config.productionTip = false
  Vue.config.devtools = false
  Vue.use(Vuex)
  let store
  const key = 'test'
  beforeEach(() => {
    window.sessionStorage.setItem(key, '{"test":"test"}')
    window.localStorage.setItem(key, '{"test":"test"}')
  })
  afterEach(() => {
    window.sessionStorage.setItem(key, '{}')
    window.localStorage.setItem(key, '{}')
    cookies.remove(key, {path: '/'})
    delete window.onNuxtReady
  })
  describe('local', () => {
    it('should init', () => {

      const vuexStorage = new VuexStorage({
        key,
        session: {
          except: [],
        },
        local: {
          only: ['test'],
        },
      })
      store = new Vuex.Store({
        state: {
          test: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.test).to.equal('test')
    })

    it('should init in the off storage data first option', () => {
      window.localStorage.setItem(key, '{"test":"test", "test2": "test2"}')
      const vuexStorage = new VuexStorage({
        key,
        session: {
          except: [],
        },
        local: {
          only: ['test', 'test2'],
        },
        storageFirst: true,
      })
      store = new Vuex.Store({
        state: {
          test: 'initTest',
          // eslint-disable-next-line no-undefined
          test2: undefined,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      expect(store.state.test).to.equal('initTest')
      expect(store.state.test2).to.equal('test2')
    })

    it('should save changed state', () => {
      const vuexStorage = new VuexStorage({
        key,
        local: {
          only: ['test'],
        },
      })
      store = new Vuex.Store({
        state: {
          test: null,
          noTest: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
            state.noTest = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      store.commit('changeTest')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(store.state.test).to.equal('testDone')
    })
    it('should save with deep setting', () => {
      window.sessionStorage.setItem(key, '{}')
      window.localStorage.setItem(key, '{}')
      const vuexStorage = new VuexStorage({
        key,
        local: {
          only: ['test.foo'],
        },
      })
      const store = new Vuex.Store({
        state: {
          noTest: null,
        },
        modules: {
          test: {
            state: {
              foo: 'foo',
              bar: 'bar',
            },
          },
        },
        mutations: {
          changeTest(state) {
            state.test.foo = 'testDone'
            state.noTest = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      store.commit('changeTest')
      expect(window.localStorage.getItem(key)).to.equal('{"test":{"foo":"testDone"}}')
      expect(store.state.test.foo).to.equal('testDone')
      expect(store.state.noTest).to.equal('testDone')
    })
    it('should save changed state by an except option', () => {
      const vuexStorage = new VuexStorage({
        key,
        local: {
          except: ['test'],
        },
      })
      store = new Vuex.Store({
        state: {
          test: null,
          noTest: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
            state.noTest = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      store.commit('changeTest')
      expect(window.localStorage.getItem(key)).to.equal('{"noTest":"testDone"}')
      expect(store.state.test).to.equal('testDone')
    })
  })

  describe('session', () => {
    it('should save changed state by only', () => {
      const vuexStorage = new VuexStorage({
        key,
        session: {
          only: ['test'],
        },
      })
      store = new Vuex.Store({
        state: {
          test: null,
          noTest: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
            state.noTest = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      store.commit('changeTest')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(store.state.test).to.equal('testDone')
    })
    it('should save changed state by except', () => {

      const vuexStorage = new VuexStorage({
        key,
        session: {
          except: ['test'],
        },
      })
      store = new Vuex.Store({
        state: {
          test: null,
          noTest: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
            state.noTest = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      store.commit('changeTest')
      expect(window.sessionStorage.getItem(key)).to.equal('{"noTest":"testDone"}')
      expect(store.state.test).to.equal('testDone')
    })
  })
  describe('cookie', () => {
    it('should save changed state by only', () => {
      const vuexStorage = new VuexStorage({
        key,
        cookie: {
          only: ['test'],
        },
      })
      store = new Vuex.Store({
        state: {
          test: null,
          noTest: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
            state.noTest = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      store.commit('changeTest')
      expect(cookies.get(key)).to.deep.equal({test: 'testDone'})
      expect(store.state.test).to.equal('testDone')
    })
    it('should save changed state by except', () => {
      const vuexStorage = new VuexStorage({
        key,
        cookie: {
          except: ['test'],
        },
      })
      store = new Vuex.Store({
        state: {
          test: null,
          noTest: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
            state.noTest = 'testDone'
          },
        },
        plugins: [vuexStorage.plugin],
      })
      store.commit('changeTest')
      expect(cookies.get(key)).to.deep.equal({noTest: 'testDone'})
      expect(store.state.test).to.equal('testDone')
    })
  })
  describe('supporting nuxt', () => {
    it('should not run with isRun option', () => {
      const vuexStorage = new VuexStorage({
        key,
        isRun: false,
      })
      store = new Vuex.Store({
        state: {
          test: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          },
        },
        plugins: [
          vuexStorage.plugin,
        ],
      })
      expect(store.state.test).to.equal(null)
      store.commit('changeTest')
      expect(store.state.test).to.equal('testDone')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"test"}')
    })
    it('should run with onNuxtReady', () => {
      let calledOnnNuxtReady = false
      // mocking window.onNuxtReady
      window.onNuxtReady = (fn) => {
        if(!calledOnnNuxtReady){
          fn()
        }
        calledOnnNuxtReady = true
      }
      const vuexStorage = new VuexStorage({
        key,
        isRun: true,
        session: {
          except: [],
        },
        local: {
          except: [],
        },
      })
      store = new Vuex.Store({
        strict: false,
        state: {
          test: null,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          },
        },
        plugins: [
          vuexStorage.plugin,
        ],
      })
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(store.state.test).to.equal('test')
      store.commit('changeTest')
      expect(store.state.test).to.equal('testDone')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(calledOnnNuxtReady).to.equal(true)
    })
  })
  describe('strict mode', () => {
    it('should inti by storage', () => {
      const mutationName = '__MyMutation'
      const vuexStorage = new VuexStorage({
        key,
        mutationName,
        isStrictMode: true,
        session: {
          except: [],
        },
        local: {
          except: [],
        },
      })
      store = new Vuex.Store({
        strict: true,
        state: {
          // eslint-disable-next-line no-undefined
          test: undefined,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          },
          [mutationName]: vuexStorage.mutation,
        },
        plugins: [
          vuexStorage.plugin,
        ],
      })
      expect(store.state.test).to.equal('test')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"test"}')
      store.commit('changeTest')
      expect(store.state.test).to.equal('testDone')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"testDone"}')
    })
    it('should inti by storage with storageFirst option', () => {
      window.sessionStorage.setItem(key, '{"test":"test","test2":"test2"}')
      window.localStorage.setItem(key, '{"test":"test","test2":"test2"}')
      const mutationName = '__MyMutation'
      const vuexStorage = new VuexStorage({
        key,
        mutationName,
        isStrictMode: true,
        storageFirst: true,
        session: {
          except: [],
        },
        local: {
          except: [],
        },
      })
      store = new Vuex.Store({
        strict: true,
        state: {
          test: 'testBase',
          // eslint-disable-next-line no-undefined
          test2: undefined,
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          },
          [mutationName]: vuexStorage.mutation,
        },
        plugins: [
          vuexStorage.plugin,
        ],
      })
      expect(store.state.test).to.equal('testBase')
      expect(store.state.test2).to.equal('test2')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testBase","test2":"test2"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"testBase","test2":"test2"}')
      store.commit('changeTest')
      expect(store.state.test).to.equal('testDone')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testDone","test2":"test2"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"testDone","test2":"test2"}')
    })
  })
})
