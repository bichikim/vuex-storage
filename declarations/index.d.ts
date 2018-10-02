import { IVuexStorageOptions } from './types';
import { Plugin } from 'vuex';
/**
 * Save Vuex store in local and session
 */
declare function vuexStorage<S>(options?: IVuexStorageOptions): Plugin<S>;
export default vuexStorage;
