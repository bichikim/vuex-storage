import { CookieSerializeOptions } from 'cookie';
import { Request, Response } from 'express';
import { Store } from 'vuex';
export interface IFilterOptions {
    except?: string[];
    only?: string[];
    options?: CookieSerializeOptions;
}
export interface IFilters {
    /**
     * cookie storage filter option
     */
    cookie?: IFilterOptions;
    /**
     * session storage filter option
     */
    session?: IFilterOptions;
    /**
     * local storage filter option
     */
    local?: IFilterOptions;
}
export declare type DynamicFilterFn<S> = (store: Store<S>, options: IVuexStorageOptions<S>) => IFilters;
export interface IDynamicFilterObj {
    /**
     * cookie storage filter option state name
     */
    cookie?: string;
    /**
     * session storage filter option state name
     */
    session?: string;
    /**
     * local storage filter option state name
     */
    local?: string;
}
export interface IVuexStorageOptions<S> {
    /**
     * override cookie, session and local by state
     */
    filter?: DynamicFilterFn<S> | IDynamicFilterObj;
    /**
     * restore data from client storage
     */
    restore?: boolean;
    /**
     * supporting vuex strict
     */
    strict?: boolean;
    /**
     * override storage data to state
     * @default false
     */
    storageFirst?: boolean;
    key?: string;
    mutationName?: string;
    clientSide?: ((store: Store<S>, options: IVuexStorageOptions<S>) => boolean) | boolean;
    /**
     * @deprecated
     */
    isRun?: boolean;
    /**
     * @deprecated
     * please use restore
     */
    isRestore?: boolean;
    /**
     * @deprecated
     * please use strict
     */
    isStrictMode?: boolean;
    /**
     * @deprecated
     * please use filter
     */
    local?: any;
    /**
     * @deprecated
     * please use filter
     */
    session?: any;
    /**
     * @deprecated
     * please use filter
     */
    cookie?: any;
}
export interface INuxtContext {
    req: Request;
    res: Response;
}
