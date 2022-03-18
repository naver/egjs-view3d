"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5416],{3905:function(t,e,n){n.d(e,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function l(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var c=r.createContext({}),p=function(t){var e=r.useContext(c),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},u=function(t){var e=p(t.components);return r.createElement(c.Provider,{value:e},t.children)},s={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},m=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,o=t.originalType,c=t.parentName,u=l(t,["components","mdxType","originalType","parentName"]),m=p(n),d=a,f=m["".concat(c,".").concat(d)]||m[d]||s[d]||o;return n?r.createElement(f,i(i({ref:e},u),{},{components:n})):r.createElement(f,i({ref:e},u))}));function d(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var c in e)hasOwnProperty.call(e,c)&&(l[c]=e[c]);l.originalType=t,l.mdxType="string"==typeof t?t:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4830:function(t,e,n){n.r(e),n.d(e,{assets:function(){return u},contentTitle:function(){return c},default:function(){return d},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return s}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],l={custom_edit_url:null},c=void 0,p={unversionedId:"api/ARTranslateControlOptions",id:"api/ARTranslateControlOptions",title:"ARTranslateControlOptions",description:"Options for ARTranslateControl",source:"@site/docs/api/ARTranslateControlOptions.mdx",sourceDirName:"api",slug:"/api/ARTranslateControlOptions",permalink:"/egjs-view3d/docs/api/ARTranslateControlOptions",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"ARSwirlControlOptions",permalink:"/egjs-view3d/docs/api/ARSwirlControlOptions"},next:{title:"DeadzoneCheckerOptions",permalink:"/egjs-view3d/docs/api/DeadzoneCheckerOptions"}},u={},s=[],m={toc:s};function d(t){var e=t.components,n=(0,a.Z)(t,i);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"interface ARTranslateControlOptions\n")),(0,o.kt)("div",{className:"bulma-tags"}),(0,o.kt)("p",null,"Options for ",(0,o.kt)("a",{parentName:"p",href:"ARTranslateControl"},"ARTranslateControl")),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"PROPERTY"),(0,o.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,o.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"threshold"),(0,o.kt)("td",{parentName:"tr",align:"center"},"number"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Threshold until translation works, this value is relative to screen size.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"hoverHeight"),(0,o.kt)("td",{parentName:"tr",align:"center"},"number"),(0,o.kt)("td",{parentName:"tr",align:"center"},"How much model will float from the floor, in meter. Default value is 0.1(10cm).")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"bounceDuration"),(0,o.kt)("td",{parentName:"tr",align:"center"},"number"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Bounce-to-floor animation's duration, in milisecond.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"bounceEasing"),(0,o.kt)("td",{parentName:"tr",align:"center"},"number"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Bounce-to-floor animation's easing function.")))))}d.isMDXComponent=!0}}]);