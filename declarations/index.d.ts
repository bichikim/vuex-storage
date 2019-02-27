import { Mutation } from 'vuex';
import { Plugin } from 'vuex';
export interface IVuexStorageOptions {
    cookie?: IFilterOptions;
    isRestore?: boolean;
    isRun?: boolean;
    isStrictMode?: boolean;
    key?: string;
    local?: IFilterOptions;
    mutationName?: string;
    session?: IFilterOptions;
    storageFirst?: boolean;
}
export interface IFilterOptions {
    except?: string[];
    only?: string[];
}
export default class VuexStorage<S extends any> {
    readonly mutation: Mutation<S>;
    readonly plugin: Plugin<S>;
    readonly save: (state: any) => void;
    constructor(options?: IVuexStorageOptions);
}
