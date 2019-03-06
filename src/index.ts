import {cloneDeep, merge, omit, pick} from 'lodash'
import {Mutation, Store} from 'vuex'
import {Plugin} from 'vuex'
import Cookies from './cookie'
interface INuxtContext {
  req: Request,
  res: Response,
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
  private _cookies?: Cookies

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

    this.clear = () => {
      if(window){
        const {sessionStorage, localStorage} = window
        sessionStorage.setItem(key, '{}')
        localStorage.setItem(key, '{}')
      }
      if(this._cookies){
        this._cookies.set(key, {}, {path: '/'})
      }
    }

    this.restore = (store: Store<S>, context?: INuxtContext) => {
      const cookieState = this._cookies ? this._cookies.get(key) : {}
      let sessionState = {}
      let localState = {}
      if(window){
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
      if(cookie && this._cookies){
        this._cookies.set(key, storeExceptOrOnly(state, cookie.except, cookie.only), {path: '/'})
      }

      if(!window){
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

    const plugin = (store: Store<S>, context?: INuxtContext) => {
      this._cookies = new Cookies(context)
      // saving store

      if(isRestore){
        this.restore(store, context)
      }

      this.save(store.state, context)
      store.subscribe((mutation, state) => {
        this.save(state, context)
      })
    }

    this.plugin = (store: Store<S>, context?: INuxtContext) => {
      if(window && window.onNuxtReady){
        window.onNuxtReady(() => (plugin(store)))
        return
      }
      plugin(store, context)
    }
  }
}
