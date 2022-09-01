"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6418],{3905:function(t,e,r){r.d(e,{Zo:function(){return p},kt:function(){return k}});var a=r(7294);function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function l(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,a)}return r}function o(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?l(Object(r),!0).forEach((function(e){n(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function i(t,e){if(null==t)return{};var r,a,n=function(t,e){if(null==t)return{};var r,a,n={},l=Object.keys(t);for(a=0;a<l.length;a++)r=l[a],e.indexOf(r)>=0||(n[r]=t[r]);return n}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(a=0;a<l.length;a++)r=l[a],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}var c=a.createContext({}),m=function(t){var e=a.useContext(c),r=e;return t&&(r="function"==typeof t?t(e):o(o({},e),t)),r},p=function(t){var e=m(t.components);return a.createElement(c.Provider,{value:e},t.children)},s={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},d=a.forwardRef((function(t,e){var r=t.components,n=t.mdxType,l=t.originalType,c=t.parentName,p=i(t,["components","mdxType","originalType","parentName"]),d=m(r),k=n,N=d["".concat(c,".").concat(k)]||d[k]||s[k]||l;return r?a.createElement(N,o(o({ref:e},p),{},{components:r})):a.createElement(N,o({ref:e},p))}));function k(t,e){var r=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var l=r.length,o=new Array(l);o[0]=d;var i={};for(var c in e)hasOwnProperty.call(e,c)&&(i[c]=e[c]);i.originalType=t,i.mdxType="string"==typeof t?t:n,o[1]=i;for(var m=2;m<l;m++)o[m]=r[m];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6734:function(t,e,r){r.r(e),r.d(e,{assets:function(){return p},contentTitle:function(){return c},default:function(){return k},frontMatter:function(){return i},metadata:function(){return m},toc:function(){return s}});var a=r(7462),n=r(3366),l=(r(7294),r(3905)),o=["components"],i={custom_edit_url:null},c=void 0,m={unversionedId:"api/ControlBar",id:"api/ControlBar",title:"ControlBar",description:"Add a bar at the bottom of the canvas that can control animation and other things",source:"@site/docs/api/ControlBar.mdx",sourceDirName:"api",slug:"/api/ControlBar",permalink:"/egjs-view3d/docs/api/ControlBar",editUrl:null,tags:[],version:"current",frontMatter:{custom_edit_url:null},sidebar:"api",previous:{title:"CameraResetButton",permalink:"/egjs-view3d/docs/api/CameraResetButton"},next:{title:"FullscreenButton",permalink:"/egjs-view3d/docs/api/FullscreenButton"}},p={},s=[{value:"constructor",id:"constructor",level:2},{value:"Properties",id:"properties",level:2},{value:"DEFAULT_CLASS",id:"DEFAULT_CLASS",level:3},{value:"POSITION",id:"POSITION",level:3},{value:"show",id:"show",level:3},{value:"hide",id:"hide",level:3}],d={toc:s};function k(t){var e=t.components,r=(0,n.Z)(t,o);return(0,l.kt)("wrapper",(0,a.Z)({},d,r,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"class ControlBar implements View3DPlugin\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Add a bar at the bottom of the canvas that can control animation and other things"),(0,l.kt)("div",{className:"container"},(0,l.kt)("div",{className:"row mb-2"},(0,l.kt)("div",{className:"col col--12"},(0,l.kt)("strong",null,"Properties"))),(0,l.kt)("div",{className:"row"},(0,l.kt)("div",{className:"col col--12"},(0,l.kt)("a",{href:"#DEFAULT_CLASS"},"DEFAULT_CLASS"),(0,l.kt)("span",{className:"bulma-tag is-info ml-2"},"static"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#POSITION"},"POSITION"),(0,l.kt)("span",{className:"bulma-tag is-info ml-2"},"static"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#show"},"show"),(0,l.kt)("br",null),(0,l.kt)("a",{href:"#hide"},"hide")))),(0,l.kt)("h2",{id:"constructor"},"constructor"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"new ControlBar()\n")),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PARAMETER"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"OPTIONAL"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DEFAULT"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"}),(0,l.kt)("td",{parentName:"tr",align:"center"},"Partial","<",(0,l.kt)("a",{parentName:"td",href:"ControlBarOptions"},"ControlBarOptions"),">"),(0,l.kt)("td",{parentName:"tr",align:"center"},"\u2714\ufe0f"),(0,l.kt)("td",{parentName:"tr",align:"center"},"{}"),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"DEFAULT_CLASS"},"DEFAULT_CLASS"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-info"},"static")),(0,l.kt)("p",null,"Default class names that ControlBar uses"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": object"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PROPERTY"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"ROOT"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-control-bar"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for wrapper element")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"VISIBLE"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"visible"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for visible elements")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"DISABLED"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"disabled"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for disabled elements")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"CONTROLS_BG"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-controls-background"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for background element")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"CONTROLS_SIDE"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-side-controls"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for controls wrapper element that includes both left & right controls")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"CONTROLS_TOP"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-top-controls"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for controls wrapper element that is placed on the top inside the control bar")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"CONTROLS_LEFT"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-left-controls"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for controls wrapper element that is placed on the left inside the control bar")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"CONTROLS_RIGHT"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-right-controls"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for controls wrapper element that is placed on the right inside the control bar")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"CONTROLS_ITEM"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-control-item"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for control item elements")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"PROGRESS_ROOT"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-progress-bar"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for root element of the progress bar")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"PROGRESS_TRACK"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-progress-track"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for progress track element of the progress bar")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"PROGRESS_THUMB"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-progress-thumb"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for thumb element of the progress bar")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"PROGRESS_FILLER"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-progress-filler"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for progress filler element of the progress bar")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"ANIMATION_NAME"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-animation-name"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for animation name element of the animation selector")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"ANIMATION_LIST"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-animation-list"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for animation list element of the animation selector")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"ANIMATION_ITEM"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-animation-item"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for animation list item element of the animation selector")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"ANIMATION_SELECTED"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"selected"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for selected animation list item element of the animation selector")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"GIZMO_ROOT"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-gizmo"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for root element of the navigation gizmo")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"GIZMO_AXIS"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"view3d-gizmo-axis"'),(0,l.kt)("td",{parentName:"tr",align:"center"},"A class name for axis button element of the navigation gizmo")))),(0,l.kt)("h3",{id:"POSITION"},"POSITION"),(0,l.kt)("div",{className:"bulma-tags"},(0,l.kt)("span",{className:"bulma-tag is-info"},"static")),(0,l.kt)("p",null,"Position constant"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Type"),": object"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"center"},"PROPERTY"),(0,l.kt)("th",{parentName:"tr",align:"center"},"TYPE"),(0,l.kt)("th",{parentName:"tr",align:"center"},"DESCRIPTION"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"TOP"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"top"'),(0,l.kt)("td",{parentName:"tr",align:"center"})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"LEFT"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"left"'),(0,l.kt)("td",{parentName:"tr",align:"center"})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"center"},"RIGHT"),(0,l.kt)("td",{parentName:"tr",align:"center"},'"right"'),(0,l.kt)("td",{parentName:"tr",align:"center"})))),(0,l.kt)("h3",{id:"show"},"show"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Show control bar"),(0,l.kt)("h3",{id:"hide"},"hide"),(0,l.kt)("div",{className:"bulma-tags"}),(0,l.kt)("p",null,"Hide control bar"))}k.isMDXComponent=!0}}]);