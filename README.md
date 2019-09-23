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
  // filter can be changed in running time (This is a very shining feature of This library)
  filter: {
    cookie: '__cookie', // set a filter state state path to save cookie
    local: '__local', // set a filter store.state.__local to save localStorage
    session: '__session', // set a filter store.state.__session to save sessionStorage
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
    // cookie filter
    __cookie: {
      namespaced: true,
      only: ['projectName'],
      mutations: {
        saveOnly(state, payload){
          state.only = payload
        }
      }
    },
    // local filter
    __local: {
      // deep targeting
      except: ['auth.email'] // except store.state.auth.email state 
    },
    // session filter
    __session: {
      only: ['auth', 'projectName'], // only store.state.auth and store.state.projectName
      except: ['auth.link'] // except store.state.auth.link state
    }
  },
  plugins: [
    // please register this plugin
    vuexStorage.plugin
  ]
})

/**
 * vuexStorage is going to save like below
 * cookie = {projectName: 'foo'}
 * localStorage = {projectName: 'foo', version: '0.0.0', auth: {name: 'foo', link: 'https://www.foo.com'}}
 * sessionStorage = {projectName: 'foo', auth: {name: 'foo', email: 'foo@foo.com'}}
**/

/**
* after changing store.state.__cookie.only
* cookie is going to be {projectName: 'foo', version: '0.0.0'}
**/
store.commit('__cookie/saveOnly', ['projectName', 'email'])

```
### Supporting strict mode
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexStorage from './src'
Vue.use(Vuex)
const vuexStorage = new VuexStorage({
  // you can set your own mutation name
  // mutationName: '__myMutationName'
  filter: {
    // deep path
    cookie: 'filter.cookie', // store.state.filter.cookie for saving cookie
    local: 'filter.local', // store.state.filter.local for saving localStorage
    session: 'filter.session', // store.state.filter.session for saving sessionStorage
  },
  
  // you should set strict to be true
   strict: true,
})
const store = new Vuex.Store({
  strict: true,
  state: {
    // ...
  },

  mutations: {
    // you should set this vuex-storage mutation here.
    // because in the vuex-storage, a restore state function will use the below mutation
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
    // nuxt will init with req.headers.cookie
    nuxtServerInit(store, context) {
      vuexStorage.nuxtServerInit(store, context)
    },
  },
  mutations: {
    // you must set this vuexStorage mutation here
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
  storageFirst: false,
  session: {},
})
```

## VuexStorage Options
Refer to src/types.ts interface IVuexStorageOptions



