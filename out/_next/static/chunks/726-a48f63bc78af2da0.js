"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[726],{7305:function(t,e,s){var i=s(6006),n=s(9724);e.Z=function(t,e,s,r){let a=(0,i.useRef)(e);(0,n.Z)(()=>{a.current=e},[e]),(0,i.useEffect)(()=>{var e;let i=null!==(e=null==s?void 0:s.current)&&void 0!==e?e:window;if(!(i&&i.addEventListener))return;let n=t=>a.current(t);return i.addEventListener(t,n,r),()=>{i.removeEventListener(t,n,r)}},[t,s,r])}},9724:function(t,e,s){var i=s(6006);let n=i.useLayoutEffect;e.Z=n},5581:function(t,e,s){s.d(e,{nf:function(){return d},wl:function(){return c},Ry:function(){return u},WU:function(){return h}});var i=s(3526);class n{get id(){return this._id}get name(){return this._name}get attributes(){return this._attributes}set attributes(t){this._attributes=t}get specialAttributes(){return this._specialAttributes}set specialAttributes(t){this._specialAttributes=t}get styles(){return this._styles}set styles(t){this._styles=t}get globalStyles(){return this._globalStyles}set globalStyles(t){this._globalStyles=t}get sectionId(){return this._sectionId}set sectionId(t){this._sectionId=t}get parentId(){return this._parentId}set parentId(t){this._parentId=t}get parentWap(){return this._parentWap}set parentWap(t){this._parentWap=t}updateBreakpoint(t,e){return this._styles[t]?(this._styles[e]=this._styles[t],delete this._styles[t],{isUpdated:!0,status:"success"}):{isUpdated:!1,status:"error",message:"Cannot find ".concat(t," breakpoint on element ").concat(this._tag,", id: ").concat(this.id)}}addBreakpoint(t){let e=Object.keys(this._styles).sort((t,e)=>+e-+t).map(t=>+t),s=0;for(let i=0;i<e.length&&!(e[i]<t);i++)s++;let i=e[s+1]||e[e.length-1];this._styles[t]=JSON.parse(JSON.stringify(this._styles[i]))}removeBreakpoint(t){if(!this._styles[t])return{isRemoved:!1,status:"warning",message:"Could not find style on element: ".concat(this.id,", breakpoint: ").concat(t)};let e=this._styles[t];return delete this._styles[t],{isRemoved:!0,status:"success",payload:e}}constructor(t,e,s,n=null,r=null){this._id=(0,i.qR)(),this._attributes={},this._specialAttributes={},this._styles={},this._globalStyles={},this._sectionId=null,this._parentId=null,this._name="Element",this._tag=t,this._parentWap=s,this._sectionId=n,this._parentId=r,e.forEach(t=>this._styles[t]={})}}class r extends n{get items(){return this._items}set items(t){this._layers=this._layers.filter(e=>t[e]),Object.keys(t).forEach(t=>{this._layers.includes(t)||this._layers.push(t)}),this._items=t}get layers(){return this._layers}set layers(t){this.layers=t,this._items=t.reduce((t,e)=>(t[e]=this._items[e],t),{})}addItem(t){this._items[t.id]=t,this._layers.push(t.id)}addContainerBreakpoint(t){this.addBreakpoint(t),Object.values(this._items).forEach(e=>{e instanceof r?e.addContainerBreakpoint(t):e.addBreakpoint(t)})}updateContainerBreakpoint(t,e){let s=this.updateBreakpoint(t,e);s.isUpdated||this.addBreakpoint(e),Object.values(this._items).forEach(s=>{s instanceof r?s.updateContainerBreakpoint(t,e):s.updateBreakpoint(t,e)})}removeContainerBreakpoint(t){let e=this.removeBreakpoint(t);e.isRemoved&&Object.values(this._items).forEach(e=>{e instanceof r?e.removeContainerBreakpoint(t):e.removeBreakpoint(t)})}static translateGrideCellSizeToString(t){return r._instanceOfGridSize(t)&&t.minmax?"minmax( ".concat(r.translateGrideCellSizeToString(t.minmax.min),", ").concat(this.translateGrideCellSizeToString(t.minmax.max),")"):t.content?t.content:t.value+t.unit}static _instanceOfGridSize(t){return"minmax"in t}get grid(){return t=>this._grids[t]}get sizableGridCells(){return(t,e)=>this._grids[e][t].filter(t=>!t.minmax).map(t=>t.value+t.unit)}set gridRows(t){let{gridRows:e,bp:s}=t;this._grids[s]||(this._grids[s]={cols:[],rows:[]}),this._grids[s].rows=[...e],this._grids={...this._grids},this.styles[s]||(this.styles[s]={}),this.styles[s].gridTemplateRows=r.getFormattedGridTemplate(e).join(" "),this.globalStyles.gridTemplateRows=r.getFormattedGridTemplate(e).join(" ")}set gridCols(t){let{bp:e,gridCols:s}=t;this._grids[e]||(this._grids[e]={cols:[],rows:[]}),this._grids[e].cols=[...s],this._grids={...this._grids},this.styles[e]||(this.styles[e]={}),this.styles[e].gridTemplateColumns=r.getFormattedGridTemplate(s).join(" "),this.globalStyles.gridTemplateColumns=r.getFormattedGridTemplate(s).join(" ")}set gridLayout(t){let{bp:e,layout:s,orientation:i}=t;"cols"===i?this.gridCols={bp:e,gridCols:s}:this.gridRows={bp:e,gridRows:s}}get gridColsLayout(){return t=>{var e;let s=Math.min(...Object.keys(this._grids).map(t=>+t));return(null===(e=this._grids[t])||void 0===e?void 0:e.cols)||this._grids[s].cols}}get gridTemplateCols(){return t=>r.getFormattedGridTemplate(this.gridColsLayout(t))}get gridRowsLayout(){return t=>{var e;let s=Math.min(...Object.keys(this._grids).map(t=>+t));return(null===(e=this._grids[t])||void 0===e?void 0:e.rows)||this._grids[s].rows}}get gridTemplateRows(){return t=>r.getFormattedGridTemplate(this.gridRowsLayout(t))}addGridTemplate(t,e,s){var i;let n=this.grid(t);return n?(n[e].length?n[e].splice(s,0,{...r.defaultGridSize}):this.gridLayout={bp:t,orientation:e,layout:[{...r.defaultGridSize},{...r.defaultGridSize}]},{isAdded:!0,status:"success",message:"Grid template is ".concat(n[e].length," X ").concat((null===(i=n["cols"==e?"rows":"cols"])||void 0===i?void 0:i.length)||1),payload:n[e]}):{isAdded:!1,message:"Grid layout not found",status:"error"}}_getUpdatedGridFormatDeprecated(t){let{bp:e,sizeMap:s,croppedGrid:n,croppedGridComparison:r,orientation:a}=t,o="cols"===a?this.grid(e).cols:this.grid(e).rows,l="cols"===a?n.colSizes:n.rowSizes,d="cols"===a?r.colSizes:r.rowSizes,h="cols"===a?n.colIdxs:n.rowIdxs,u=[];for(let t=0;t<l.length;t++){let e=l[t]-d[t];if(!e){u.push({...o[t]});continue}let n=t+h[0],r=o[n];if(r.minmax){let i=t>0?l[t-1]-d[t-1]:0;if(0===n||!i){let{unit:i,value:n}=r.minmax.max;console.log(e);let a=n+e/s[i];u.push({...o[t],minmax:{...r.minmax,max:{value:a,unit:i}}});continue}if(n===o.length-1||i){let{unit:i,value:n}=r.minmax.min,a=n+e/s[i];u.push({...o[t],minmax:{...r.minmax,min:{value:a,unit:i}}});continue}}else{let{unit:n,value:a}=r,l=a+e/s[n];if(l<=0)continue;u.push({...o[t],value:(0,i.uf)(l)})}}return u}getUpdatedGridFormat(t){let{originalGrid:e,modifiedGrid:s,orientation:i,sizeMap:n,bp:r}=t,a=this.grid(r)[i],o=[];for(let t=0;t<a.length;t++){let i=s[t]-e[t],r=a[t];if(!i){o.push({...r});continue}let{unit:l,value:d}=r,h=d+i/n[l];if(h<=0){h<0&&console.log("fuck my face");continue}o.push({...r,value:h})}return o}static getFormattedGridTemplate(t){return t.length?t.map(t=>r.translateGrideCellSizeToString(t)):["1fr"]}dragNewGridDivider(t,e,s,n,a){let o=(0,i.gt)(s,a||this._grids[e][t],n);return this._styles[e].gridTemplateColumns=r.getFormattedGridTemplate(this._grids[e].cols).join(" "),this._styles[e].gridTemplateRows=r.getFormattedGridTemplate(this._grids[e].rows).join(" "),o}editGrid(t,e,s,i){if(s<0||s>=this._grids[e][t].length||!this._grids[e][t][s])return{isUpdated:!1,status:"warning",message:"Divider index out of grid array"};this._grids[e][t].splice(s,1,i);let n=this._grids[e][t];return"cols"===t?this.gridCols={bp:e,gridCols:n}:this.gridRows={bp:e,gridRows:n},{isUpdated:!0,status:"success",payload:this._grids[e][t]}}removeDivider(t,e,s){return s<0||s>=this._grids[e][t].length||!this._grids[e][t][s]?{isRemoved:!1,status:"warning",message:"Divider index out of grid array"}:(this._grids[e][t].splice(s,1),this._grids[e][t].length<=1&&(this._grids[e][t]=[]),"cols"===t?this.gridCols={bp:e,gridCols:this._grids[e][t]}:this.gridRows={bp:e,gridRows:this._grids[e][t]},{isRemoved:!0,status:"success",payload:this._grids[e][t]})}constructor(t,e,s,i=null,n=null){super(t,e,s,n,i),this._name="Container",this._items={},this._layers=[],this._grids={},e.forEach(t=>{this._grids[t]={rows:[{...r.defaultGridSize}],cols:[{...r.defaultGridSize}]},this.styles[t]={...this.styles[t],display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr"}})}}r.defaultGridSize={value:1,unit:"fr"};class a extends r{get name(){return this._name}set name(t){this._name=t}get type(){return this._type}get isGlobal(){return this._isGlobal}set isGlobal(t){this._isGlobal=t}get isVertical(){return this._isVertical}deleteSection(){this._parentWap.deleteSection(this.id)}constructor(t,e,s,i,n){super("section",n,i,null,null),this._name="Section",this._type=t,this._isVertical=e,this._isGlobal=s,this._parentWap=i,[...n,o.minBreakpoint].forEach(t=>{this.styles[t]={width:e?"300px":"100%",height:e?"100%":"300px",position:"relative"}})}}class o{get id(){return this._id}get name(){return this._name}get styles(){return this._styles}set styles(t){this._styles=t}get globalStyles(){return this._globalStyles}set globalStyles(t){this._globalStyles=t}get type(){return this._type}get title(){return this._title}set title(t){this._title=t}get parentWap(){return this._parentWap}set parentWap(t){this._parentWap=t}static get screenType(){return t=>t>1e3?"desktop":t>500?"tablet":"mobile"}get pageHeight(){return t=>(t<o.minBreakpoint&&(t=o.minBreakpoint),this.mainColSections.reduce((e,s)=>e+(s.styles[t].height?+parseFloat(s.styles[t].height+""):0),0))}get cols(){return this._sectionsIds.map(t=>t.width)}get rows(){return t=>(t<o.minBreakpoint&&(t=o.minBreakpoint),this._sectionsIds[this._mainColIdx].ids.map(t=>this._parentWap.sections[t||""]||null).filter(t=>t).map(e=>{var s,i;return(null===(s=e.styles[t])||void 0===s?void 0:s.height)?null===(i=e.styles[t])||void 0===i?void 0:i.height:null}).filter(t=>t))}get rowCount(){return this.sectionsIds[this.mainCol].ids.length}get colCount(){return this.sectionsIds.length}get mainCol(){return this._mainColIdx}set mainCol(t){this._mainColIdx=t}get formattedBreakpoints(){let{minBreakpoint:t,maxBreakpoint:e}=o,s=this._breakpoints;return s.length,s.length?[...s.map((t,e,s)=>0===e?{start:t,end:null,text:"".concat(t+1," and up"),screenType:"desktop"}:{start:t,end:s[e-1],text:"".concat(s[e-1],"px and bellow"),screenType:o.screenType(t+1)})]:[{start:t,end:null,text:"".concat(t," and up"),screenType:"desktop"}]}get breakpoints(){return this._breakpoints}set breakpoints(t){if(t.length>=o.maxBreakpointCount)return;let e=t.reduce((t,e)=>(t.includes(e)||t.push(e),t),[]),s=[],i=e.filter(t=>!this._breakpoints.includes(t)||(s.push(t),!1));this._breakpoints.forEach((t,e)=>this._parentWap.removeBreakpoint(this._id,e));let n=[...s];s.forEach(t=>this._parentWap.addBreakpoint(this._id,t)),i.forEach(t=>{let e=this._parentWap.addBreakpoint(this._id,t);e.isAdded&&n.push(t)}),this._breakpoints=n.sort((t,e)=>e-t)}get correspondingBreakpointIdx(){return t=>{let e;let s=this.formattedBreakpoints;for(e=0;e<s.length-1&&!(t>=s[e].start);e++);return e}}checkNewBreakpointAvailability(t){let{minBreakpoint:e,maxBreakpoint:s}=o;return t<e||t>s?{isAvailable:!1,status:"error",message:"Breakpoints must be between ".concat(e," px and ").concat(s," px.")}:!this._breakpoints.length||this._breakpoints.every(e=>Math.abs(t-e)>1)?{isAvailable:!0,status:"success"}:{isAvailable:!1,status:"info",message:"Breakpoints ranges must be at least 1 px."}}checkExistingBreakpointAvailability(t,e){if(t<0||t>=this._breakpoints.length)return{isAvailable:!1,status:"error",message:"Invalid breakpoint index: "+t};let{minBreakpoint:s,maxBreakpoint:i}=o;if(1===this._breakpoints.length)return e<=s||e>i?{isAvailable:!1,status:"info",message:"Breakpoint ranges must be between ".concat(s+1," px and ").concat(i," px.")}:{isAvailable:!0,status:"success"};let n=[i+2,...this._breakpoints,s],r=t+1,a=n[r+1]+1,l=n[r-1]-2;return e<=a||e>l?{isAvailable:!1,status:"info",message:"Breakpoint must be between ".concat(a+1," px and ").concat(l," px.")}:{isAvailable:!0,status:"success"}}addBreakpoint(t){if(6===this._breakpoints.length)return{isAdded:!1,status:"info",message:"You can add up to 6 custom breakpoints to each page."};let e=this.checkNewBreakpointAvailability(t);return e.isAvailable?(this._breakpoints.push(t),this._breakpoints=this._breakpoints.sort((t,e)=>e-t),Object.keys(this._sections).forEach(e=>{let s=this.parentWap.sections[e];s.gridCols={bp:t,gridCols:[r.defaultGridSize]},s.gridRows={bp:t,gridRows:[r.defaultGridSize]}}),{isAdded:!0,status:"success"}):{...e,isAdded:!1}}updateBreakpoint(t,e){let s=this.checkExistingBreakpointAvailability(t,e);if(!s.isAvailable)return{...s,isUpdated:!1};let i=this._breakpoints[t];return e===i||(this._breakpoints[t]=e,this._breakpoints=this._breakpoints.sort((t,e)=>e-t)),{isUpdated:!0,status:"success",payload:i}}removeBreakpoint(t){if(t<0||t>=this._breakpoints.length)return{status:"error",isRemoved:!1,message:"Invalid breakpoint index: ".concat(t)};let e=this._breakpoints.splice(t,1)[0];return{isRemoved:!0,status:"success",payload:e}}get headerId(){return this._headerId}set headerId(t){this._headerId=t}get footerId(){return this._footerId}set footerId(t){this._footerId=t}get sections(){return this._sections}set sections(t){this._sections=t}get sectionCol(){return t=>"section"!==t.type?this._mainColIdx:this._sectionsIds.findIndex(e=>e.ids.includes(t.id))}get sectionRow(){return t=>t.isVertical?-1:"header"===t.type?0:"footer"===t.type?this.sectionsIds[this.mainCol].ids.length-1:this.sectionsIds[this.mainCol].ids.indexOf(t.id)}get sectionsIds(){return this._sectionsIds}set sectionsIds(t){this._sectionsIds=t,this._mainColIdx=t.findIndex(t=>!t.isVertical);let e=this.sectionsIds[this.mainCol].ids.length,s=this.sectionsIds[this.mainCol].ids[0],i=this.sectionsIds[this.mainCol].ids[e-1];"header"===this.sections[s]&&(this.headerId=s),"footer"===this.sections[i]&&(this.footerId=i)}get allSectionIds(){let t=[];return this.sectionsIds.forEach((e,s)=>(this.mainCol,t.push(...e.ids))),t}get allSections(){return this.allSectionIds.map(t=>this.parentWap.sections[t])}get mainColSectionIds(){return this.sectionsIds[this.mainCol].ids}get mainColSections(){return this.mainColSectionIds.map(t=>this.parentWap.sections[t])}get miniSections(){return this._sections}addSection(t,e,s,i,n){let r=this._sectionsIds[this._mainColIdx].ids.length,o=n||new a(e,s,i,this.parentWap,this._breakpoints);switch(o.name=s?"Vertical Section":"Section",e){case"header":if(this.headerId)return{isAdded:!1,status:"warning",message:"This page already has a header"};this.headerId=o.id,this._sectionsIds[this._mainColIdx].ids.unshift(this.headerId);break;case"footer":if(this.footerId)return{isAdded:!1,status:"warning",message:"This page already has a footer"};this.footerId=o.id,this._sectionsIds[this._mainColIdx].ids.push(this.footerId);break;default:if(s){if(t<0||t>this.cols.length)return{isAdded:!1,status:"warning",message:"Cannot skip columns"};this._sectionsIds.splice(t,0,{isVertical:!0,ids:[o.id],width:"300px"})}else{if(this.headerId&&t<0||this.footerId&&t>r)return{isAdded:!1,status:"warning",message:"Cannot add section past header and footer"};this._sectionsIds[this._mainColIdx].ids.splice(t,0,o.id)}}return s&&t<=this.mainCol&&this.mainCol++,this._sections[o.id]=o.type,{isAdded:!0,status:"success",payload:o}}removeSection(t){let{id:e,isVertical:s,type:i}=t,n=this.sectionsIds.findIndex(t=>t.ids.includes(e));if(-1===n){if(this.headerId!==e&&this.footerId!==e)return{isRemoved:!1,status:"error",message:"Could not locate section on this page: "+this.id};n=this.mainCol}if(s)this.sectionsIds.splice(n,1),n<this.mainCol&&this.mainCol--;else switch(i){case"header":this.headerId=null;break;case"footer":this.footerId=null;break;default:let r=this.sectionsIds[n].ids.indexOf(e);if(-1===r)return{isRemoved:!1,status:"error",message:"Could not locate section on this page"};this.sectionsIds[n].ids.splice(r,1)}return{isRemoved:!0,status:"success"}}constructor(t,e,s){this._title=t,this._type=e,this._parentWap=s,this._id=(0,i.qR)(),this._name="Page",this._breakpoints=o.defaultBreakpoints,this._styles=o.defaultBreakpoints.reduce((t,e)=>(t[e]={},t),{}),this._globalStyles={},this._sections={},this._sectionsIds=[{ids:[],isVertical:!1,width:"1fr"}],this._headerId=null,this._footerId=null,this._mainColIdx=0;let n=s.globals;if(s.pages[this.id]=this,n.header.defaultId?(this._headerId=n.header.defaultId,this.sections[this._headerId]="header",this.sectionsIds[this.mainCol].ids=[this.headerId]):s.addSectionToPage(this._id,0,"header",!1,!1),n.section.ids.length){let t=n.section.ids.reduce((t,e)=>(t[e]=s.sections[e].type,t),{});this.sections=t}else s.addSectionToPage(this._id,1,"section",!1,!1);n.footer.defaultId?(this._footerId=n.footer.defaultId,this.sections[this._footerId]="footer",this.sectionsIds[this.mainCol].ids.push(this.footerId)):s.addSectionToPage(this._id,this._sectionsIds[this._mainColIdx].ids.length,"footer",!1,!1)}}o.minBreakpoint=320,o.maxBreakpoint=1e4,o.maxBreakpointCount=6,o.defaultBreakpoints=[1250,1e3,750,500,319],o.defaultNewColWidth="800px";class l{get id(){return this._id}get name(){return this._name}set name(t){this._name=t.trim(),this._url=t.trim().split(" ").join("-")}get url(){return this._url}set url(t){this._url=t}get pages(){return this._pages}set pages(t){this._pages=t}get formattedPages(){let t={};return Object.values(this._pages).forEach(e=>{t[e.type]||(t[e.type]=[]),t[e.type].push(e)}),t}get page(){return t=>this._pages[t]||null}newPage(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"My Page",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Main Pages";new o(t,e,this)}removePage(t){if(!this.pages[t])return{isRemoved:!1,status:"error",message:"Page of id: "+t+" was not found"};let e=this.pages[t];return Object.keys(this.sections).forEach(e=>this.removeSectionFromPage(t,e)),delete this.pages[t],{isRemoved:!0,status:"success",payload:e}}get langs(){return this._langs}set langs(t){this._langs=t,this._mainLang=t[0]}get mainLang(){return this._mainLang}set mainLang(t){this._mainLang=t;let e=this._langs.indexOf(t);-1!==e&&this._langs.splice(e,1),this._langs.unshift(t)}addLang(t){let e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this._langs.includes(t)?{isAdded:!1,status:"warning",message:"Language already exists in wap`s supported languages"}:(e?(this._langs.unshift(t),this._mainLang=t):this._langs.push(t),{isAdded:!0,status:"success"})}removeLang(t){if(1===this._langs.length)return{isRemoved:!1,status:"warning",message:"Cannot remove last remaining language"};let e=this._langs.indexOf(t);return -1===e?{isRemoved:!1,status:"error",message:"Language not found in wap`s supported languages"}:(this._langs.splice(e,1),this._mainLang===t&&(this._mainLang=this._langs[0]),{isRemoved:!0,status:"success"})}get globals(){return this._globals}set globals(t){Object.values(this._globals).forEach(t=>{t.ids.forEach(t=>this._sections[t].isGlobal=!1)}),this._globals=t,Object.values(t).forEach(t=>{t.ids.forEach(t=>this._sections[t].isGlobal=!0)})}get sectionByTypes(){return Object.values(this._sections).reduce((t,e)=>(t[e.type]||(t[e.type]={}),t[e.type][e.id]=e,t),{})}get sections(){return this._sections}set sections(t){this._sections=t}addToGlobals(t,e){var s,i,n;return(null===(s=this.globals[e])||void 0===s?void 0:null===(i=s.ids)||void 0===i?void 0:i.includes(t.id))?{isAdded:!1,status:"warning",message:"Section already in globals"}:(null===(n=this.globals[e])||void 0===n||n.ids.push(t.id),this.globals[e].defaultId||(this.globals[e].defaultId=t.id),this.sections[t.id].isGlobal=!0,{isAdded:!0,status:"success"})}removeFromGlobals(t,e){var s;let i=this.globals[e].ids.indexOf(t);return -1===i?{isRemoved:!1,status:"error",message:"Section not found in globals of type: "+e}:(this.globals[e].ids.splice(i,1),this.globals[e].defaultId&&this.globals[e].ids[0],(null===(s=this.sections[t])||void 0===s?void 0:s.isGlobal)&&(this.sections[t].isGlobal=!1),{isRemoved:!0,status:"success"})}addSectionToPage(t,e,s,i,n,r){let a=this._pages[t];if(!a)return{isAdded:!1,status:"error",message:"Page not found"};let o=a.addSection(e,s,i,n,r);if(!o.isAdded)return{...o};let l=o.payload;return this._sections[l.id]=l,n&&this._globals[s].ids.push(l.id),o}addExistingSectionToPage(t,e){let s=this._pages[t];if(!s)return{isAdded:!1,status:"error",message:"Page not found"}}removeSectionFromPage(t,e){let s=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=this.pages[t];if(!i)return{isRemoved:!1,status:"error",message:"Page not found"};let n=this.sections[e],r=i.removeSection(n);return r.isRemoved?(n.isGlobal?s&&(Object.values(this.pages).forEach(t=>this.removeSectionFromPage(t.id,e)),this.removeFromGlobals(e,n.type)):delete this.sections[e],{...r,payload:n}):r}deleteSection(t){let e=Object.values(this.pages)[0];e?this.removeSectionFromPage(e.id,t,!0):(this.removeFromGlobals(t,this.sections[t].type),delete this.sections[t])}addBreakpoint(t,e){let s=this._pages[t];if(!s)return{isAdded:!1,status:"error",message:"Page not found"};let i=s.addBreakpoint(e);if(!i.isAdded)return i;let{miniSections:n}=s;return Object.keys(n).forEach(t=>{var s;null===(s=this._sections[t])||void 0===s||s.addContainerBreakpoint(e)}),i}updateBreakpoint(t,e,s){let i=this._pages[t];if(!i)return{isUpdated:!1,status:"error",message:"Page not found"};let n=i.updateBreakpoint(e,s);if(!n.isUpdated)return n;let r=n.payload,{miniSections:a}=i;return Object.keys(a).forEach(t=>{var e;null===(e=this._sections[t])||void 0===e||e.updateContainerBreakpoint(r,s)}),n}removeBreakpoint(t,e){let s=this._pages[t];if(!s)return{isRemoved:!1,status:"error",message:"Page not found"};let i=s.removeBreakpoint(e);if(!i.isRemoved)return i;let{miniSections:n}=s;return Object.keys(n).forEach(t=>{var e;null===(e=this._sections[t])||void 0===e||e.removeContainerBreakpoint(i.payload)}),i}deletePages(){Object.keys(this.pages).forEach(t=>this.removePage(t))}deleteSections(){Object.keys(this.sections).forEach(t=>this.deleteSection(t))}deleteGlobals(){this.globals={header:{ids:[],defaultId:null},footer:{ids:[],defaultId:null},section:{ids:[],defaultId:null}}}constructor(t){this._name=t,this._id=(0,i.qR)(),this._pages={},this._sections={},this._globals={header:{ids:[],defaultId:null},footer:{ids:[],defaultId:null},section:{ids:[],defaultId:null}},this._mainLang="us",this._langs=["us","il"],this._url=t.trim().split(" ").join("-");let e=new a("header",!1,!0,this,o.defaultBreakpoints),s=new a("footer",!1,!0,this,o.defaultBreakpoints);this._sections={[e.id]:e,[s.id]:s},this.addToGlobals(e,"header"),this.addToGlobals(s,"footer"),this.newPage("Home","Main Pages")}}class d extends l{}class h extends o{}class u extends n{}class c extends r{}},3526:function(t,e,s){s.d(e,{D4:function(){return c},Gi:function(){return u},Kq:function(){return o},YE:function(){return h},ao:function(){return function t(e,s){for(let i in s){let n=s[i];void 0===n?delete e[i]:!Array.isArray(e[i])&&void 0!==e[i]&&(Array.isArray(n)||n instanceof Object)?t(e[i],n):e[i]=n}}},eg:function(){return l},gt:function(){return a},kC:function(){return r},qR:function(){return n},uO:function(){return g},uf:function(){return d}});var i=s(5581);function n(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5,s="abcdefghojklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321",i="";for(let n=0;n<e;n++){n&&(i+="-");for(let e=0;e<t;e++){let t=function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return Math.floor(Math.random()*(Math.floor(t)-Math.ceil(e)+(s?1:0))+Math.ceil(e))}(s.length);i+=s.charAt(t)}}return i}function r(t){return t.charAt(0).toUpperCase()+t.slice(1)}function a(t,e,s){if(s>=t||s<=0)return{isAdded:!1,status:"error",message:"New divider out of container bounds"};if(!e.length)return{isAdded:!0,status:"success",payload:[{unit:"fr",value:s/t}]};let{sizeMap:n}=h(t,i.wl.getFormattedGridTemplate(e));if(n.fr<0)return{isAdded:!1,status:"warning",message:"Total size exceeds container size"};let r=0,a=[];for(let t=0;t<e.length;t++){let{unit:i,value:o}=e[t],l=o*n[i];if(r+l<s)r+=l,a.push({unit:i,value:o});else{if(r+l===s)return{isAdded:!1,status:"info",message:"Divider in unison with another existing divider"};let o=(s-r)/n[i],d=(r+l-s)/n[i];a.push({unit:i,value:o},{unit:i,value:d},...e.slice(t+1));break}}return{isAdded:!0,status:"success",payload:a}}function o(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,s=+[...t.match(/[+-]?([0-9]*[.])?[0-9]+/)||[]][0];if(isNaN(s))return{size:0,unit:"px"};s=-1!==e?d(s,e):d(s);let i=[...t.match(/(v[hw])|(px)|(fr)|(%)/)||[]][0]||"px";return{size:s,unit:i}}function l(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,s=+[...t.match(/[+-]?([0-9]*[.])?[0-9]+/)||[]][0];if(isNaN(s))return["max-content","min-content","fit-content"].includes(t.trim())?{size:"",unit:t.trim().replace(/\-c\S/,"-c")}:["auto","none"].includes(t.trim())?{size:0,unit:t.trim()}:{size:"",unit:"auto"};s=-1!==e?d(s,e):d(s);let i=[...t.match(/(v[hw])|(px)|(max-c)|(fit-c)|(min-c)|(%)|(auto)|(none)/)||[]][0]||"px";return{size:s,unit:i}}function d(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10;if(t%1==0)return t;let s=1,i=0,n=+t.toFixed(e);for(let t=0;t<e;t++){if(n%s==0)return+n.toFixed(i);i++,s/=10}return+t.toFixed(e)}function h(t,e,s){let i={fr:0,"%":0,px:0,vh:0,vw:0},n=[];e.forEach((t,e)=>{let r=t.trim();if(r.includes("minmax")&&s)i.px+=s[e],n.push({size:s[e],unit:"px"});else{let{size:t,unit:e}=o(r);i[e]+=t,n.push({size:t,unit:e})}});let r=d(+(t/100)),a=window.innerHeight/100,l=window.innerWidth/100,h=i.fr?d((t-i.px-i["%"]*r-i.vh*a-i.vw*l)/i.fr):0,u={fr:h,"%":r,px:1,vw:l,vh:a},c=[],g=n.map((t,e)=>{let{size:s,unit:i}=t,n=s*u[i];return c.push((0===e?0:c[e-1])+n),n});return{totalUnits:i,sizeMap:u,cumulativeSizes:c,absoluteSizes:g}}function u(t,e){return t.map(t=>t.minmax?t.minmax.min.value*e[t.minmax.min.unit]:t.value*e[t.unit])}function c(t,e){for(let s in t.sections){let i=t.sections[e];if(s===e)return{map:i,breadcrumbs:[s]};let n=function t(e,s,i){if(!e.children)return null;for(let n in e.children){if(n===s)return{map:e.children[s],breadcrumbs:[n]};let r=t(e.children[n],s,i);if(r)return{...r,breadcrumbs:[n,...r.breadcrumbs]}}return null}(i,e,[]);if(n)return{...n,breadcrumbs:[s,...n.breadcrumbs]}}return null}function g(t){if(1===t||!t)return[[t||0,t||0]];let e=[],s=[];for(let i=1;i<=Math.sqrt(t);i++){let n=t/i;n===parseInt(""+n)&&(e.push([i,n]),i!==n&&s.unshift([n,i]))}return[...e,...s]}}}]);