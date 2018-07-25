!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash")):"function"==typeof define&&define.amd?define("vuex-storage",["lodash"],t):"object"==typeof exports?exports["vuex-storage"]=t(require("lodash")):e["vuex-storage"]=t(e.lodash)}(this,function(e){return function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([
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
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(e,t,r){"use strict";r.r(t);var o=r(/*! lodash */0),n=function(e,t,r){var n={};return t?n=Object(o.omit)(Object(o.cloneDeep)(e),t):r&&(n=Object(o.pick)(Object(o.cloneDeep)(e),r)),n};t.default=function(e){void 0===e&&(e={});var t=e.session,r=void 0===t?{}:t,o=e.local,i=void 0===o?{}:o,u=e.key,c=void 0===u?"vuex":u;return function(e){if(!process.server){var t=window.sessionStorage,o=window.localStorage,u=t.getItem(c),s=o.getItem(c),a={},f={};try{a=JSON.parse(u)}catch(e){}try{f=JSON.parse(s)}catch(e){}var l=function(r,i,u){t.setItem(c,JSON.stringify(n(e.state,i.except,i.only))),o.setItem(c,JSON.stringify(n(e.state,u.except,u.only)))};e.replaceState(Object.assign(e.state,a,f)),l(e.state,r,i),e.subscribe(function(e,t){l(0,r,i)})}}}}])});
//# sourceMappingURL=app.js.map