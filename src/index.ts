import {cloneDeep, merge, omit, pick} from 'lodash'
import Cookies from 'universal-cookie'
import {Mutation, Store} from 'vuex'
import {Plugin} from 'vuex'
export interface IVuexStorageOptions {
  cookie?: IFilterOptions
  isRestore?: boolean
  isRun?: boolean
  isStrictMode?: boolean
  key?: string
  local?: IFilterOptions
  mutationName?: string
  session?: IFilterOptions
  storageFirst?: boolean
}
export interface IFilterOptions {
  except?: string[]
  only?: string[]
}

// saving mutation name
function storeExceptOrOnly(state: any, except?: string[], only?: string[]): any {
  let clonedState: any = {}
  if(except){
    clonedState = omit(state, except)
  }else{
    clonedState = state
  }
  if(only){
    clonedState = pick(clonedState, only)
  }
  return clonedState
}

export default class VuexStorage<S extends any> {
  readonly mutation: Mutation<S>
  readonly plugin: Plugin<S>
  readonly save: (state: any) => void

  constructor(options: IVuexStorageOptions = {}) {
    const {
      cookie = {},
      isRestore = true,
      isRun = true,
      isStrictMode = false,
      key = 'vuex',
      local = {},
      mutationName = '__RESTORE_MUTATION',
      session = {},
      storageFirst = false,
    } = options
    const cookies = new Cookies()

    this.mutation = function(state: S, payload: any) {
      // eslint-disable-next-line consistent-this
      const that: any = this
      Object.keys(payload).forEach((moduleKey: string) => {
        let targetState, srcState, storageData
        targetState = state[moduleKey]
        srcState = payload[moduleKey]
        if(typeof targetState === 'object' && targetState !== null){
          if(!storageFirst){
            targetState = state[moduleKey]
            srcState = payload[moduleKey]
          }
          storageData = merge(targetState, srcState)
        }else if(storageFirst && targetState){
          storageData = targetState
        }else{
          storageData = srcState
        }
        that._vm.$set(state, moduleKey, storageData)
      })
    }

    this.save = (state: any) => {
      const {sessionStorage, localStorage} = window
      sessionStorage.setItem(key,
        JSON.stringify(storeExceptOrOnly(state, session.except, session.only)))
      localStorage.setItem(key,
        JSON.stringify(storeExceptOrOnly(state, local.except, local.only)))
      cookies.set(key, storeExceptOrOnly(state, cookie.except, cookie.only), {path: '/'})
    }

    const plugin = (store: Store<S>) => {
      const {sessionStorage, localStorage} = window
      // saving store

      if(isRestore){
        const sessionData = sessionStorage.getItem(key) || '{}'
        const localData = localStorage.getItem(key) || '{}'

        const sessionState = JSON.parse(sessionData)
        const localState = JSON.parse(localData)
        const cookiState = cookies.get(key) || {}

        let state = merge(sessionState, localState, cookiState)

        console.log(state, cookiState)

        if(isStrictMode){
          store.commit(mutationName, state)
        }else{
          let data
          if(storageFirst){
            data = merge(state, store.state)
          }else{
            data = merge(store.state, state)
          }
          store.replaceState(data)
        }
      }

      this.save(store.state)
      store.subscribe((mutation, state) => {
        this.save(state)
      })
    }

    this.plugin = (store: Store<S>) => {

      if(!isRun){
        return
      }

      if(window.onNuxtReady){
        window.onNuxtReady(() => (plugin(store)))
      }else{
        plugin(store)
      }
    }
  }
}
