"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1433],{1736:function(e,t,n){n.d(t,{Z:function(){return w}});var o=n(7462),r=n(7294),a=n(6010),l={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","at-rule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]},c={Prism:n(7410).default,theme:l};function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(){return s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},s.apply(this,arguments)}var u=/\r\n|\r|\n/,p=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},d=function(e,t){var n=e.length;return n>0&&e[n-1]===t?e:e.concat(t)},m=function(e,t){var n=e.plain,o=Object.create(null),r=e.styles.reduce((function(e,n){var o=n.languages,r=n.style;return o&&!o.includes(t)||n.types.forEach((function(t){var n=s({},e[t],r);e[t]=n})),e}),o);return r.root=n,r.plain=s({},n,{backgroundColor:null}),r};function y(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&-1===t.indexOf(o)&&(n[o]=e[o]);return n}var v=function(e){function t(){for(var t=this,n=[],o=arguments.length;o--;)n[o]=arguments[o];e.apply(this,n),i(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var n=e.theme?m(e.theme,e.language):void 0;return t.themeDict=n})),i(this,"getLineProps",(function(e){var n=e.key,o=e.className,r=e.style,a=s({},y(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),l=t.getThemeDict(t.props);return void 0!==l&&(a.style=l.plain),void 0!==r&&(a.style=void 0!==a.style?s({},a.style,r):r),void 0!==n&&(a.key=n),o&&(a.className+=" "+o),a})),i(this,"getStyleForToken",(function(e){var n=e.types,o=e.empty,r=n.length,a=t.getThemeDict(t.props);if(void 0!==a){if(1===r&&"plain"===n[0])return o?{display:"inline-block"}:void 0;if(1===r&&!o)return a[n[0]];var l=o?{display:"inline-block"}:{},c=n.map((function(e){return a[e]}));return Object.assign.apply(Object,[l].concat(c))}})),i(this,"getTokenProps",(function(e){var n=e.key,o=e.className,r=e.style,a=e.token,l=s({},y(e,["key","className","style","token"]),{className:"token "+a.types.join(" "),children:a.content,style:t.getStyleForToken(a),key:void 0});return void 0!==r&&(l.style=void 0!==l.style?s({},l.style,r):r),void 0!==n&&(l.key=n),o&&(l.className+=" "+o),l})),i(this,"tokenize",(function(e,t,n,o){var r={code:t,grammar:n,language:o,tokens:[]};e.hooks.run("before-tokenize",r);var a=r.tokens=e.tokenize(r.code,r.grammar,r.language);return e.hooks.run("after-tokenize",r),a}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,n=e.language,o=e.code,r=e.children,a=this.getThemeDict(this.props),l=t.languages[n];return r({tokens:function(e){for(var t=[[]],n=[e],o=[0],r=[e.length],a=0,l=0,c=[],i=[c];l>-1;){for(;(a=o[l]++)<r[l];){var s=void 0,m=t[l],y=n[l][a];if("string"==typeof y?(m=l>0?m:["plain"],s=y):(m=d(m,y.type),y.alias&&(m=d(m,y.alias)),s=y.content),"string"==typeof s){var v=s.split(u),f=v.length;c.push({types:m,content:v[0]});for(var h=1;h<f;h++)p(c),i.push(c=[]),c.push({types:m,content:v[h]})}else l++,t.push(m),n.push(s),o.push(0),r.push(s.length)}l--,t.pop(),n.pop(),o.pop(),r.pop()}return p(c),i}(void 0!==l?this.tokenize(t,o,l,n):[o]),className:"prism-code language-"+n,style:void 0!==a?a.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(r.Component),f=v;var h=n(5999),g=n(1419),b="codeBlockContainer_I0IT",k="codeBlockContent_wNvx",E="codeBlockTitle_BvAR",N="codeBlock_jd64",T="codeBlockStandalone_csWH",C="copyButton_wuS7",Z="codeBlockLines_mRuA";function w(e){var t,n=e.children,l=e.className,i=void 0===l?"":l,s=e.metastring,u=e.title,p=e.language,d=(0,g.LU)().prism,m=(0,r.useState)(!1),y=m[0],v=m[1],w=(0,r.useState)(!1),x=w[0],B=w[1];(0,r.useEffect)((function(){B(!0)}),[]);var _=(0,g.bc)(s)||u,D=(0,g.pJ)();if(r.Children.toArray(n).some((function(e){return(0,r.isValidElement)(e)})))return r.createElement(f,(0,o.Z)({},c,{key:String(x),theme:D,code:"",language:"text"}),(function(e){var t=e.className,o=e.style;return r.createElement("pre",{tabIndex:0,className:(0,a.Z)(t,T,"thin-scrollbar",b,i,g.kM.common.codeBlock),style:o},r.createElement("code",{className:Z},n))}));var L=Array.isArray(n)?n.join(""):n,S=null!=(t=null!=p?p:(0,g.Vo)(i))?t:d.defaultLanguage,A=(0,g.nZ)(L,s,S),O=A.highlightLines,P=A.code,j=function(){!function(e,t){var n=(void 0===t?{}:t).target,o=void 0===n?document.body:n,r=document.createElement("textarea"),a=document.activeElement;r.value=e,r.setAttribute("readonly",""),r.style.contain="strict",r.style.position="absolute",r.style.left="-9999px",r.style.fontSize="12pt";var l=document.getSelection(),c=!1;l.rangeCount>0&&(c=l.getRangeAt(0)),o.append(r),r.select(),r.selectionStart=0,r.selectionEnd=e.length;var i=!1;try{i=document.execCommand("copy")}catch(s){}r.remove(),c&&(l.removeAllRanges(),l.addRange(c)),a&&a.focus()}(P),v(!0),setTimeout((function(){return v(!1)}),2e3)};return r.createElement(f,(0,o.Z)({},c,{key:String(x),theme:D,code:P,language:null!=S?S:"text"}),(function(e){var t,n=e.className,l=e.style,c=e.tokens,s=e.getLineProps,u=e.getTokenProps;return r.createElement("div",{className:(0,a.Z)(b,i,(t={},t["language-"+S]=S&&!i.includes("language-"+S),t),g.kM.common.codeBlock)},_&&r.createElement("div",{style:l,className:E},_),r.createElement("div",{className:(0,a.Z)(k,S)},r.createElement("pre",{tabIndex:0,className:(0,a.Z)(n,N,"thin-scrollbar"),style:l},r.createElement("code",{className:Z},c.map((function(e,t){1===e.length&&"\n"===e[0].content&&(e[0].content="");var n=s({line:e,key:t});return O.includes(t)&&(n.className+=" docusaurus-highlight-code-line"),r.createElement("span",(0,o.Z)({key:t},n),e.map((function(e,t){return r.createElement("span",(0,o.Z)({key:t},u({token:e,key:t})))})),r.createElement("br",null))})))),r.createElement("button",{type:"button","aria-label":(0,h.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),className:(0,a.Z)(C,"clean-btn"),onClick:j},y?r.createElement(h.Z,{id:"theme.CodeBlock.copied",description:"The copied button label on code blocks"},"Copied"):r.createElement(h.Z,{id:"theme.CodeBlock.copy",description:"The copy button label on code blocks"},"Copy"))))}))}},8215:function(e,t,n){n.d(t,{Z:function(){return r}});var o=n(7294);function r(e){var t=e.children,n=e.hidden,r=e.className;return o.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return u}});var o=n(7462),r=n(7294),a=n(2389),l=n(1419),c=n(6010),i="tabItem_LplD";function s(e){var t,n,a,s=e.lazy,u=e.block,p=e.defaultValue,d=e.values,m=e.groupId,y=e.className,v=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=d?d:v.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,l.lx)(f,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===p?p:null!=(t=null!=p?p:null==(n=v.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(a=v[0])?void 0:a.props.value;if(null!==g&&!f.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,l.UB)(),k=b.tabGroupChoices,E=b.setTabGroupChoices,N=(0,r.useState)(g),T=N[0],C=N[1],Z=[],w=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var x=k[m];null!=x&&x!==T&&f.some((function(e){return e.value===x}))&&C(x)}var B=function(e){var t=e.currentTarget,n=Z.indexOf(t),o=f[n].value;o!==T&&(w(t),C(o),null!=m&&E(m,o))},_=function(e){var t,n=null;switch(e.key){case"ArrowRight":var o=Z.indexOf(e.currentTarget)+1;n=Z[o]||Z[0];break;case"ArrowLeft":var r=Z.indexOf(e.currentTarget)-1;n=Z[r]||Z[Z.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,c.Z)("tabs",{"tabs--block":u},y)},f.map((function(e){var t=e.value,n=e.label,a=e.attributes;return r.createElement("li",(0,o.Z)({role:"tab",tabIndex:T===t?0:-1,"aria-selected":T===t,key:t,ref:function(e){return Z.push(e)},onKeyDown:_,onFocus:B,onClick:B},a,{className:(0,c.Z)("tabs__item",i,null==a?void 0:a.className,{"tabs__item--active":T===t})}),null!=n?n:t)}))),s?(0,r.cloneElement)(v.filter((function(e){return e.props.value===T}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},v.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==T})}))))}function u(e){var t=(0,a.Z)();return r.createElement(s,(0,o.Z)({key:String(t)},e))}}}]);