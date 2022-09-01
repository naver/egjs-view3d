"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4704],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return s}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=p(n),s=a,f=d["".concat(l,".").concat(s)]||d[s]||m[s]||o;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function s(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4465:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return s},frontMatter:function(){return c},metadata:function(){return p},toc:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],c={custom_edit_url:null},l=void 0,p={unversionedId:"api/LoadingItem",id:"api/LoadingItem",title:"LoadingItem",description:"Current context of the loading item",source:"@site/docs/api/LoadingItem.mdx",sourceDirName:"api",slug:"/api/LoadingItem",permalink:"/egjs-view3d/docs/api/LoadingItem",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"View3DPlugin",permalink:"/egjs-view3d/docs/api/View3DPlugin"},next:{title:"ARSession",permalink:"/egjs-view3d/docs/api/ARSession"}},u={},m=[],d={toc:m};function s(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"interface LoadingItem\n")),(0,o.kt)("div",{className:"bulma-tags"}),(0,o.kt)("p",null,"Current context of the loading item"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"PROPERTY"),(0,o.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,o.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"src"),(0,o.kt)("td",{parentName:"tr",align:"center"},"string"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Source URL of the loading item")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"loaded"),(0,o.kt)("td",{parentName:"tr",align:"center"},"number"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Loaded byte")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"total"),(0,o.kt)("td",{parentName:"tr",align:"center"},"number"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Content length of the item")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"lengthComputable"),(0,o.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Whether the item has the Content-Length header")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"initialized"),(0,o.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Whether the item is loaded least one byte")))))}s.isMDXComponent=!0}}]);