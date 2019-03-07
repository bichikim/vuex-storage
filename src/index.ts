import {Request, Response} from 'express'
import {cloneDeep, merge, omit, pick} from 'lodash'
import {ActionContext, Mutation, Store} from 'vuex'
import {Plugin} from 'vuex'
import Cookies from './cookie'
interface INuxtContext {
  req: Request,
  res: Response,
}

const isClient = (): boolean => {
  return typeof document === 'object'
}

export interface IVuexStorageOptions {
  cookie?: IFilterOptions
  isRestore?: boolean
  /**
   * @deprecated
   */
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
function storeExceptOrOnly(_state: any, except?: string[], only?: string[]): any {
  const state = cloneDeep(_state)
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
  readonly mutationName: string
  readonly mutation: Mutation<S>
  readonly plugin: Plugin<S>
  readonly restore: (store: Store<S>, context?: INuxtContext) => void
  readonly save: (state: any, context?: INuxtContext) => void
  readonly clear: () => void
  readonly nuxtServerInit: (actionContext: ActionContext<S, S>, nuxtContext: INuxtContext) => void
  private _store: Store<S>

  constructor(options: IVuexStorageOptions = {}) {
    const {
      cookie,
      isRestore = true,
      isRun,
      isStrictMode = false,
      key = 'vuex',
      local,
      mutationName = '__RESTORE_MUTATION',
      session,
      storageFirst = false,
    } = options
    if(isRun){
      console.warn('please do not use the isRun option')
    }

    this.mutationName = mutationName

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

    this.clear = (context?: INuxtContext) => {
      if(isClient()){
        const {sessionStorage, localStorage} = window
        sessionStorage.setItem(key, '{}')
        localStorage.setItem(key, '{}')
      }
      const cookies = new Cookies(context)
      cookies.set(key, {}, {path: '/'})
    }

    this.restore = (store: Store<S>, context?: INuxtContext) => {
      const cookies = new Cookies(context)
      const cookieState = cookies.get(key)
      let sessionState = {}
      let localState = {}
      if(isClient()){
        const {sessionStorage, localStorage} = window
        const sessionData = sessionStorage.getItem(key) || '{}'
        const localData = localStorage.getItem(key) || '{}'
        sessionState = JSON.parse(sessionData)
        localState = JSON.parse(localData)
      }

      let state = merge(sessionState, localState, cookieState)

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

    this.save = (state: any, context?: INuxtContext) => {
      this.clear()
      const cookies = new Cookies(context)
      if(cookie && cookies){
        cookies.set(key, storeExceptOrOnly(state, cookie.except, cookie.only), {path: '/'})
      }

      if(!isClient()){
        return
      }
      const {sessionStorage, localStorage} = window
      if(session){
        sessionStorage.setItem(key,
          JSON.stringify(storeExceptOrOnly(state, session.except, session.only)))
      }
      if(local){
        localStorage.setItem(key,
          JSON.stringify(storeExceptOrOnly(state, local.except, local.only)))
      }
    }

    const plugin = (store: Store<S>) => {
      if(this._store){
        console.warn('plugin install twice')
      }
      this._store = store
      if(isRestore){
        this.restore(store)
      }

      this.save(store.state)
      store.subscribe((mutation, state) => {
        this.save(state)
      })
    }

    this.nuxtServerInit = (actionContext: ActionContext<S, S>, nuxtContext: INuxtContext) => {
      if(isRestore){
        this.restore(this._store, nuxtContext)
      }
      this.save(actionContext.state)
    }

    this.plugin = (store: Store<S>) => {
      if(isClient() && window.onNuxtReady){
        window.onNuxtReady(() => (plugin(store)))
        return
      }
      plugin(store)
    }
  }
}
