import {expect} from 'chai'
import {serialize} from 'cookie'
import {createRequest, createResponse} from 'node-mocks-http'
import Vue from 'vue'
import Vuex, {Store} from 'vuex'
import VuexStorage from './index'
describe('vuex-storage', () => {
  before(() => {
    Vue.use(Vuex)
  })
  it('should nuxtServerInit', async () => {
    const vuexStorage = new VuexStorage<any>()
    const key = 'key'
    const req = createRequest({
      path: '/',
      method: 'GET',
      headers: {
        cookie: serialize(key, JSON.stringify({test: {test: 'test'}})),
      },
    })
    const res = createResponse()
    const store = new Store<any>({
      plugins: [vuexStorage.plugin],
      modules: {
        test: {
          state: {
            test: '',
          },
        },
      },
      actions: {
        nuxtServerInit(store, context) {
          vuexStorage.nuxtServerInit(store, context)
        },
      },
    })
    await store.dispatch('nuxtServerInit', {
      req,
      res,
    })
    expect(store.state.test.test).to.equal('test')
  })
})
