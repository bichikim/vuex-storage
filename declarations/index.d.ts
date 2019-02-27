import { Mutation } from 'vuex';
import { Plugin } from 'vuex';
export interface IVuexStorageOptions {
    isRun?: boolean;
    isRestore?: boolean;
    isStrictMode?: boolean;
    session?: IFilterOptions;
    mutationName?: string;
    local?: IFilterOptions;
    key?: string;
    storageFirst?: boolean;
}
export interface IFilterOptions {
    except?: string[];
    only?: string[];
}
export default class VuexStorage<S extends any> {
    readonly key: string;
    readonly session: IFilterOptions;
    readonly local: IFilterOptions;
    readonly isRestore: boolean;
    readonly isStrictMode: boolean;
    readonly mutationName: string;
    readonly mutation: Mutation<S>;
    readonly plugin: Plugin<S>;
    readonly storageFirst: boolean;
    readonly save: (state: any) => void;
    isRun: boolean;
    constructor(options?: IVuexStorageOptions);
}
