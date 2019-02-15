!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash")):"function"==typeof define&&define.amd?define("vuex-storage",["lodash"],t):"object"==typeof exports?exports["vuex-storage"]=t(require("lodash")):e["vuex-storage"]=t(e.lodash)}(this,function(e){return function(e){var t={};function o(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}return o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=1)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: cloneDeep, merge, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,o){t.exports=e},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,o){e.exports=o(/*! ./src/index.ts */2)},
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(e,t,o){"use strict";o.r(t);var n=o(/*! lodash */0);function i(e,t,o){var i={};return t?i=Object(n.omit)(Object(n.cloneDeep)(e),t):o&&(i=Object(n.pick)(Object(n.cloneDeep)(e),o)),i}var r=function(){return function(e){void 0===e&&(e={});var t=this,o=e.isRun,r=void 0===o||o,s=e.key,u=void 0===s?"vuex":s,a=e.session,c=void 0===a?{}:a,f=e.local,l=void 0===f?{}:f,d=e.isRestore,p=void 0===d||d,v=e.isStrictMode,y=void 0!==v&&v,m=e.mutationName,b=void 0===m?"__RESTORE_MUTATION":m;this.key=u,this.session=c,this.local=l,this.isRestore=p,this.isRun=r,this.isStrictMode=y,this.mutationName=b,this.mutation=function(e,t){var o=this;Object.keys(t).forEach(function(n){o._vm.$set(e,n,t[n])})},this.save=function(e){var o=window.sessionStorage,n=window.localStorage;o.setItem(t.key,JSON.stringify(i(e,t.session.except,t.session.only))),n.setItem(t.key,JSON.stringify(i(e,t.local.except,t.local.only)))};var g=function(e){var o=window.sessionStorage,i=window.localStorage;if(t.isRestore){var r=o.getItem(t.key)||"{}",s=i.getItem(t.key)||"{}",u=JSON.parse(r),a=JSON.parse(s);t.isStrictMode?e.commit(t.mutationName,u):e.replaceState(Object(n.merge)(e.state,u,a))}t.save(e.state),e.subscribe(function(e,o){t.save(o)})};this.plugin=function(e){t.isRun&&(window.onNuxtReady?window.onNuxtReady(function(){return g(e)}):g(e))}}}();t.default=r}])});
//# sourceMappingURL=app.js.map