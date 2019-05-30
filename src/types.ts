import {CookieSerializeOptions} from 'cookie'
import {Request, Response} from 'express'
import {Store} from 'vuex'

export interface IFilterOptions {
  except?: string[]
  only?: string[]
  options?: CookieSerializeOptions
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

export type DynamicFilterFn<S> = (store: Store<S>, options: IVuexStorageOptions<S>) => IFilters

export interface IDynamicFilterObj {
  cookie?: string
  session?: string
  local?: string
}

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

export interface INuxtContext {
  req: Request,
  res: Response,
}
