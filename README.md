#Vuex-storage
> vuex browser storage plugin

[![LICENSE IMAGE]](https://www.npmjs.org/package/vuex-storage)
![npm](https://img.shields.io/npm/v/vuex-storage.svg)
![Codecov](https://img.shields.io/codecov/c/github/codecov/vuex-storage.svg)
![Travis](https://img.shields.io/travis/bichikim/vuex-storage.svg)



[LICENSE IMAGE]:https://img.shields.io/npm/l/vuex-storage.svg
[NPM LINK]:https://www.npmjs.org/package/vuex-storage
## How to use
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import vuexStorage from './src'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    
  },
  plugins: [
    vuexStorage({
      local: {
        expect: [],
        only: [],
      },
      session: {
        expect: [],
        only: [],
      },
    })
  ]
})
```