import { ActionContext, Mutation } from 'vuex';
import { Plugin } from 'vuex';
import { INuxtContext, IVuexStorageOptions } from './types';
export declare const DEFAULT_KEY = "vuex";
export declare const DEFAULT_MUTATION_NAME = "__RESTORE_MUTATION";
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
