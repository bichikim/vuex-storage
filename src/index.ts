import {cloneDeep, omit, pick} from 'lodash'
import {Store} from 'vuex'
import {IVuexStorageOptions, IFilterOptions} from './types'
import {Plugin} from 'vuex'
// saving mutation name
function storeExceptOrOnly(state: any, except: string[], only: string[]): any {
  let clonedState: any = {}
  if(except){
    clonedState = omit(cloneDeep(state), except)
  }else if(only){
    clonedState = pick(cloneDeep(state), only)
  }
  return clonedState
}

/**
 * Save Vuex store in local and session
 */
function vuexStorage<S>(options: IVuexStorageOptions = {}): Plugin<S> {
  const {
    session = {},
    local = {},
    key = 'vuex',
    isServer,
    isRestore = true,
    isRun = true,
  } = options
  return (store: Store<any>) => {
    if(isServer || !isRun){
      return
    }

    const {sessionStorage, localStorage} = window
    // saving store
    const save = (state: any, session: IFilterOptions, local: IFilterOptions) => {
      sessionStorage.setItem(key,
        JSON.stringify(storeExceptOrOnly(store.state, session.except, session.only)))
      localStorage.setItem(key,
        JSON.stringify(storeExceptOrOnly(store.state, local.except, local.only)))
    }

    if(isRestore){
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
      store.replaceState(Object.assign({}, store.state, sessionState, localState))
    }

    save(store.state, session, local)
    store.subscribe((mutation, state) => {
      save(state, session, local)
    })
  }
}

export default vuexStorage
