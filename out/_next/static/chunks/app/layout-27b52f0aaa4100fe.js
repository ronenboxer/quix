(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{5123:function(e,n,t){Promise.resolve().then(t.t.bind(t,6331,23)),Promise.resolve().then(t.bind(t,4740)),Promise.resolve().then(t.bind(t,3437))},4740:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return _}});var o=t(9268),r=t(9638),i=t(1947),s=t(1007),l=t(9843),a=t(5793),c=t(4240),d=t(4200),u=t(1771),p=t(9744),h=t(9714),x=t(7455),g=t(3263),f=t(4930),m=t(7931),Z=t(6006),j=t(601),v=t(6008);function y(e){let{shouldNavigateToHome:n=!0}=e,t=(0,v.useRouter)();return(0,o.jsxs)("span",{className:"app-logo exo",onClick:function(){t.replace("/")},children:["Q",(0,o.jsx)("span",{className:"bolder",children:"UI"}),"X"]})}var b=t(7305),k=t(9724),w=function(){let[e,n]=(0,Z.useState)({width:0,height:0}),t=()=>{n({width:window.innerWidth,height:window.innerHeight})};return(0,b.Z)("resize",t),(0,k.Z)(()=>{t()},[]),e},L=t(2443),S=t(2493),C=t(6932),E=t(7090),N=t(486),O=t(4417);function T(){let e=(0,v.useRouter)(),n=[{title:"My Sites",name:"My Sites",icon:(0,o.jsx)(L.Z,{})},{title:"Templates",name:"Templates",icon:(0,o.jsx)(S.Z,{})},{title:"Tools",name:"Tools",icon:(0,o.jsx)(C.Z,{})}],[t,b]=(0,Z.useState)(null),[k,T]=(0,Z.useState)(!1);w();let _=(0,r.Z)({breakpoints:{values:{xs:0,sm:400,md:800,lg:1200,xl:1536}},palette:{background:{paper:"#fff"},text:{primary:"#333",secondary:E.Z[900]},action:{active:N.Z[400],hover:E.Z[700],selected:E.Z[200],disabled:O.Z[500]}}});function z(e){b(e.currentTarget)}function A(){b(null)}return(0,o.jsx)("section",{className:"app-nav relative",children:(0,o.jsx)(i.Z,{theme:_,children:(0,o.jsx)(s.Z,{position:"static",sx:{bgcolor:"background.paper",color:"text.primary",boxShadow:"none"},children:(0,o.jsx)(l.Z,{maxWidth:"xl",children:(0,o.jsxs)(a.Z,{disableGutters:!0,children:[(0,o.jsx)(c.Z,{variant:"h5",noWrap:!0,component:"a",href:"",sx:{marginInlineEnd:2,paddingBlock:"auto",display:{xs:"none",sm:"flex"},fontFamily:'"Exo 2"',fontWeight:200,letterSpacing:".3rem",color:"text.primary",textDecoration:"none"},children:(0,o.jsx)(y,{})}),(0,o.jsx)(d.Z,{}),(0,o.jsxs)(u.Z,{sx:{flexGrow:0,display:{xs:"none",sm:"flex"},borderInlineStart:"1px solid #e5e5e5",paddingInlineStart:2,gap:1},children:[(0,o.jsx)(p.Z,{title:"Open settings",children:(0,o.jsx)(h.Z,{onClick:z,sx:{p:0,flexGrow:0,height:"fit-content",alignSelf:"center"},children:(0,o.jsx)(x.Z,{alt:"Remy Sharp",src:""})})}),(0,o.jsx)(g.Z,{sx:{mt:"45px"},id:"menu-appbar",anchorEl:t,anchorOrigin:{vertical:"top",horizontal:"right"},keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:!!t,onClose:A,children:["Profile","Account","Dashboard","Logout"].map(e=>(0,o.jsx)(f.Z,{onClick:A,children:(0,o.jsx)(c.Z,{textAlign:"center",children:e})},e))}),n.map(n=>(0,o.jsx)(m.Z,{sx:{my:2,color:"text.primary",display:"block",":hover":{color:"action.hover"}},onClick:()=>e.push("wap/id/edit"),children:n.title},n.title))]}),(0,o.jsxs)(u.Z,{sx:{flexGrow:1,display:{xs:"flex",sm:"none"},justifyContent:"space-between"},children:[(0,o.jsx)(h.Z,{size:"large","aria-label":"account of current user","aria-controls":"menu-appbar","aria-haspopup":"true",onClick:()=>(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:!k;T(e)})(!0),color:"inherit",children:(0,o.jsx)(j.Z,{})}),(0,o.jsx)(p.Z,{title:"Open settings",children:(0,o.jsx)(h.Z,{onClick:z,sx:{p:0},children:(0,o.jsx)(x.Z,{alt:"Remy Sharp",src:""})})})]})]})})})})})}function _(e){let{children:n}=e,t=(0,r.Z)({palette:{primary:{main:O.Z[400],light:O.Z[200],dark:O.Z[800]},background:{paper:"#fff"},text:{primary:"#2962ff",secondary:"#46505A"},action:{active:"#173A5E",focus:"#2962ff"}}});return(0,o.jsx)(i.Z,{theme:t,children:(0,o.jsxs)(l.Z,{sx:{width:"100dvw",maxWidth:"unset !important",height:"100dvh",display:"flex",flexDirection:"column",padding:"0 !important",margin:"0 !important"},children:[(0,o.jsx)(T,{}),n]})})}},3437:function(e,n,t){"use strict";t.r(n),t.d(n,{Providers:function(){return g}});var o=t(9268),r=t(7539),i=t(3526);let s=(0,r.oM)({name:"wapStore",initialState:{undoLogs:[],redoLogs:[],actionResults:null},reducers:{addBreakpoint:(e,n)=>{},undo:(e,n)=>{if(e.undoLogs.length){let t=e.undoLogs.slice(-1)[0];return(0,i.ao)(n.payload,t),{...e,undoLogs:[...e.undoLogs.slice(0,-1)],redoLogs:[...e.redoLogs,t]}}return{...e}},redo:e=>{if(e.redoLogs.length){let n=e.redoLogs.pop();return e.undoLogs.push(n),n}return null},addActionToUndoLogs:(e,n)=>{e.redoLogs=[],e.undoLogs=[...e.undoLogs,n.payload]}}}),{undo:l,redo:a,addActionToUndoLogs:c,addBreakpoint:d}=s.actions,{undoLogs:u}=s.getInitialState();var p=s.reducer;let h=(0,r.xC)({reducer:{wapEdit:p}});var x=t(580);function g(e){let{children:n}=e;return(0,o.jsx)(x.zt,{store:h,children:n})}},6331:function(){}},function(e){e.O(0,[843,11,486,726,667,139,744],function(){return e(e.s=5123)}),_N_E=e.O()}]);