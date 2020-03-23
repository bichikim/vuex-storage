import {cloneDeep, get, merge, omit, pick} from 'lodash'
import {ActionContext, Store} from 'vuex'
import Cookies from './cookie'
import {
  IDynamicFilterObj,
  IFilters,
  INuxtContext,
  VuexStorageOptions,
  VuexStorageOptionsOptional,
} from './types'

export const DEFAULT_KEY = 'vuex'
export const DEFAULT_FILTERS_KEY = 'vuex-filters'
export const DEFAULT_NEW_IDENTIFIER_SAVE_KEY = 'vuex-Identifier'
export const DEFAULT_FILTER_SAVE_METHOD = 'localStorage'
export const DEFAULT_MUTATION_NAME = '__RESTORE_MUTATION'
export const DEFAULT_RESTORE = true
export const DEFAULT_FILTER = {}
export const DEFAULT_STRICT = false

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
  private _store: Store<S>
  private readonly _options: VuexStorageOptions<S>

  // prevent overriding this by the vuex
  plugin = (store: Store<S>) => {
    if(this._store) {
      throw new Error('plugin install twice')
    }

    const {restore} = this._options

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

    if(this.isClient() && window.onNuxtReady) {
      window.onNuxtReady(() => (plugin(store)))
      return
    }

    if(!this.isClient() && process && process.server) {
      return
    }

    plugin(store)
  }

  constructor(options: VuexStorageOptionsOptional<S> = {}) {
    const {
      clientSide,
      filter = {...DEFAULT_FILTER},
      filterSaveKey = DEFAULT_FILTERS_KEY,
      filterSaveMethod = DEFAULT_FILTER_SAVE_METHOD,
      key = DEFAULT_KEY,
      mutationName = DEFAULT_MUTATION_NAME,
      newIdentifier,
      newIdentifierSaveKey = DEFAULT_NEW_IDENTIFIER_SAVE_KEY,
      restore = DEFAULT_RESTORE,
      storageFirst = true,
      strict = DEFAULT_STRICT,

    } = options
    this._options = {
      clientSide,
      filter,
      filterSaveKey,
      filterSaveMethod,
      key,
      mutationName,
      newIdentifier,
      newIdentifierSaveKey,
      restore,
      storageFirst,
      strict,
    }

    // this.mutationName = mutationName
  }

  get mutationName() {
    return this._options.mutationName
  }

  isClient(): boolean {
    const {clientSide} = this._options

    if(typeof clientSide === 'function') {
      return clientSide(this._store, this._options)
    }

    if(typeof clientSide === 'boolean') {
      return clientSide
    }

    return typeof document === 'object'
  }

  getStateFilter(dynamicFilter: IDynamicFilterObj): IFilters {
    return {
      cookie: get<any, string>(this._store.state, dynamicFilter.cookie || ''),
      session: get<any, string>(this._store.state, dynamicFilter.session || ''),
      local: get<any, string>(this._store.state, dynamicFilter.local || ''),
    }
  }

  mutation(this: any, state: S, payload: any) {
    // eslint-disable-next-line consistent-this
    Object.keys(payload).forEach((moduleKey: string) => {
      (this._vm as any).$set(state, moduleKey, payload[moduleKey])
    })
  }

  clear(context?: INuxtContext) {
    const {key} = this._options
    const cookies = new Cookies(context, this.isClient())
    cookies.set(key, {}, {path: '/'})

    if(!this.isClient()) {
      return
    }
    const {sessionStorage, localStorage} = window
    sessionStorage.setItem(key, '{}')
    localStorage.setItem(key, '{}')
  }

  restoreFilter(context?: INuxtContext) {
    const {filterSaveMethod, filterSaveKey} = this._options

    // if an app is new do not need to restoreFilter
    if(this.isNew()) {
      return
    }

    let localState = {}
    let cookieState = {}

    if(filterSaveMethod === 'localStorage') {

      if(!this.isClient()) {
        return
      }

      const filterData = localStorage.getItem(filterSaveKey)

      if(filterData) {
        localState = JSON.parse(localStorage.getItem(filterSaveKey) || '{}')
      }
    } else {
      const cookies = new Cookies(context, this.isClient())
      const filterData = cookies.get(filterSaveKey)

      if(filterData) {
        cookieState = filterData
      }
    }

    this.mergeState(merge(localState, cookieState))
  }

  isNew() {
    const {newIdentifier, newIdentifierSaveKey} = this._options
    const oldIdentifier = localStorage.getItem(newIdentifierSaveKey)

    if(!newIdentifier) {
      return false
    }

    const nextIdentifier = newIdentifier()

    localStorage.setItem(newIdentifierSaveKey, nextIdentifier)

    return oldIdentifier !== nextIdentifier
  }

  mergeState(state: any) {
    const {strict, storageFirst, mutationName} = this._options
    const store = this._store
    let _state
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

  filters(): IFilters {
    const {filter} = this._options

    if(!filter) {
      return {}
    }

    return this.getStateFilter(filter)
  }

  saveFilter(state: any, context?: INuxtContext) {
    const {filter, filterSaveMethod, filterSaveKey} = this._options
    const filterOnly: string[] = []
    const {local: dynamicLocal, cookie: dynamicCookie, session: dynamicSession} = filter

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
      if(!this.isClient()) {
        return
      }

      localStorage.setItem(
        filterSaveKey,
        JSON.stringify(storeExceptOrOnly(state, undefined, filterOnly)),
      )

    } else {
      const cookies = new Cookies(context, this.isClient())

      cookies.set(filterSaveKey, storeExceptOrOnly(state, undefined, filterOnly), {path: '/'})
    }
  }

  save(state: any, context?: INuxtContext) {
    const {key} = this._options
    const {cookie, session, local} = this.filters()
    const cookies = new Cookies(context, this.isClient())

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

    if(!this.isClient()) {
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


  nuxtServerInit(actionContext: ActionContext<S, S>, nuxtContext: INuxtContext) {
    const {restore} = this._options

    this.restoreFilter(nuxtContext)

    if(restore) {
      this.restore(nuxtContext)
    }

    this.clear()
    this.saveFilter(this._store.state, nuxtContext)
    this.save(this._store.state, nuxtContext)
  }

  restore(context?: INuxtContext) {
    const {key} = this._options
    let cookieState = {}
    const {cookie, session, local} = this.filters()

    if(cookie) {
      const cookies = new Cookies(context, this.isClient())
      cookieState = storeExceptOrOnly(cookies.get(key), cookie.except, cookie.only)
    }

    let sessionState = {}
    let localState = {}

    // get client storage data if it is client side
    if(this.isClient()) {
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

    this.mergeState(merge(sessionState, localState, cookieState))
  }
}
