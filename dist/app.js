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
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(e,t,n){"use strict";n.r(t);var o=n(/*! lodash */0),r=n(/*! infinity-assign */1),i=n.n(r),s=function(e,t,n){var r={};return t?r=Object(o.omit)(Object(o.cloneDeep)(e),t):n&&(r=Object(o.pick)(Object(o.cloneDeep)(e),n)),r};t.default=function(e){void 0===e&&(e={});var t=e.session,n=void 0===t?{}:t,o=e.local,r=void 0===o?{}:o,c=e.key,u=void 0===c?"vuex":c;return function(e){var t=(process||window.process||{}).browser;if(void 0!==t&&t){var o=window.sessionStorage,c=window.localStorage,a=o.getItem(u),f=c.getItem(u),p={},l={};try{p=JSON.parse(a)}catch(e){}try{l=JSON.parse(f)}catch(e){}var d=function(t,n,r){o.setItem(u,JSON.stringify(s(e.state,n.except,n.only))),c.setItem(u,JSON.stringify(s(e.state,r.except,r.only)))};e.replaceState(i()(e.state,p,l)),d(e.state,n,r),e.subscribe(function(e,t){d(0,n,r)})}}}},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){e.exports=n(/*! ./src/index.ts */2)}])});
//# sourceMappingURL=app.js.map