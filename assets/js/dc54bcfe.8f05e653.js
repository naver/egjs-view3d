"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9793],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=r.createContext({}),c=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(o.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(n),d=a,k=m["".concat(o,".").concat(d)]||m[d]||p[d]||i;return n?r.createElement(k,l(l({ref:t},u),{},{components:n})):r.createElement(k,l({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=m;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var c=2;c<i;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1123:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return o},default:function(){return d},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return p}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),l=["components"],s={custom_edit_url:null},o=void 0,c={unversionedId:"api/ARManager",id:"api/ARManager",title:"ARManager",description:"ARManager that manages AR sessions",source:"@site/docs/api/ARManager.mdx",sourceDirName:"api",slug:"/api/ARManager",permalink:"/egjs-view3d/docs/api/ARManager",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"WebARControl",permalink:"/egjs-view3d/docs/api/WebARControl"},next:{title:"Animation",permalink:"/egjs-view3d/docs/api/Animation"}},u={},p=[{value:"constructor",id:"constructor",level:2},{value:"Methods",id:"methods",level:2},{value:"isAvailable",id:"isAvailable",level:3},{value:"enter",id:"enter",level:3},{value:"exit",id:"exit",level:3}],m={toc:p};function d(e){var t=e.components,n=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class ARManager\n")),(0,i.kt)("div",{className:"bulma-tags"}),(0,i.kt)("p",null,"ARManager that manages AR sessions"),(0,i.kt)("div",{className:"container"},(0,i.kt)("div",{className:"row mb-2"},(0,i.kt)("div",{className:"col col--12"},(0,i.kt)("strong",null,"Methods"))),(0,i.kt)("div",{className:"row"},(0,i.kt)("div",{className:"col col--12"},(0,i.kt)("a",{href:"#isAvailable"},"isAvailable"),(0,i.kt)("br",null),(0,i.kt)("a",{href:"#enter"},"enter"),(0,i.kt)("br",null),(0,i.kt)("a",{href:"#exit"},"exit")))),(0,i.kt)("h2",{id:"constructor"},"constructor"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"new ARManager(view3D)\n")),(0,i.kt)("div",{className:"bulma-tags"}),(0,i.kt)("p",null,"Create a new instance of the ARManager"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,i.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,i.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,i.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,i.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"center"},"view3D"),(0,i.kt)("td",{parentName:"tr",align:"center"},(0,i.kt)("a",{parentName:"td",href:"View3D"},"View3D")),(0,i.kt)("td",{parentName:"tr",align:"center"}),(0,i.kt)("td",{parentName:"tr",align:"center"}),(0,i.kt)("td",{parentName:"tr",align:"center"},"An instance of the View3D")))),(0,i.kt)("h2",{id:"methods"},"Methods"),(0,i.kt)("h3",{id:"isAvailable"},"isAvailable"),(0,i.kt)("div",{className:"bulma-tags"},(0,i.kt)("span",{className:"bulma-tag is-success"},"async")),(0,i.kt)("p",null,"Return a Promise containing whether any of the added session is available",(0,i.kt)("br",null),"If any of the AR session in current environment, this will return ",(0,i.kt)("inlineCode",{parentName:"p"},"true")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),": Promise","<","boolean",">"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Availability of the AR session")),(0,i.kt)("h3",{id:"enter"},"enter"),(0,i.kt)("div",{className:"bulma-tags"},(0,i.kt)("span",{className:"bulma-tag is-success"},"async")),(0,i.kt)("p",null,"Enter XR Session.",(0,i.kt)("br",null),"This should be called from a user interaction."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns"),": Promise","<","void",">"),(0,i.kt)("h3",{id:"exit"},"exit"),(0,i.kt)("div",{className:"bulma-tags"},(0,i.kt)("span",{className:"bulma-tag is-success"},"async")),(0,i.kt)("p",null,"Exit current XR Session."))}d.isMDXComponent=!0}}]);