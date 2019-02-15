import {cloneDeep, merge, omit, pick} from 'lodash'
import {Mutation, Store} from 'vuex'
import {Plugin} from 'vuex'
export interface IVuexStorageOptions {
  isRestore?: boolean,
  isStrictMode?: boolean,
  session?: IFilterOptions
  mutationName?: string
  local?: IFilterOptions
  key?: string
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

export default class VuexStorage<S> {
  readonly key: string
  readonly session: IFilterOptions
  readonly local: IFilterOptions
  readonly isRestore: boolean
  readonly isStrictMode: boolean
  readonly mutationName: string
  readonly mutation: Mutation<S>
  readonly plugin: Plugin<S>
  readonly save: (store: Store<S>, state: any) => void

  constructor(options: IVuexStorageOptions = {}) {
    this.key = options.key || 'vuex'
    this.session = options.session || {}
    this.local = options.local || {}
    this.isRestore = options.isRestore || true
    this.isStrictMode = options.isStrictMode || false
    this.mutationName = options.mutationName || '__RESTORE_MUTATION'
    this.mutation = function(state: S, payload: any) {
      // eslint-disable-next-line consistent-this
      const that: any = this
      Object.keys(payload).forEach((moduleKey: string) => {
        that._vm.$set(state, moduleKey, payload[moduleKey])
      })
    }
    this.save = (store: Store<S>, state: any) => {
      const {sessionStorage, localStorage} = window
      sessionStorage.setItem(this.key,
        JSON.stringify(storeExceptOrOnly(store.state, this.session.except, this.session.only)))
      localStorage.setItem(this.key,
        JSON.stringify(storeExceptOrOnly(store.state, this.local.except, this.local.only)))
    }

    const plugin = (store: Store<S>) => {
      const {sessionStorage, localStorage} = window
      // saving store

      if(this.isRestore){
        const sessionData = sessionStorage.getItem(this.key) || '{}'
        const localData = localStorage.getItem(this.key) || '{}'

        const sessionState = JSON.parse(sessionData)
        const localState = JSON.parse(localData)

        if(this.isStrictMode){
          store.commit(this.mutationName, sessionState)
        }else{
          store.replaceState(merge(store.state, sessionState, localState))
        }
      }

      this.save(store, store.state)
      store.subscribe((mutation, state) => {
        this.save(store, state)
      })
    }

    this.plugin = (store: Store<S>) => {
      if(process.server){
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
