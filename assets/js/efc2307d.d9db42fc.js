"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2522],{3905:function(t,e,a){a.d(e,{Zo:function(){return p},kt:function(){return m}});var n=a(7294);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function s(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},l=Object.keys(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var c=n.createContext({}),o=function(t){var e=n.useContext(c),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},p=function(t){var e=o(t.components);return n.createElement(c.Provider,{value:e},t.children)},d={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},k=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,l=t.originalType,c=t.parentName,p=s(t,["components","mdxType","originalType","parentName"]),k=o(a),m=r,u=k["".concat(c,".").concat(m)]||k[m]||d[m]||l;return a?n.createElement(u,i(i({ref:e},p),{},{components:a})):n.createElement(u,i({ref:e},p))}));function m(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=a.length,i=new Array(l);i[0]=k;var s={};for(var c in e)hasOwnProperty.call(e,c)&&(s[c]=e[c]);s.originalType=t,s.mdxType="string"==typeof t?t:r,i[1]=s;for(var o=2;o<l;o++)i[o]=a[o];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}k.displayName="MDXCreateElement"},4511:function(t,e,a){a.r(e),a.d(e,{assets:function(){return p},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return s},metadata:function(){return o},toc:function(){return d}});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),i=["components"],s={custom_edit_url:null},c=void 0,o={unversionedId:"api/Scene",id:"api/Scene",title:"Scene",description:"Scene that View3D will render.All model datas including Mesh, Lights, etc. will be included on this",source:"@site/docs/api/Scene.mdx",sourceDirName:"api",slug:"/api/Scene",permalink:"/egjs-view3d/docs/api/Scene",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"Renderer",permalink:"/egjs-view3d/docs/api/Renderer"},next:{title:"ShadowPlane",permalink:"/egjs-view3d/docs/api/ShadowPlane"}},p={},d=[{value:"constructor",id:"constructor",level:2},{value:"Properties",id:"properties",level:2},{value:"root",id:"root",level:3},{value:"shadowPlane",id:"shadowPlane",level:3},{value:"userObjects",id:"userObjects",level:3},{value:"envObjects",id:"envObjects",level:3},{value:"fixedObjects",id:"fixedObjects",level:3},{value:"Methods",id:"methods",level:2},{value:"reset",id:"reset",level:3},{value:"add",id:"add",level:3},{value:"remove",id:"remove",level:3},{value:"setBackground",id:"setBackground",level:3},{value:"setSkybox",id:"setSkybox",level:3},{value:"setEnvMap",id:"setEnvMap",level:3},{value:"initTextures",id:"initTextures",level:3},{value:"setDefaultEnv",id:"setDefaultEnv",level:3}],k={toc:d};function m(t){var e=t.components,a=(0,r.Z)(t,i);return(0,l.kt)("wrapper",(0,n.Z)({},k,a,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"class Scene\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Scene that View3D will render.",(0,l.kt)("br",null),"All model datas including Mesh, Lights, etc. will be included on this"),(0,l.kt)("div",{className:"container"},(0,l.kt)("div",{className:"row mb-2"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Properties")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Methods"))),(0,l.kt)("div",{className:"row"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#root"},"root"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#shadowPlane"},"shadowPlane"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#userObjects"},"userObjects"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#envObjects"},"envObjects"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#fixedObjects"},"fixedObjects")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#reset"},"reset"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#add"},"add"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#remove"},"remove"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#setBackground"},"setBackground"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#setSkybox"},"setSkybox"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#setEnvMap"},"setEnvMap"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#initTextures"},"initTextures"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#setDefaultEnv"},"setDefaultEnv")))),(0,l.kt)("h2",{id:"constructor"},"constructor"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"new Scene(view3D)\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Create new Scene instance"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"view3D"),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"View3D"},"View3D")),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"An instance of View3D")))),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"root"},"root"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Root ",(0,l.kt)("a",{parentName:"p",href:"https://threejs.org/docs/#api/en/scenes/Scene"},"THREE.Scene")," object"),(0,l.kt)("h3",{id:"shadowPlane"},"shadowPlane"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Shadow plane & light"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": ",(0,l.kt)("a",{parentName:"p",href:"ShadowPlane"},"ShadowPlane")),(0,l.kt)("h3",{id:"userObjects"},"userObjects"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Group that contains volatile user objects"),(0,l.kt)("h3",{id:"envObjects"},"envObjects"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Group that contains non-volatile user objects"),(0,l.kt)("h3",{id:"fixedObjects"},"fixedObjects"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Group that contains objects that View3D manages"),(0,l.kt)("h2",{id:"methods"},"Methods"),(0,l.kt)("h3",{id:"reset"},"reset"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Reset scene to initial state"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options"),(0,l.kt)("td",{parentName:"tr",align:"center"},"object"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"{}"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Options")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options.volatileOnly"),(0,l.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"true"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Remove only volatile objects")))),(0,l.kt)("h3",{id:"add"},"add"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Add new Three.js ",(0,l.kt)("a",{parentName:"p",href:"https://threejs.org/docs/#api/en/core/Object3D"},"Object3D")," into the scene"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"object"),(0,l.kt)("td",{parentName:"tr",align:"center"},"THREE.Object3D ","|"," THREE.Object3D[]"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"https://threejs.org/docs/#api/en/core/Object3D"},"THREE.Object3D"),"s to add")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"volatile"),(0,l.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"true"),(0,l.kt)("td",{parentName:"tr",align:"center"},"If set to true, objects will be removed after displaying another 3D model")))),(0,l.kt)("h3",{id:"remove"},"remove"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Remove Three.js ",(0,l.kt)("a",{parentName:"p",href:"https://threejs.org/docs/#api/en/core/Object3D"},"Object3D")," into the scene"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"object"),(0,l.kt)("td",{parentName:"tr",align:"center"},"THREE.Object3D ","|"," THREE.Object3D[]"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"https://threejs.org/docs/#api/en/core/Object3D"},"THREE.Object3D"),"s to add")))),(0,l.kt)("h3",{id:"setBackground"},"setBackground"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-success"},"async")),(0,l.kt)("p",null,"Set background of the scene."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": Promise","<","void",">"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"background"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number ","|"," string"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"A color / image url to set as background")))),(0,l.kt)("h3",{id:"setSkybox"},"setSkybox"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-success"},"async")),(0,l.kt)("p",null,"Set scene's skybox, which both affects background & envmap"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": Promise","<","void",">"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"url"),(0,l.kt)("td",{parentName:"tr",align:"center"},"string ","|"," null"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"An URL to equirectangular image")))),(0,l.kt)("h3",{id:"setEnvMap"},"setEnvMap"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-success"},"async")),(0,l.kt)("p",null,"Set scene's environment map that affects all physical materials in the scene"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"url"),(0,l.kt)("td",{parentName:"tr",align:"center"},"string ","|"," null"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"An URL to equirectangular image")))),(0,l.kt)("h3",{id:"initTextures"},"initTextures"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("h3",{id:"setDefaultEnv"},"setDefaultEnv"),(0,l.kt)("div",{className:"bulma-tags"}))}m.isMDXComponent=!0}}]);