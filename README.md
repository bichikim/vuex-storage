#Vuex-storage
> vuex browser storage plugin

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