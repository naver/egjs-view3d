"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7561],{3905:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return k}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),d=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},l=function(e){var t=d(e.components);return n.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),s=d(r),k=a,N=s["".concat(i,".").concat(k)]||s[k]||m[k]||o;return r?n.createElement(N,p(p({ref:t},l),{},{components:r})):n.createElement(N,p({ref:t},l))}));function k(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,p=new Array(o);p[0]=s;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:a,p[1]=c;for(var d=2;d<o;d++)p[d]=r[d];return n.createElement.apply(null,p)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},746:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return i},default:function(){return k},frontMatter:function(){return c},metadata:function(){return d},toc:function(){return m}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),p=["components"],c={custom_edit_url:null},i=void 0,d={unversionedId:"api/EVENTS",id:"api/EVENTS",title:"EVENTS",description:"Event type object with event name strings of View3D",source:"@site/docs/api/EVENTS.mdx",sourceDirName:"api",slug:"/api/EVENTS",permalink:"/egjs-view3d/docs/api/EVENTS",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"AUTO",permalink:"/egjs-view3d/docs/api/AUTO"},next:{title:"EASING",permalink:"/egjs-view3d/docs/api/EASING"}},l={},m=[],s={toc:m};function k(e){var t=e.components,r=(0,a.Z)(e,p);return(0,o.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const EVENTS\n")),(0,o.kt)("div",{className:"bulma-tags"}),(0,o.kt)("p",null,"Event type object with event name strings of ",(0,o.kt)("a",{parentName:"p",href:"View3D"},"View3D")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Type"),": object"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"PROPERTY"),(0,o.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,o.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"READY"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"ready"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/ready"},"Ready event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"LOAD_START"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"loadStart"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/loadStart"},"Load start event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"LOAD"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"load"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/load"},"Load event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"LOAD_ERROR"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"loadError"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/loadError"},"Load error event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"RESIZE"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"resize"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/resize"},"Resize event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"BEFORE_RENDER"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"beforeRender"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/beforeRender"},"Before render event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"RENDER"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"render"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/render"},"Render event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"PROGRESS"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"progress"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/progress"},"Progress event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"QUICK_LOOK_TAP"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"quickLookTap"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/quickLookTap"},"Quick Look Tap event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"AR_START"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"arStart"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/arStart"},"AR start evemt"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"AR_END"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"arEnd"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/arEnd"},"AR end event"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"AR_MODEL_PLACED"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"arModelPlaced"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("a",{parentName:"td",href:"/docs/events/arModelPlaced"},"AR model placed event"))))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import { EVENTS } from "@egjs/view3d";\nEVENTS.RESIZE; // "resize"\n')))}k.isMDXComponent=!0}}]);