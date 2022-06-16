"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6679],{3905:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return m}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),c=s(a),m=r,k=c["".concat(p,".").concat(m)]||c[m]||d[m]||l;return a?n.createElement(k,i(i({ref:t},u),{},{components:a})):n.createElement(k,i({ref:t},u))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=c;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var s=2;s<l;s++)i[s]=a[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},6771:function(e,t,a){a.r(t),a.d(t,{assets:function(){return u},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return o},metadata:function(){return s},toc:function(){return d}});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),i=["components"],o={custom_edit_url:null},p=void 0,s={unversionedId:"api/AutoPlayer",id:"api/AutoPlayer",title:"AutoPlayer",description:"Autoplayer that animates model without user input",source:"@site/docs/api/AutoPlayer.mdx",sourceDirName:"api",slug:"/api/AutoPlayer",permalink:"/egjs-view3d/docs/api/AutoPlayer",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"Animation",permalink:"/egjs-view3d/docs/api/Animation"},next:{title:"Camera",permalink:"/egjs-view3d/docs/api/Camera"}},u={},d=[{value:"constructor",id:"constructor",level:2},{value:"Properties",id:"properties",level:2},{value:"enabled",id:"enabled",level:3},{value:"animating",id:"animating",level:3},{value:"delay",id:"delay",level:3},{value:"delayOnMouseLeave",id:"delayOnMouseLeave",level:3},{value:"speed",id:"speed",level:3},{value:"pauseOnHover",id:"pauseOnHover",level:3},{value:"canInterrupt",id:"canInterrupt",level:3},{value:"disableOnInterrupt",id:"disableOnInterrupt",level:3},{value:"Methods",id:"methods",level:2},{value:"destroy",id:"destroy",level:3},{value:"update",id:"update",level:3},{value:"enable",id:"enable",level:3},{value:"enableAfterDelay",id:"enableAfterDelay",level:3},{value:"disable",id:"disable",level:3}],c={toc:d};function m(e){var t=e.components,a=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"class AutoPlayer implements OptionGetters<AutoplayOptions>\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Autoplayer that animates model without user input"),(0,l.kt)("div",{className:"container"},(0,l.kt)("div",{className:"row mb-2"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Properties")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Methods"))),(0,l.kt)("div",{className:"row"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#enabled"},"enabled"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#animating"},"animating"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#delay"},"delay"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#delayOnMouseLeave"},"delayOnMouseLeave"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#speed"},"speed"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#pauseOnHover"},"pauseOnHover"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#canInterrupt"},"canInterrupt"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#disableOnInterrupt"},"disableOnInterrupt")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#destroy"},"destroy"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#update"},"update"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#enable"},"enable"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#enableAfterDelay"},"enableAfterDelay"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#disable"},"disable")))),(0,l.kt)("h2",{id:"constructor"},"constructor"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"new AutoPlayer(view3D, options, options.delay, options.delayOnMouseLeave, options.speed, options.pauseOnHover, options.canInterrupt, options.disableOnInterrupt)\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Create new AutoPlayer instance"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"view3D"),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"View3D"},"View3D")),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"An instance of View3D")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options"),(0,l.kt)("td",{parentName:"tr",align:"center"},"object"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"{}"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Options")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options.delay"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"2000"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Reactivation delay after mouse input in milisecond")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options.delayOnMouseLeave"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"0"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Reactivation delay after mouse leave")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options.speed"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"1"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Y-axis(yaw) rotation speed")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options.pauseOnHover"),(0,l.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"false"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Whether to pause rotation on mouse hover")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options.canInterrupt"),(0,l.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"true"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Whether user can interrupt the rotation with click/wheel input")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"options.disableOnInterrupt"),(0,l.kt)("td",{parentName:"tr",align:"center"},"boolean"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"false"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Whether to disable autoplay on user interrupt")))),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"enabled"},"enabled"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Whether autoplay is enabled or not"),(0,l.kt)("h3",{id:"animating"},"animating"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Whether autoplay is updating the camera at the moment"),(0,l.kt)("h3",{id:"delay"},"delay"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Reactivation delay after mouse input in milisecond"),(0,l.kt)("h3",{id:"delayOnMouseLeave"},"delayOnMouseLeave"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Reactivation delay after mouse leave",(0,l.kt)("br",null),"This option only works when ",(0,l.kt)("a",{parentName:"p",href:"AutoPlayer#pauseOnHover"},"pauseOnHover")," is activated"),(0,l.kt)("h3",{id:"speed"},"speed"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Y-axis(yaw) rotation speed"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Default"),": 1"),(0,l.kt)("h3",{id:"pauseOnHover"},"pauseOnHover"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Whether to pause rotation on mouse hover"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Default"),": false"),(0,l.kt)("h3",{id:"canInterrupt"},"canInterrupt"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Whether user can interrupt the rotation with click/wheel input"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Default"),": true"),(0,l.kt)("h3",{id:"disableOnInterrupt"},"disableOnInterrupt"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Whether to disable autoplay on user interrupt"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Default"),": false"),(0,l.kt)("h2",{id:"methods"},"Methods"),(0,l.kt)("h3",{id:"destroy"},"destroy"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Destroy the instance and remove all event listeners attached",(0,l.kt)("br",null),"This also will reset CSS cursor to intial"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("h3",{id:"update"},"update"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Update camera by given deltaTime"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"camera"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"Camera to update position")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"deltaTime"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"Number of milisec to update")))),(0,l.kt)("h3",{id:"enable"},"enable"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Enable autoplay and add event listeners"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("h3",{id:"enableAfterDelay"},"enableAfterDelay"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Enable autoplay after current delay value"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("h3",{id:"disable"},"disable"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Disable this input and remove all event handlers"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"))}m.isMDXComponent=!0}}]);