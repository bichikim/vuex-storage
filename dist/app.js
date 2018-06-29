!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash"),require("infinity-assign")):"function"==typeof define&&define.amd?define("vuex-storage",["lodash","infinity-assign"],t):"object"==typeof exports?exports["vuex-storage"]=t(require("lodash"),require("infinity-assign")):e["vuex-storage"]=t(e.lodash,e["infinity-assign"])}(this,function(e,t){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([
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
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(e,t,n){"use strict";n.r(t);var r=n(/*! infinity-assign */1),o=n.n(r),i=n(/*! lodash */0),u=function(e,t,n){var r={};return t?r=Object(i.omit)(Object(i.cloneDeep)(e),t):n&&(r=Object(i.pick)(Object(i.cloneDeep)(e),n)),r};t.default=function(e){void 0===e&&(e={});var t=e.session,n=void 0===t?{}:t,r=e.local,i=void 0===r?{}:r,s=e.key,c=void 0===s?"vuex":s;return function(e){if(process.client){var t=window.sessionStorage,r=window.localStorage,s=t.getItem(c),f=r.getItem(c),a={},l={};try{a=JSON.parse(s)}catch(e){}try{l=JSON.parse(f)}catch(e){}var p=function(n,o,i){t.setItem(c,JSON.stringify(u(e.state,o.except,o.only))),r.setItem(c,JSON.stringify(u(e.state,i.except,i.only)))};o()(e.state,a),o()(e.state,l),p(e.state,n,i),e.subscribe(function(e,t){p(0,n,i)})}}}},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){e.exports=n(/*! ./src/index.ts */2)}])});
//# sourceMappingURL=app.js.map