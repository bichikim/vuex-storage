/* eslint-disable no-global-assign */
import vuexStorage from './'
import Vuex from 'vuex'
import Vue from 'vue'
describe('my-typescript', () => {
  if(!window.process){
    window.process = {}
  }
  process.client = true
  Vue.config.productionTip = false
  Vue.config.devtools = false
  Vue.use(Vuex)
  let store
  const key = 'test'
  describe('use case 1', () => {
    it('should init', () => {
      window.sessionStorage.setItem(key, '{"test":"test"}')
      window.localStorage.setItem(key, '{"test":"test"}')
      store = new Vuex.Store({
        state: {
          test: null
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          }
        },
        plugins: [
          vuexStorage({
            key,
            session: {
              except: [],
            },
            local: {
              only: ['test'],
            }
          }),
        ]
      })
      expect(store.state.test).to.equal('test')
    })

    it('should save changed state', () => {
      window.sessionStorage.setItem(key, '{"test":"test"}')
      window.localStorage.setItem(key, '{"test":"test"}')
      store = new Vuex.Store({
        state: {
          test: null
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          }
        },
        plugins: [
          vuexStorage({
            key,
            session: {
              except: [],
            },
            local: {
              only: ['test'],
            }
          }),
        ]
      })
      store.commit('changeTest')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(store.state.test).to.equal('testDone')
    })
  })

  describe('use case 2', () => {
    it('should save changed state', () => {
      window.sessionStorage.setItem(key, '{"test":"test"}')
      window.localStorage.setItem(key, '{"test":"test"}')
      store = new Vuex.Store({
        state: {
          test: null
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          }
        },
        plugins: [
          vuexStorage({
            key,
            session: {
              except: [],
            },
            local: {
            }
          }),
        ]
      })
      store.commit('changeTest')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"testDone"}')
      expect(window.localStorage.getItem(key)).to.equal('{}')
      expect(store.state.test).to.equal('testDone')
    })
  })
  describe('use case 3', () => {
    it('should save changed state', () => {
      process.client = false
      window.sessionStorage.setItem(key, '{"test":"test"}')
      window.localStorage.setItem(key, '{"test":"test"}')
      store = new Vuex.Store({
        state: {
          test: null
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          }
        },
        plugins: [
          vuexStorage(),
        ]
      })
      store.commit('changeTest')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(store.state.test).to.equal('testDone')
    })
  })
  describe('use case 4', () => {
    it('should save changed state', () => {
      process.client = false
      window.sessionStorage.setItem(key, '{"test":"test"}')
      window.localStorage.setItem(key, '{"test":"test"}')
      store = new Vuex.Store({
        state: {
          test: null
        },
        mutations: {
          changeTest(state) {
            state.test = 'testDone'
          }
        },
        plugins: [
          vuexStorage({
          }),
        ]
      })
      store.commit('changeTest')
      expect(window.sessionStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(window.localStorage.getItem(key)).to.equal('{"test":"test"}')
      expect(store.state.test).to.equal('testDone')
    })
  })
})
