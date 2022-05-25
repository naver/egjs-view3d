"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[380],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return m}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=n.createContext({}),c=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(o.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,o=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(a),m=r,k=d["".concat(o,".").concat(m)]||d[m]||u[m]||l;return a?n.createElement(k,i(i({ref:t},p),{},{components:a})):n.createElement(k,i({ref:t},p))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=d;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<l;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},3715:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return o},default:function(){return m},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return u}});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),i=["components"],s={custom_edit_url:null},o=void 0,c={unversionedId:"api/PointAnnotation",id:"api/PointAnnotation",title:"PointAnnotation",description:"Annotation that stays at one point",source:"@site/docs/api/PointAnnotation.mdx",sourceDirName:"api",slug:"/api/PointAnnotation",permalink:"/egjs-view3d/docs/api/PointAnnotation",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"FaceAnnotation",permalink:"/egjs-view3d/docs/api/FaceAnnotation"},next:{title:"GLTFLoader",permalink:"/egjs-view3d/docs/api/GLTFLoader"}},p={},u=[{value:"Constructor",id:"constructor",level:2},{value:"Properties",id:"properties",level:2},{value:"position",id:"position",level:3},{value:"element",id:"element",level:3},{value:"renderable",id:"renderable",level:3},{value:"baseFov",id:"baseFov",level:3},{value:"baseDistance",id:"baseDistance",level:3},{value:"aspect",id:"aspect",level:3},{value:"Methods",id:"methods",level:2},{value:"focus",id:"focus",level:3},{value:"unfocus",id:"unfocus",level:3},{value:"toJSON",id:"toJSON",level:3},{value:"destroy",id:"destroy",level:3},{value:"resize",id:"resize",level:3},{value:"render",id:"render",level:3},{value:"setOpacity",id:"setOpacity",level:3},{value:"enableEvents",id:"enableEvents",level:3},{value:"disableEvents",id:"disableEvents",level:3}],d={toc:u};function m(e){var t=e.components,a=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"class PointAnnotation extends Annotation\n")),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"Annotation"},"Annotation")," that stays at one point"),(0,l.kt)("div",{className:"container"},(0,l.kt)("div",{className:"row mb-2"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Properties")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Methods"))),(0,l.kt)("div",{className:"row"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#position"},"position"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#element"},"element"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#renderable"},"renderable"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#baseFov"},"baseFov"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#baseDistance"},"baseDistance"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#aspect"},"aspect")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#focus"},"focus"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#unfocus"},"unfocus"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#toJSON"},"toJSON"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#destroy"},"destroy"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#resize"},"resize"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#render"},"render"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#setOpacity"},"setOpacity"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#enableEvents"},"enableEvents"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#disableEvents"},"disableEvents")))),(0,l.kt)("h2",{id:"constructor"},"Constructor"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"new PointAnnotation(view3D, )\n")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"view3D"),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"View3D"},"View3D")),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"Partial","<",(0,l.kt)("a",{parentName:"td",href:"PointAnnotationOptions"},"PointAnnotationOptions"),">"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"{}"),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"position"},"position"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly"),(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"3D position of the annotation"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": THREE.Vector3"),(0,l.kt)("h3",{id:"element"},"element"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly"),(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Element of the annotation"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": HTMLElement"),(0,l.kt)("h3",{id:"renderable"},"renderable"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly"),(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Whether this annotation is renderable in the screen"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": boolean"),(0,l.kt)("h3",{id:"baseFov"},"baseFov"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Base fov value that annotation is referencing"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"baseDistance"},"baseDistance"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Base dsitance value that annotation is referencing"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number ","|"," null"),(0,l.kt)("h3",{id:"aspect"},"aspect"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Base aspect value that annotation is referencing"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h2",{id:"methods"},"Methods"),(0,l.kt)("h3",{id:"focus"},"focus"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Focus camera to this annotation",(0,l.kt)("br",null),"This will add a class ",(0,l.kt)("inlineCode",{parentName:"p"},"selected")," to this annotation element."),(0,l.kt)("h3",{id:"unfocus"},"unfocus"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Unfocus camera.",(0,l.kt)("br",null),"This will remove a class ",(0,l.kt)("inlineCode",{parentName:"p"},"selected")," to this annotation element.",(0,l.kt)("br",null),"To reset camera to the original position, use ",(0,l.kt)("a",{parentName:"p",href:"Camera#reset"},"Camera#reset")),(0,l.kt)("h3",{id:"toJSON"},"toJSON"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Serialize anntation data to JSON format."),(0,l.kt)("h3",{id:"destroy"},"destroy"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Destroy annotation and release all resources."),(0,l.kt)("h3",{id:"resize"},"resize"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Resize annotation to the current size"),(0,l.kt)("h3",{id:"render"},"render"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Render annotation element"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"params"),(0,l.kt)("td",{parentName:"tr",align:"center"},"object"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("div",{className:"notification is-warning my-2"},"\u26a0\ufe0f This function is for ",(0,l.kt)("strong",null,"internal")," use only."),(0,l.kt)("h3",{id:"setOpacity"},"setOpacity"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Set opacity of the annotation",(0,l.kt)("br",null),"Opacity is automatically controlled with ",(0,l.kt)("a",{parentName:"p",href:"/docs/options/annotation/annotationBreakpoints"},"annotationBreakpoints")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"opacity"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"Opacity to apply, number between 0 and 1")))),(0,l.kt)("h3",{id:"enableEvents"},"enableEvents"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Add browser event handlers"),(0,l.kt)("div",{className:"notification is-warning my-2"},"\u26a0\ufe0f This function is for ",(0,l.kt)("strong",null,"internal")," use only."),(0,l.kt)("h3",{id:"disableEvents"},"disableEvents"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-danger"},"inherited")),(0,l.kt)("p",null,"Remove browser event handlers"),(0,l.kt)("div",{className:"notification is-warning my-2"},"\u26a0\ufe0f This function is for ",(0,l.kt)("strong",null,"internal")," use only."))}m.isMDXComponent=!0}}]);