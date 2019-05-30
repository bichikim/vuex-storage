# Vuex-storage
> vuex browser storage plugin

[![LICENSE IMAGE]](https://www.npmjs.org/package/vuex-storage)
![npm](https://img.shields.io/npm/v/vuex-storage.svg)
![Codecov](https://img.shields.io/codecov/c/github/bichikim/vuex-storage.svg)
![Travis](https://img.shields.io/travis/bichikim/vuex-storage.svg)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fbichikim%2Fvuex-storage.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fbichikim%2Fvuex-storage?ref=badge_shield)

[LICENSE IMAGE]:https://img.shields.io/npm/l/vuex-storage.svg
[NPM LINK]:https://www.npmjs.org/package/vuex-storage
## How to use
### Default using
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexStorage from './src'
Vue.use(Vuex)
const vuexStorage = new VuexStorage({
  // set Filter state paths to save state
  filter: {
    cookie: '__cookie', // store.state.__cookie for saving cookie
    local: '__local', // store.state.__cookie for saving localStorage
    session: '__session', // store.state.__cookie for saving sessionStorage
  },
})
const store = new Vuex.Store({
  state: {
    projectName: 'foo',
    version: '0.0.0',
  },
  modules: {
    auth: {
      state: {
        name: 'foo',
        email: 'foo@foo.com',
        link: 'https://www.foo.com',
      }
    },
    __cookie: {
      namespaced: true,
      only: ['projectName'],
      mutations: {
        saveOnly(state, payload){
          state.only = payload
        }
      }
    },
    __local: {
      // deep targeting
      except: ['auth.email'] // except store.state.auth.email state 
    },
    __session: {
      only: ['auth', 'projectName'], // only store.state.au
      except: ['auth.link'] // except store.state.auth.link state
    }
  },
  plugins: [
    vuexStorage.plugin
  ]
})

/**
 * vuexStorage is going to save like below
 * cookie = {projectName: 'foo'}
 * localStorage = {projectName: 'foo', version: '0.0.0', auth: {name: 'foo', link: 'https://www.foo.com'}}
 * sessionStorage = {projectName: 'foo', auth: {name: 'foo', email: 'foo@foo.com'}}
**/

store.commit('__cookie/saveOnly', ['projectName', 'email'])
/**
* after changing store.state.__cookie.only
* cookie is going to be {projectName: 'foo', version: '0.0.0'}
**/
```
### Supporting strict mode
Only vuex can set its state by mutation in strict mode
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexStorage from './src'
Vue.use(Vuex)
const vuexStorage = new VuexStorage({
  // you can set your own mutation name
  // mutationName: '__myMutationName'
  filter: {
    cookie: '__cookie', // store.state.__cookie for saving cookie
    local: '__local', // store.state.__cookie for saving localStorage
    session: '__session', // store.state.__cookie for saving sessionStorage
  },
  
  // must set strict to be true
   strict: true,
})
const store = new Vuex.Store({
  strict: true,
  state: {
    // ...
  },

  mutations: {
    // must set this vuexStorage mutation here
    [vuexStorage.mutationName]: vuexStorage.mutation
  },
  plugins: [
    vuexStorage.plugin
  ],
})

```

### Supporting nuxt
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexStorage from './src'
Vue.use(Vuex)
const vuexStorage = new VuexStorage({
  clientSide: false, // or (store, options) => (false)
  strict: true,
})
const store = new Vuex.Store({
  strict: true,
  state: {
    
  },
  plugins: [
    vuexStorage.plugin
  ],
  actions: {
    // nuxt init with req.headers.cookie
    nuxtServerInit(store, context) {
      vuexStorage.nuxtServerInit(store, context)
    },
  },
  mutations: {
    // must set this vuexStorage mutation here
    [vuexStorage.mutationName]: vuexStorage.mutation
  }
})

/**
* restoring state from storage is going to wait for onNuxtReady calling
**/


```

### Storage first mode
Prohibit override defined state

```javascript
import VuexStorage from './src'
new VuexStorage({
  storageFirst: true,
  session: {},
})
```

## VuexStorage Options
Refer to src/types.ts interface IVuexStorageOptions



