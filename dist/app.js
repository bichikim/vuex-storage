!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash")):"function"==typeof define&&define.amd?define("vuex-storage",["lodash"],t):"object"==typeof exports?exports["vuex-storage"]=t(require("lodash")):e["vuex-storage"]=t(e.lodash)}(this,function(e){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: cloneDeep, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,r){t.exports=e},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,r){e.exports=r(/*! ./src/index.ts */2)},
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(e,t,r){"use strict";r.r(t);var n=r(/*! lodash */0),o=function(e,t,r){var o={};return t?o=Object(n.omit)(Object(n.cloneDeep)(e),t):r&&(o=Object(n.pick)(Object(n.cloneDeep)(e),r)),o};t.default=function(e){void 0===e&&(e={});var t=e.session,r=void 0===t?{}:t,n=e.local,i=void 0===n?{}:n,u=e.key,c=void 0===u?"vuex":u,a=e.isServer;return function(e){if(a)return 0;var t=window.sessionStorage,n=window.localStorage,u=t.getItem(c),s=n.getItem(c),f={},l={};try{f=JSON.parse(u)}catch(e){}try{l=JSON.parse(s)}catch(e){}var p=function(r,i,u){t.setItem(c,JSON.stringify(o(e.state,i.except,i.only))),n.setItem(c,JSON.stringify(o(e.state,u.except,u.only)))};e.replaceState(Object.assign(e.state,f,l)),p(e.state,r,i),e.subscribe(function(e,t){p(0,r,i)})}}}])});
//# sourceMappingURL=app.js.map