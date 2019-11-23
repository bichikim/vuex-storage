import {ActionContext, Mutation, Plugin, Store} from 'vuex'
import Cookies from './cookie'
import {cloneDeep, get, merge, omit, pick} from './lodash'
import {IDynamicFilterObj, IFilters, INuxtContext, IVuexStorageOptions} from './types'

export const DEFAULT_KEY = 'vuex'
export const FILTERS_KEY = 'vuex-filters'
export const DEFAULT_SAVE_METHOD = 'localStorage'
export const DEFAULT_MUTATION_NAME = '__RESTORE_MUTATION'

// saving mutation name
function storeExceptOrOnly(_state: any, except?: string[], only?: string[]): any {
  const state = cloneDeep(_state)
  let clonedState = {}
  if(!only && !except) {
    return clonedState
  }
  if(only) {
    clonedState = pick(state, only)
  } else {
    clonedState = state
  }
  if(except) {
    clonedState = omit(clonedState, except)
  }

  return clonedState
}

export default class VuexStorage<S extends any> {
  readonly mutationName: string
  readonly mutation: Mutation<S>
  readonly plugin: Plugin<S>
  readonly restore: (context?: INuxtContext) => void
  readonly restoreFilter: (context?: INuxtContext) => void
  readonly save: (state: any, context?: INuxtContext) => void
  readonly saveFilter: (state: any, context?: INuxtContext) => void
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
      filter: dynamicFilter = {},
      clientSide,
      filterSaveKey = FILTERS_KEY,
      filterSaveMethod = DEFAULT_SAVE_METHOD,
    } = options

    const isClient = (): boolean => {
      if(typeof clientSide === 'function') {
        return clientSide(this._store, options)
      }
      if(typeof clientSide === 'boolean') {
        return clientSide
      }
      return typeof document === 'object'
    }

    const getStateFilter = (dynamicFilter: IDynamicFilterObj): IFilters => {
      return {
        cookie: get<any, string>(this._store.state, dynamicFilter.cookie || ''),
        session: get<any, string>(this._store.state, dynamicFilter.session || ''),
        local: get<any, string>(this._store.state, dynamicFilter.local || ''),
      }
    }

    const filters = (): IFilters => {
      if(!dynamicFilter) {
        return {}
      }

      return getStateFilter(dynamicFilter)
    }

    this.mutationName = mutationName

    this.mutation = function (state: S, payload: any) {
      // eslint-disable-next-line consistent-this
      const {_vm}: any = this
      Object.keys(payload).forEach((moduleKey: string) => {
        _vm.$set(state, moduleKey, payload[moduleKey])
      })
    }

    this.clear = (context?: INuxtContext) => {
      const cookies = new Cookies(context, isClient())
      cookies.set(key, {}, {path: '/'})

      if(!isClient()) {
        return
      }
      const {sessionStorage, localStorage} = window
      sessionStorage.setItem(key, '{}')
      localStorage.setItem(key, '{}')
    }

    const mergeState = (state: any) => {
      const store = this._store
      let _state = state
      const originalState = cloneDeep(store.state)
      if(storageFirst) {
        _state = merge(originalState, state)
      } else {
        _state = merge(state, originalState)
      }
      if(strict) {
        store.commit(mutationName, _state)
      } else {
        store.replaceState(_state)
      }
    }

    this.restoreFilter = (context?: INuxtContext) => {
      let localState = {}
      let cookieState = {}

      if(filterSaveMethod === 'localStorage') {
        if(!isClient()) {
          return
        }
        localState = JSON.parse(localStorage.getItem(filterSaveKey) || '{}')
      } else {
        const cookies = new Cookies(context, isClient())
        cookieState = cookies.get(filterSaveKey)
      }
      mergeState(merge(localState, cookieState))
    }

    this.restore = (context?: INuxtContext) => {
      let cookieState = {}
      const {cookie, session, local} = filters()
      if(cookie) {
        const cookies = new Cookies(context, isClient())
        cookieState = storeExceptOrOnly(cookies.get(key), cookie.except, cookie.only)
      }

      let sessionState = {}
      let localState = {}

      // get client storage data if it is client side
      if(isClient()) {
        let sessionData = '{}'
        let localData = '{}'
        if(session) {
          sessionData = sessionStorage.getItem(key)
            || /* istanbul ignore next: tired of writing tests */ '{}'
          sessionState = storeExceptOrOnly(JSON.parse(sessionData), session.except, session.only)
        }
        if(local) {
          localData = localStorage.getItem(key)
            ||  /* istanbul ignore next: tired of writing tests */ '{}'
          localState = storeExceptOrOnly(JSON.parse(localData), local.except, local.only)
        }
      }
      mergeState(merge(sessionState, localState, cookieState))
    }

    this.saveFilter = (state: any, context?: INuxtContext) => {
      const filterOnly: string[] = []
      const {local: dynamicLocal, cookie: dynamicCookie, session: dynamicSession} = dynamicFilter
      if(dynamicLocal) {
        filterOnly.push(dynamicLocal)
      }
      if(dynamicCookie) {
        filterOnly.push(dynamicCookie)
      }
      if(dynamicSession) {
        filterOnly.push(dynamicSession)
      }
      if(filterSaveMethod === 'localStorage') {
        if(!isClient()) {
          return
        }
        localStorage.setItem(
          filterSaveKey,
          JSON.stringify(storeExceptOrOnly(state, undefined, filterOnly)),
        )
      } else {
        const cookies = new Cookies(context, isClient())
        cookies.set(filterSaveKey, storeExceptOrOnly(state, undefined, filterOnly), {path: '/'})
      }
    }

    this.save = (state: any, context?: INuxtContext) => {
      const {cookie, session, local} = filters()
      const cookies = new Cookies(context, isClient())
      if(cookie && cookies) {
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

      if(!isClient()) {
        return
      }
      const {sessionStorage, localStorage} = window
      if(session) {
        sessionStorage.setItem(key,
          JSON.stringify(storeExceptOrOnly(state, session.except, session.only)))
      }
      if(local) {
        localStorage.setItem(key,
          JSON.stringify(storeExceptOrOnly(state, local.except, local.only)))
      }
    }

    this.nuxtServerInit = (actionContext: ActionContext<S, S>, nuxtContext: INuxtContext) => {
      this.restoreFilter(nuxtContext)
      if(restore) {
        this.restore(nuxtContext)
      }
      this.clear()
      this.saveFilter(this._store.state, nuxtContext)
      this.save(this._store.state, nuxtContext)
    }

    this.plugin = (store: Store<S>) => {
      if(this._store) {
        throw new Error('plugin install twice')
      }
      this._store = store
      const plugin = (store: Store<S>) => {
        this.restoreFilter()
        // restore state
        if(restore) {
          this.restore()
        }
        this.clear()
        this.saveFilter(store.state)
        this.save(store.state)
        store.subscribe((mutation, state) => {
          this.clear()
          this.saveFilter(state)
          this.save(state)
        })
      }
      if(isClient() && window.onNuxtReady) {
        window.onNuxtReady(() => (plugin(store)))
        return
      }
      if(!isClient() && process && process.server) {
        return
      }
      plugin(store)
    }
  }
}
