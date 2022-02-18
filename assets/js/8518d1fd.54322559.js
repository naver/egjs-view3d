"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1113],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),d=p(n),m=a,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(f,i(i({ref:t},s),{},{components:n})):r.createElement(f,i({ref:t},s))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1018:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return s},default:function(){return d}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],c={custom_edit_url:null},l=void 0,p={unversionedId:"api/AR_SESSION_TYPE",id:"api/AR_SESSION_TYPE",title:"AR_SESSION_TYPE",description:"Available AR session types",source:"@site/docs/api/AR_SESSION_TYPE.mdx",sourceDirName:"api",slug:"/api/AR_SESSION_TYPE",permalink:"/egjs-view3d/docs/api/AR_SESSION_TYPE",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"EASING",permalink:"/egjs-view3d/docs/api/EASING"},next:{title:"SCENE_VIEWER_MODE",permalink:"/egjs-view3d/docs/api/SCENE_VIEWER_MODE"}},s=[],u={toc:s};function d(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const AR_SESSION_TYPE\n")),(0,o.kt)("div",{className:"bulma-tags"}),(0,o.kt)("p",null,"Available AR session types"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Type"),": object"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"PROPERTY"),(0,o.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,o.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"WEBXR"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"WebXR"'),(0,o.kt)("td",{parentName:"tr",align:"center"},"An AR session based on ",(0,o.kt)("a",{parentName:"td",href:"https://developer#mozilla#org/en-US/docs/Web/API/WebXR_Device_API"},"WebXR Device API"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"SCENE_VIEWER"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"SceneViewer"'),(0,o.kt)("td",{parentName:"tr",align:"center"},"An AR session based on ",(0,o.kt)("a",{parentName:"td",href:"https://developers#google#com/ar/develop/java/scene-viewer"},"Google SceneViewer"),", which is only available in Android")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"QUICK_LOOK"),(0,o.kt)("td",{parentName:"tr",align:"center"},'"QuickLook"'),(0,o.kt)("td",{parentName:"tr",align:"center"},"An AR session based on Apple ",(0,o.kt)("a",{parentName:"td",href:"https://developer#apple#com/augmented-reality/quick-look/"},"AR Quick Look"),", which is only available in iOS")))))}d.isMDXComponent=!0}}]);