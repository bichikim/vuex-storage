import {cloneDeep, omit, pick} from 'lodash'
import {Store} from 'vuex'
// saving mutation name
const storeExceptOrOnly = (state: any, except: string[], only: string[]) => {
  let clonedStore = {}
  if(except){
    clonedStore = omit(cloneDeep(state), except)
  }else if(only){
    clonedStore = pick(cloneDeep(state), only)
  }
  return clonedStore
}

export interface IVuexStorageOptions {
  isServer?: boolean,
  session?: {
    except?: string[],
    only?: string[],
  }
  local?: {
    except?: string[],
    only?: string[],
  }
  key?: string
}

/**
 * Save Vuex store in local and session
 * @param {IVuexStorageOptions} options
 * @return {(store: Store<any>) => undefined}
 */
export default (options: IVuexStorageOptions = {}) => {
  const {session = {}, local = {}, key = 'vuex', isServer} = options
  return (store: Store<any>): 0 => {
    if(isServer){
      // webpack compiler change this into if(!process.server) so it must return any value
      return 0
    }

    const {sessionStorage, localStorage} = window
    const sessionData = sessionStorage.getItem(key)
    const localData = localStorage.getItem(key)
    let sessionState = {}
    let localState = {}
    try{
      sessionState = JSON.parse(sessionData)
    }catch(error){
      // skip
    }
    try{
      localState = JSON.parse(localData)
    }catch(error){
      // skip
    }

    // saving store
    const save = (state: any, session: any, local: any) => {
      sessionStorage.setItem(key,
        JSON.stringify(storeExceptOrOnly(store.state, session.except, session.only)))
      localStorage.setItem(key,
        JSON.stringify(storeExceptOrOnly(store.state, local.except, local.only)))
    }
    store.replaceState(Object.assign(store.state, sessionState, localState))
    save(store.state, session, local)
    store.subscribe((mutation, state) => {
      save(state, session, local)
    })
  }
}
