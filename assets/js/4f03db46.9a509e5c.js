"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7707],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=u(r),m=a,k=d["".concat(i,".").concat(m)]||d[m]||s[m]||o;return r?n.createElement(k,l(l({ref:t},p),{},{components:r})):n.createElement(k,l({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=d;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:a,l[1]=c;for(var u=2;u<o;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},9098:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return c},metadata:function(){return u},toc:function(){return s}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),l=["components"],c={custom_edit_url:null},i=void 0,u={unversionedId:"api/Skybox",id:"api/Skybox",title:"Skybox",description:"Skybox texture generator",source:"@site/docs/api/Skybox.mdx",sourceDirName:"api",slug:"/api/Skybox",permalink:"/egjs-view3d/docs/api/Skybox",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"ShadowPlane",permalink:"/egjs-view3d/docs/api/ShadowPlane"},next:{title:"View3DError",permalink:"/egjs-view3d/docs/api/View3DError"}},p={},s=[{value:"Methods",id:"methods",level:2},{value:"createBlurredHDR",id:"createBlurredHDR",level:3}],d={toc:s};function m(e){var t=e.components,r=(0,a.Z)(e,l);return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"class Skybox\n")),(0,o.kt)("div",{className:"bulma-tags"}),(0,o.kt)("p",null,"Skybox texture generator"),(0,o.kt)("div",{className:"container"},(0,o.kt)("div",{className:"row mb-2"},(0,o.kt)("div",{className:"col col--12"},(0,o.kt)("strong",null,"Methods"))),(0,o.kt)("div",{className:"row"},(0,o.kt)("div",{className:"col col--12"},(0,o.kt)("a",{href:"#createBlurredHDR"},"createBlurredHDR"),(0,o.kt)("span",{className:"bulma-tag is-info ml-2"},"static")))),(0,o.kt)("h2",{id:"methods"},"Methods"),(0,o.kt)("h3",{id:"createBlurredHDR"},"createBlurredHDR"),(0,o.kt)("div",{className:"bulma-tags"},(0,o.kt)("span",{className:"bulma-tag is-info"},"static")),(0,o.kt)("p",null,"Create blurred cubemap texture of the given texture and use that as the skybox"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Returns"),": this"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,o.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,o.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,o.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,o.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"texture"),(0,o.kt)("td",{parentName:"tr",align:"center"},"THREE.Texture"),(0,o.kt)("td",{parentName:"tr",align:"center"}),(0,o.kt)("td",{parentName:"tr",align:"center"}),(0,o.kt)("td",{parentName:"tr",align:"center"},"Equirect texture")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"texture"),(0,o.kt)("td",{parentName:"tr",align:"center"},"THREE.Texture"),(0,o.kt)("td",{parentName:"tr",align:"center"}),(0,o.kt)("td",{parentName:"tr",align:"center"}),(0,o.kt)("td",{parentName:"tr",align:"center"})))))}m.isMDXComponent=!0}}]);