import { Request, Response } from 'express';
import { ActionContext, Mutation, Store } from 'vuex';
import { Plugin } from 'vuex';
import { CookieSerializeOptions } from './cookie';
interface INuxtContext {
    req: Request;
    res: Response;
}
export interface IVuexStorageOptions<S> {
    /**
     * cookie storage
     */
    cookie?: IFilterOptions;
    /**
     * session storage
     */
    session?: IFilterOptions;
    /**
     * local storage
     */
    local?: IFilterOptions;
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
    clientSide?: (store: Store<S>, options: IVuexStorageOptions<S>) => boolean | boolean;
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
}
export interface IFilterOptions {
    except?: string[];
    only?: string[];
    options?: CookieSerializeOptions;
}
export default class VuexStorage<S extends any> {
    readonly mutationName: string;
    readonly mutation: Mutation<S>;
    readonly plugin: Plugin<S>;
    readonly restore: (context?: INuxtContext) => void;
    readonly save: (state: any, context?: INuxtContext) => void;
    readonly clear: () => void;
    readonly nuxtServerInit: (actionContext: ActionContext<S, S>, nuxtContext: INuxtContext) => void;
    private _store;
    constructor(options?: IVuexStorageOptions<S>);
}
export {};
