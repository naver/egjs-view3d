"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2245],{3905:function(e,t,a){a.d(t,{Zo:function(){return m},kt:function(){return c}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var p=r.createContext({}),o=function(e){var t=r.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},m=function(e){var t=o(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},k=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,p=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),k=o(a),c=n,d=k["".concat(p,".").concat(c)]||k[c]||u[c]||l;return a?r.createElement(d,i(i({ref:t},m),{},{components:a})):r.createElement(d,i({ref:t},m))}));function c(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,i=new Array(l);i[0]=k;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var o=2;o<l;o++)i[o]=a[o];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}k.displayName="MDXCreateElement"},9705:function(e,t,a){a.r(t),a.d(t,{assets:function(){return m},contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return s},metadata:function(){return o},toc:function(){return u}});var r=a(7462),n=a(3366),l=(a(7294),a(3905)),i=["components"],s={custom_edit_url:null},p=void 0,o={unversionedId:"api/Camera",id:"api/Camera",title:"Camera",description:"Camera that renders the scene of View3D",source:"@site/docs/api/Camera.mdx",sourceDirName:"api",slug:"/api/Camera",permalink:"/egjs-view3d/docs/api/Camera",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"AutoResizer",permalink:"/egjs-view3d/docs/api/AutoResizer"},next:{title:"Model",permalink:"/egjs-view3d/docs/api/Model"}},m={},u=[{value:"constructor",id:"constructor",level:2},{value:"Properties",id:"properties",level:2},{value:"threeCamera",id:"threeCamera",level:3},{value:"defaultPose",id:"defaultPose",level:3},{value:"currentPose",id:"currentPose",level:3},{value:"newPose",id:"newPose",level:3},{value:"yaw",id:"yaw",level:3},{value:"pitch",id:"pitch",level:3},{value:"zoom",id:"zoom",level:3},{value:"distance",id:"distance",level:3},{value:"baseDistance",id:"baseDistance",level:3},{value:"baseFov",id:"baseFov",level:3},{value:"pivot",id:"pivot",level:3},{value:"fov",id:"fov",level:3},{value:"renderWidth",id:"renderWidth",level:3},{value:"renderHeight",id:"renderHeight",level:3},{value:"Methods",id:"methods",level:2},{value:"reset",id:"reset",level:3},{value:"resize",id:"resize",level:3},{value:"fit",id:"fit",level:3},{value:"updatePosition",id:"updatePosition",level:3}],k={toc:u};function c(e){var t=e.components,a=(0,n.Z)(e,i);return(0,l.kt)("wrapper",(0,r.Z)({},k,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"class Camera\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Camera that renders the scene of View3D"),(0,l.kt)("div",{className:"container"},(0,l.kt)("div",{className:"row mb-2"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Properties")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("strong",null,"Methods"))),(0,l.kt)("div",{className:"row"},(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#threeCamera"},"threeCamera"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#defaultPose"},"defaultPose"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#currentPose"},"currentPose"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#newPose"},"newPose"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#yaw"},"yaw"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#pitch"},"pitch"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#zoom"},"zoom"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#distance"},"distance"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#baseDistance"},"baseDistance"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#baseFov"},"baseFov"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#pivot"},"pivot"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#fov"},"fov"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#renderWidth"},"renderWidth"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#renderHeight"},"renderHeight")),(0,l.kt)("div",{className:"col col--6"},(0,l.kt)("a",{href:"#reset"},"reset"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#resize"},"resize"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#fit"},"fit"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#updatePosition"},"updatePosition")))),(0,l.kt)("h2",{id:"constructor"},"constructor"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"new Camera(view3D)\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Create new Camera instance"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"view3D"),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"View3D"},"View3D")),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"An instance of View3D")))),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"threeCamera"},"threeCamera"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Three.js ",(0,l.kt)("a",{parentName:"p",href:"https://threejs.org/docs/#api/en/cameras/PerspectiveCamera"},"PerspectiveCamera")," instance"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": THREE.PerspectiveCamera"),(0,l.kt)("h3",{id:"defaultPose"},"defaultPose"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's default pose(yaw, pitch, zoom, pivot)",(0,l.kt)("br",null),"This will be new currentPose when ",(0,l.kt)("a",{parentName:"p",href:"Camera#reset"},"reset()")," is called"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": ",(0,l.kt)("a",{parentName:"p",href:"Pose"},"Pose")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": ",(0,l.kt)("a",{parentName:"p",href:"Pose"},"Pose")),(0,l.kt)("h3",{id:"currentPose"},"currentPose"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's current pose value"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": ",(0,l.kt)("a",{parentName:"p",href:"Pose"},"Pose")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": ",(0,l.kt)("a",{parentName:"p",href:"Pose"},"Pose")),(0,l.kt)("h3",{id:"newPose"},"newPose"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Camera's new pose that will be applied on the next frame",(0,l.kt)("br",null),(0,l.kt)("a",{parentName:"p",href:"Camera#updatePosition"},"Camera#updatePosition")," should be called after changing this value."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": ",(0,l.kt)("a",{parentName:"p",href:"Pose"},"Pose")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": ",(0,l.kt)("a",{parentName:"p",href:"Pose"},"Pose")),(0,l.kt)("h3",{id:"yaw"},"yaw"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Camera's current yaw",(0,l.kt)("br",null),(0,l.kt)("a",{parentName:"p",href:"Camera#updatePosition"},"Camera#updatePosition")," should be called after changing this value."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"pitch"},"pitch"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Camera's current pitch",(0,l.kt)("br",null),(0,l.kt)("a",{parentName:"p",href:"Camera#updatePosition"},"Camera#updatePosition")," should be called after changing this value."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"zoom"},"zoom"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Camera's current zoom value",(0,l.kt)("br",null),(0,l.kt)("a",{parentName:"p",href:"Camera#updatePosition"},"Camera#updatePosition")," should be called after changing this value."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"distance"},"distance"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's disatance from current camera pivot(target)"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"baseDistance"},"baseDistance"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's default distance from the model center.",(0,l.kt)("br",null),"This will be automatically calculated based on the model size."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"baseFov"},"baseFov"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's default fov value.",(0,l.kt)("br",null),"This will be automatically chosen when ",(0,l.kt)("inlineCode",{parentName:"p"},"view3D.fov"),' is "auto", otherwise it is equal to ',(0,l.kt)("inlineCode",{parentName:"p"},"view3D.fov")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"pivot"},"pivot"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Current pivot point of camera rotation"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": THREE.Vector3"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"See"),":"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://threejs.org/docs/#api/en/math/Vector3"},"THREE#Vector3"))),(0,l.kt)("h3",{id:"fov"},"fov"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's focus of view value (vertical)"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"See"),":"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov"},"THREE#PerspectiveCamera"))),(0,l.kt)("h3",{id:"renderWidth"},"renderWidth"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's frustum width"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h3",{id:"renderHeight"},"renderHeight"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-warning"},"readonly")),(0,l.kt)("p",null,"Camera's frustum height"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": number"),(0,l.kt)("h2",{id:"methods"},"Methods"),(0,l.kt)("h3",{id:"reset"},"reset"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Reset camera to default pose"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": Promise","<","void",">"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Promise that resolves when the animation finishes")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"duration"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"0"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Duration of the reset animation")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"easing"),(0,l.kt)("td",{parentName:"tr",align:"center"},"function"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"DEFAULT.EASING"),(0,l.kt)("td",{parentName:"tr",align:"center"},"Easing function for the reset animation")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"pose"),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"Pose"},"Pose")),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"Pose to reset, camera will reset to ",(0,l.kt)("inlineCode",{parentName:"td"},"defaultPose")," if pose is not given.")))),(0,l.kt)("h3",{id:"resize"},"resize"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Update camera's aspect to given size"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"size"),(0,l.kt)("td",{parentName:"tr",align:"center"},"object"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"New size to apply")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"size.width"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"null"),(0,l.kt)("td",{parentName:"tr",align:"center"},"New width")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"size.height"),(0,l.kt)("td",{parentName:"tr",align:"center"},"number"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"New height")))),(0,l.kt)("h3",{id:"fit"},"fit"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Fit camera frame to the given model"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"model"),(0,l.kt)("td",{parentName:"tr",align:"center"},(0,l.kt)("a",{parentName:"td",href:"Model"},"Model")),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("h3",{id:"updatePosition"},"updatePosition"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Update camera position"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns"),": void"))}c.isMDXComponent=!0}}]);