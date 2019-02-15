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
}
export interface IFilterOptions {
    except?: string[];
    only?: string[];
}
export default class VuexStorage<S> {
    readonly key: string;
    readonly session: IFilterOptions;
    readonly local: IFilterOptions;
    readonly isRestore: boolean;
    readonly isStrictMode: boolean;
    readonly mutationName: string;
    readonly mutation: Mutation<S>;
    readonly plugin: Plugin<S>;
    readonly save: (state: any) => void;
    isRun: boolean;
    constructor(options?: IVuexStorageOptions);
}
