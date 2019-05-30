import {cloneDeep, merge, omit, pick} from 'lodash'
import {ActionContext, Mutation, Store} from 'vuex'
import {Plugin} from 'vuex'
import Cookies, {CookieSerializeOptions} from './cookie'
import {IDynamicFilterObj, IFilters, INuxtContext, IVuexStorageOptions} from './types'

export const DEFAULT_KEY = 'vuex'
export const DEFAULT_MUTATION_NAME = '__RESTORE_MUTATION'

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
      strict = false,
      key = DEFAULT_KEY,
      mutationName = DEFAULT_MUTATION_NAME,
      storageFirst = true,
      filter: dynamicFilter,
      clientSide,
    } = options

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

      // get client storage data if it is client side
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
