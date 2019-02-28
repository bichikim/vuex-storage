!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash"),require("universal-cookie")):"function"==typeof define&&define.amd?define("vuex-storage",["lodash","universal-cookie"],t):"object"==typeof exports?exports["vuex-storage"]=t(require("lodash"),require("universal-cookie")):e["vuex-storage"]=t(e.lodash,e["universal-cookie"])}(this,function(e,t){return function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=2)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: cloneDeep, merge, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,o){t.exports=e},
/*!***********************************!*\
  !*** external "universal-cookie" ***!
  \***********************************/
/*! no static exports found */
/*! exports used: default */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,o){e.exports=t},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,o){e.exports=o(/*! ./src/index.ts */3)},
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(e,t,o){"use strict";o.r(t);var n=o(/*! lodash */0),r=o(/*! universal-cookie */1),i=o.n(r);function u(e,t,o){var r=Object(n.cloneDeep)(e),i={};return i=t?Object(n.omit)(r,t):r,o&&(i=Object(n.pick)(i,o)),i}var s=function(){return function(e){void 0===e&&(e={});var t=this,o=e.cookie,r=e.isRestore,s=void 0===r||r,a=e.isRun,c=void 0===a||a,f=e.isStrictMode,l=void 0!==f&&f,d=e.key,v=void 0===d?"vuex":d,p=e.local,b=e.mutationName,g=void 0===b?"__RESTORE_MUTATION":b,m=e.session,y=e.storageFirst,x=void 0!==y&&y,O=new i.a;this.mutation=function(e,t){var o=this;Object.keys(t).forEach(function(r){var i,u,s;i=e[r],u=t[r],"object"==typeof i&&null!==i?(x||(i=e[r],u=t[r]),s=Object(n.merge)(i,u)):s=x&&i?i:u,o._vm.$set(e,r,s)})},this.clear=function(){var e=window.sessionStorage,t=window.localStorage;e.setItem(v,"{}"),t.setItem(v,"{}"),O.set(v,{},{path:"/"})},this.save=function(e){var n=window.sessionStorage,r=window.localStorage;t.clear(),m&&n.setItem(v,JSON.stringify(u(e,m.except,m.only))),p&&r.setItem(v,JSON.stringify(u(e,p.except,p.only))),o&&O.set(v,u(e,o.except,o.only),{path:"/"})};var j=function(e){var o=window.sessionStorage,r=window.localStorage;if(s){var i=o.getItem(v)||"{}",u=r.getItem(v)||"{}",a=JSON.parse(i),c=JSON.parse(u),f=O.get(v)||{},d=Object(n.merge)(a,c,f);if(l)e.commit(g,d);else{var p=void 0;p=x?Object(n.merge)(d,e.state):Object(n.merge)(e.state,d),e.replaceState(p)}}t.save(e.state),e.subscribe(function(e,o){t.save(o)})};this.plugin=function(e){c&&(window.onNuxtReady?window.onNuxtReady(function(){return j(e)}):j(e))}}}();t.default=s}])});
//# sourceMappingURL=app.js.map