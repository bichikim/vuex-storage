import {cloneDeep, merge, omit, pick} from 'lodash'
import {Mutation, Store} from 'vuex'
import {Plugin} from 'vuex'
export interface IVuexStorageOptions {
  isRun?: boolean
  isRestore?: boolean,
  isStrictMode?: boolean,
  session?: IFilterOptions
  mutationName?: string
  local?: IFilterOptions
  key?: string
  storageFirst?: boolean
}

export interface IFilterOptions {
  except?: string[],
  only?: string[],
}
// saving mutation name
function storeExceptOrOnly(state: any, except?: string[], only?: string[]): any {
  let clonedState: any = {}
  if(except){
    clonedState = omit(cloneDeep(state), except)
  }else if(only){
    clonedState = pick(cloneDeep(state), only)
  }
  return clonedState
}

export default class VuexStorage<S extends any> {
  readonly key: string
  readonly session: IFilterOptions
  readonly local: IFilterOptions
  readonly isRestore: boolean
  readonly isStrictMode: boolean
  readonly mutationName: string
  readonly mutation: Mutation<S>
  readonly plugin: Plugin<S>
  readonly storageFirst: boolean
  readonly save: (state: any) => void
  isRun: boolean

  constructor(options: IVuexStorageOptions = {}) {
    const {
      isRun = true,
      key = 'vuex',
      session = {},
      local = {},
      isRestore = true,
      isStrictMode = false,
      mutationName = '__RESTORE_MUTATION',
      storageFirst = false,
    } = options
    this.key = key
    this.session = session
    this.local = local
    this.isRestore = isRestore
    this.isRun = isRun
    this.isStrictMode = isStrictMode
    this.mutationName = mutationName
    this.storageFirst = storageFirst
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
      sessionStorage.setItem(this.key,
        JSON.stringify(storeExceptOrOnly(state, this.session.except, this.session.only)))
      localStorage.setItem(this.key,
        JSON.stringify(storeExceptOrOnly(state, this.local.except, this.local.only)))
    }

    const plugin = (store: Store<S>) => {
      const {sessionStorage, localStorage} = window
      // saving store

      if(this.isRestore){
        const sessionData = sessionStorage.getItem(this.key) || '{}'
        const localData = localStorage.getItem(this.key) || '{}'

        const sessionState = JSON.parse(sessionData)
        const localState = JSON.parse(localData)

        let state = sessionState
        if(typeof localState === 'object' && typeof sessionState === 'object'){
          state = merge(sessionState, localState)
        }else if(typeof localState === 'string' || typeof localState === 'number'){
          state = localState
        }

        if(this.isStrictMode){
          store.commit(this.mutationName, state)
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

      if(!this.isRun){
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
