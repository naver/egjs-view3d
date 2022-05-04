"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3457],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return u}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),c=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=c(a),u=r,k=m["".concat(i,".").concat(u)]||m[u]||d[u]||l;return a?n.createElement(k,o(o({ref:t},p),{},{components:a})):n.createElement(k,o({ref:t},p))}));function u(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<l;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},8384:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return i},default:function(){return u},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return d}});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),o=["components"],s={custom_edit_url:null},i=void 0,c={unversionedId:"api/Model",id:"api/Model",title:"Model",description:"Data class for loaded 3d model",source:"@site/docs/api/Model.mdx",sourceDirName:"api",slug:"/api/Model",permalink:"/egjs-view3d/docs/api/Model",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"Camera",permalink:"/egjs-view3d/docs/api/Camera"},next:{title:"ModelAnimator",permalink:"/egjs-view3d/docs/api/ModelAnimator"}},p={},d=[{value:"Constructor",id:"constructor",level:2},{value:"Properties",id:"properties",level:2},{value:"src",id:"src",level:3},{value:"scene",id:"scene",level:3},{value:"animations",id:"animations",level:3},{value:"annotations",id:"annotations",level:3},{value:"meshes",id:"meshes",level:3},{value:"bbox",id:"bbox",level:3},{value:"castShadow",id:"castShadow",level:3},{value:"receiveShadow",id:"receiveShadow",level:3},{value:"Methods",id:"methods",level:2},{value:"reduceVertices",id:"reduceVertices",level:3},{value:"_getAllMeshes",id:"_getAllMeshes",level:3}],m={toc:d};function u(e){var t=e.components,a=(0,r.Z)(e,o);return(0,l.kt)("wrapper",(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"class Model\n")),(0,l.kt)("p",null,"Data class for loaded 3d model"),(0,l.kt)("div",{className:"container"},(0,l.kt)("div",{className:"row mb-2"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Properties")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Methods"))),(0,l.kt)("div",{className:"row"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#src"},"src"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#scene"},"scene"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#animations"},"animations"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#annotations"},"annotations"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#meshes"},"meshes"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#bbox"},"bbox"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#castShadow"},"castShadow"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#receiveShadow"},"receiveShadow")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#reduceVertices"},"reduceVertices"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#_getAllMeshes"},"_getAllMeshes")))),(0,l.kt)("h2",{id:"constructor"},"Constructor"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"new Model()\n")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"{src: string, scenes: THREE.Object3D[], animations?: THREE.AnimationClip[], annotations?: Annotation[], fixSkinnedBbox?: boolean, castShadow?: boolean, receiveShadow?: boolean}"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"src"},"src"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Source URL of this model"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": string"),(0,l.kt)("h3",{id:"scene"},"scene"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Scene of the model, see ",(0,l.kt)("a",{parentName:"p",href:"https://threejs#org/docs/#api/en/objects/Group"},"THREE.Group")),(0,l.kt)("h3",{id:"animations"},"animations"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://threejs#org/docs/#api/en/animation/AnimationClip"},"THREE.AnimationClip"),"s inside model"),(0,l.kt)("h3",{id:"annotations"},"annotations"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"Annotation"},"Annotation"),"s included inside the model"),(0,l.kt)("h3",{id:"meshes"},"meshes"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://threejs#org/docs/#api/en/objects/Mesh"},"THREE.Mesh"),"es inside model if there's any."),(0,l.kt)("h3",{id:"bbox"},"bbox"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Get a copy of model's current bounding box"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": THREE#Box3"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"See"),":"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://threejs.org/docs/#api/en/math/Box3"},"https://threejs.org/docs/#api/en/math/Box3"))),(0,l.kt)("h3",{id:"castShadow"},"castShadow"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Whether the model's meshes gets rendered into shadow map"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": boolean"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"val"),(0,l.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"model.castShadow = true;\n")),(0,l.kt)("h3",{id:"receiveShadow"},"receiveShadow"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Whether the model's mesh materials receive shadows"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": boolean"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"val"),(0,l.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"model.receiveShadow = true;\n")),(0,l.kt)("h2",{id:"methods"},"Methods"),(0,l.kt)("h3",{id:"reduceVertices"},"reduceVertices"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,'Executes a user-supplied "reducer" callback function on each vertex of the model, in order, passing in the return value from the calculation on the preceding element.'),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"callbackfn"),(0,l.kt)("td",{parentName:"tr",align:"center"},"(previousVal: T, currentVal: THREE.Vector3) =",">"," T"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"initialVal"),(0,l.kt)("td",{parentName:"tr",align:"center"},"T"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("h3",{id:"_getAllMeshes"},"_getAllMeshes"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Get all ",(0,l.kt)("a",{parentName:"p",href:"https://threejs#org/docs/#api/en/objects/Mesh"},"THREE.Mesh"),"es inside model if there's any."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": THREE.Mesh[]"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Meshes found at model's scene")))}u.isMDXComponent=!0}}]);