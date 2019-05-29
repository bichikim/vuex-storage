import {Request, Response} from 'express'
import {cloneDeep, merge, omit, pick} from 'lodash'
import {ActionContext, Mutation, Store} from 'vuex'
import {Plugin} from 'vuex'
import Cookies, {CookieSerializeOptions} from './cookie'
export interface INuxtContext {
  req: Request,
  res: Response,
}

export interface IFilters {
  /**
   * cookie storage
   */
  cookie?: IFilterOptions
  /**
   * session storage
   */
  session?: IFilterOptions
  /**
   * local storage
   */
  local?: IFilterOptions
}

export interface IDynamicFilterObj {
  cookie?: string
  session?: string
  local?: string
}

export type DynamicFilterFn<S> = (store: Store<S>, options: IVuexStorageOptions<S>) => IFilters

export interface IVuexStorageOptions<S> {

  /**
   * override cookie, session and local by state
   */
  filter?: DynamicFilterFn<S> | IDynamicFilterObj

  /**
   * restore data from client storage
   */
  restore?: boolean
  /**
   * supporting vuex strict
   */
  strict?: boolean
  /**
   * override storage data to state
   * @default false
   */
  storageFirst?: boolean
  key?: string
  mutationName?: string
  clientSide?: ((store: Store<S>, options: IVuexStorageOptions<S>) => boolean) | boolean
  /**
   * @deprecated
   */
  isRun?: boolean
  /**
   * @deprecated
   * please use restore
   */
  isRestore?: boolean
  /**
   * @deprecated
   * please use strict
   */
  isStrictMode?: boolean
}
export interface IFilterOptions {
  except?: string[]
  only?: string[]
  options?: CookieSerializeOptions
}

// saving mutation name
function storeExceptOrOnly(_state: any, except?: string[], only?: string[]): any {
  const state = cloneDeep(_state)
  let clonedState = {}
  if(!only && !except){
    return clonedState
  }
  if(only){
    clonedState = pick(state, only)
  }else{
    clonedState = state
  }
  if(except){
    clonedState = omit(clonedState, except)
  }

  return clonedState
}

export default class VuexStorage<S extends any> {
  readonly mutationName: string
  readonly mutation: Mutation<S>
  readonly plugin: Plugin<S>
  readonly restore: (context?: INuxtContext) => void
  readonly save: (state: any, context?: INuxtContext) => void
  readonly clear: () => void
  readonly nuxtServerInit: (actionContext: ActionContext<S, S>, nuxtContext: INuxtContext) => void
  private _store: Store<S>

  constructor(options: IVuexStorageOptions<S> = {}) {
    const {
      restore = true,
      isRun,
      strict = false,
      key = 'vuex',
      mutationName = '__RESTORE_MUTATION',
      storageFirst = true,
      filter: dynamicFilter,
      clientSide,
    } = options

    /* istanbul ignore if */
    if(isRun){
      console.warn('please do not use the isRun option')
    }

    const isClient = (): boolean => {
      if(typeof clientSide === 'function'){
        return clientSide(this._store, options)
      }
      if(typeof clientSide === 'boolean'){
        return clientSide
      }
      return typeof document === 'object'
    }

    const getStateFilter = (dynamicFilter: IDynamicFilterObj): IFilters => {
      return {
        cookie: this._store.state[dynamicFilter.cookie],
        session: this._store.state[dynamicFilter.session],
        local: this._store.state[dynamicFilter.local],
      }
    }

    const filters = (): IFilters => {
      if(!dynamicFilter){
        return {}
      }

      return  typeof dynamicFilter === 'function' ?
        dynamicFilter(this._store, options) :
        getStateFilter(dynamicFilter)
    }

    this.mutationName = mutationName

    this.mutation = function(state: S, payload: any) {
      // eslint-disable-next-line consistent-this
      const that: any = this
      Object.keys(payload).forEach((moduleKey: string) => {
        that._vm.$set(state, moduleKey, payload[moduleKey])
      })
    }

    this.clear = (context?: INuxtContext) => {
      const cookies = new Cookies(context, isClient())
      cookies.set(key, {}, {path: '/'})

      if(!isClient()){return}
      const {sessionStorage, localStorage} = window
      sessionStorage.setItem(key, '{}')
      localStorage.setItem(key, '{}')
    }

    this.restore = (context?: INuxtContext) => {
      const store = this._store
      let cookieState = {}
      const {cookie, session, local} = filters()
      if(cookie){
        const cookies = new Cookies(context, isClient())
        cookieState = storeExceptOrOnly(cookies.get(key), cookie.except, cookie.only)
      }

      let sessionState = {}
      let localState = {}
      if(isClient()){
        const {sessionStorage, localStorage} = window
        let sessionData = '{}'
        let localData = '{}'
        if(session){
          sessionData = sessionStorage.getItem(key)
            || /* istanbul ignore next: tired of writing tests */ '{}'
          sessionState = storeExceptOrOnly(JSON.parse(sessionData), session.except, session.only)
        }
        if(local){
          localData = localStorage.getItem(key)
            ||  /* istanbul ignore next: tired of writing tests */ '{}'
          localState = storeExceptOrOnly(JSON.parse(localData), local.except, local.only)
        }
      }

      let state: any = merge(sessionState, localState, cookieState)
      const originalState = cloneDeep(store.state)
      if(storageFirst){
        state = merge(originalState, state)
      }else{
        state = merge(state, originalState)
      }

      if(strict){
        store.commit(mutationName, state)
      }else{
        store.replaceState(state)
      }
    }

    this.save = (state: any, context?: INuxtContext) => {
      this.clear()
      const {cookie, session, local} = filters()
      const cookies = new Cookies(context, isClient())
      if(cookie && cookies){
        /* istanbul ignore next */
        const {
          options = {},
        } = cookie
        cookies.set(
          key,
          storeExceptOrOnly(
            state,
            cookie.except,
            cookie.only,
          ),
          {path: '/', ...options})
      }

      if(!isClient()){return}
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

    this.nuxtServerInit = (actionContext: ActionContext<S, S>, nuxtContext: INuxtContext) => {
      if(restore){
        this.restore(nuxtContext)
      }
      this.save(this._store.state, nuxtContext)
    }

    this.plugin = (store: Store<S>) => {
      if(this._store){
        throw new Error('plugin install twice')
      }
      this._store = store
      const plugin = (store: Store<S>) => {
        // restore state
        if(restore){
          this.restore()
        }

        this.save(store.state)
        store.subscribe((mutation, state) => {
          this.save(state)
        })
      }
      if(isClient() && window.onNuxtReady){
        window.onNuxtReady(() => (plugin(store)))
        return
      }
      if(process.server){
        return
      }
      plugin(store)
    }
  }
}
