/* eslint-disable no-global-assign */
import VuexStorage from './'
import Vuex from 'vuex'
import Vue from 'vue'
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
  describe('nuxt', () => {
    it('should not run in nuxt server', () => {
      process.server = true
      const vuexStorage = new VuexStorage({
        key,
      })
      store = new Vuex.Store({
        state: {
          test: null,
          noTest: null,
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
    it('should run', () => {
      process.server = false
      let calledOnnNuxtReady = false
      window.onNuxtReady = (fn) => {
        calledOnnNuxtReady = true
        fn()
      }
      const vuexStorage = new VuexStorage({
        key,
        session: {
          except: [],
        },
        local: {
          except: [],
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
    it('should run', () => {
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
          test: null,
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
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"test"}')
      store.commit('changeTest')
      expect(store.state.test).to.equal('testDone')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"testDone"}')
    })
  })
})
