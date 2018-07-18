#Vuex-storage
> vuex browser storage plugin

[![LICENSE IMAGE]](https://www.npmjs.org/package/vuex-storage)
![npm](https://img.shields.io/npm/v/vuex-storage.svg)
![Codecov](https://img.shields.io/codecov/c/github/bichikim/vuex-storage.svg)
![Travis](https://img.shields.io/travis/bichikim/vuex-storage.svg)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fbichikim%2Fvuex-storage.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fbichikim%2Fvuex-storage?ref=badge_shield)



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

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fbichikim%2Fvuex-storage.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fbichikim%2Fvuex-storage?ref=badge_large)