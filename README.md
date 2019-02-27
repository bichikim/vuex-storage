# Vuex-storage
> vuex browser storage plugin

[![LICENSE IMAGE]](https://www.npmjs.org/package/vuex-storage)
![npm](https://img.shields.io/npm/v/vuex-storage.svg)
![Codecov](https://img.shields.io/codecov/c/github/bichikim/vuex-storage.svg)
![Travis](https://img.shields.io/travis/bichikim/vuex-storage.svg)



[LICENSE IMAGE]:https://img.shields.io/npm/l/vuex-storage.svg
[NPM LINK]:https://www.npmjs.org/package/vuex-storage
## How to use
### Shape of using
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexStorage from './src'
Vue.use(Vuex)
const vuexStorage = new VuexStorage({
  local: {
    expect: [],
      only: [],
    },
  session: {
    expect: [],
    only: [],
  },
})
const store = new Vuex.Store({
  state: {
    
  },
  plugins: [
    vuexStorage.plugin
  ]
})
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
  local: {
    expect: [],
      only: [],
    },
  session: {
    expect: [],
    only: [],
  },
})
const store = new Vuex.Store({
  strict: true,
  state: {
    
  },
  plugins: [
    vuexStorage.plugin
  ],
  mutations: {
    // must set this vuexStorage mutation here
    [vuexStorage.mutationName]: vuexStorage.mutation
  }
})

```

### Supporting nuxt
VuexStorage will wait nuxt is ready (window.onNuxtReady)
Supporting strict mode (nuxt will set vuex strict = true)
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexStorage from './src'
Vue.use(Vuex)
const vuexStorage = new VuexStorage({
  // you can set your own mutation name
  // mutationName: '__myMutationName'
  // only run in client side
  isRun: process.client,
  local: {
    expect: [],
      only: [],
    },
  session: {
    expect: [],
    only: [],
  },
  cookie: {
    except: [],
    only: [],
  }
})
const store = new Vuex.Store({
  strict: true,
  state: {
    
  },
  plugins: [
    vuexStorage.plugin
  ],
  mutations: {
    // must set this vuexStorage mutation here
    [vuexStorage.mutationName]: vuexStorage.mutation
  }
})

```

### Storage targeting
You can set what data you are going to save
 
```javascript
import VuexStorage from './src'
new VuexStorage({
  // for localStorage
  local: {
    // only where in list below to save
    only: ['auth'],
    // except where in list below to save
    except: ['auth.access-token'],
  },
  session: {
    // only where in list below to save
    only: [],
    // except where in list below to save
    except: ['auth'],
  },
  cookie: {
    except: [],
    only: ['auth.access-token'],
  }
})
```

### Storage first mode
Prohibit override defined data

```javascript
import VuexStorage from './src'
new VuexStorage({
  storageFirst: true,
  session: {},
})
```


