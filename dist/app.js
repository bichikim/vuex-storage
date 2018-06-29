!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash"),require("infinity-assign")):"function"==typeof define&&define.amd?define("vuex-storage",["lodash","infinity-assign"],t):"object"==typeof exports?exports["vuex-storage"]=t(require("lodash"),require("infinity-assign")):e["vuex-storage"]=t(e.lodash,e["infinity-assign"])}(this,function(e,t){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: cloneDeep, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,n){t.exports=e},
/*!**********************************!*\
  !*** external "infinity-assign" ***!
  \**********************************/
/*! no static exports found */
/*! exports used: default */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n){e.exports=t},
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(e,t,n){"use strict";n.r(t);var o=n(/*! infinity-assign */1),r=n.n(o),i=n(/*! lodash */0),s=function(e,t,n){var o={};return t?o=Object(i.omit)(Object(i.cloneDeep)(e),t):n&&(o=Object(i.pick)(Object(i.cloneDeep)(e),n)),o};t.default=function(e){void 0===e&&(e={});var t=e.session,n=void 0===t?{}:t,o=e.local,i=void 0===o?{}:o,c=e.key,u=void 0===c?"vuex":c;return function(e){if(!process.client){var t=window.sessionStorage,o=window.localStorage,c=t.getItem(u),a=o.getItem(u),f={},p={};try{f=JSON.parse(c)}catch(e){}try{p=JSON.parse(a)}catch(e){}var l=function(n,r,i){t.setItem(u,JSON.stringify(s(e.state,r.except,r.only))),o.setItem(u,JSON.stringify(s(e.state,i.except,i.only)))};r()(e.state,f),r()(e.state,p),l(e.state,n,i),e.subscribe(function(e,t){l(0,n,i)})}}}},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){e.exports=n(/*! ./src/index.ts */2)}])});
//# sourceMappingURL=app.js.map