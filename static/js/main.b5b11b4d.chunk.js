(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{124:function(e){e.exports={api:"https://api.mobilelibraries.org"}},295:function(e,t,a){e.exports=a(394)},394:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(13),i=a.n(o),l=a(26),s=a(27),c=a(29),m=a(28),u=a(30),p=a(131),b=a(237),d=a(287),h=a.n(d),f=a(288),g=a.n(f),E=a(289),v=a.n(E),_=a(128),y=a(267),w=a(4),O=a(53),j=a(2),k=a(221),x=a(46),S=a(218),N=a(197),C=a(222),B=a(223),D=a(224),I=a(144),z=a.n(I),M=a(142),R=a.n(M),F=a(268),P=a.n(F),A=a(145),T=a.n(A),W=a(94),H=a.n(W),L=a(68),G=a.n(L),Z=function(e){function t(){return Object(l.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e,t,a=this,n=this.props,o=n.drawer_open,i=n.classes,l=n.theme;return r.a.createElement(x.a,{variant:"permanent",className:Object(j.a)(i.drawer,(e={},Object(O.a)(e,i.drawerOpen,o),Object(O.a)(e,i.drawerClose,!o),e)),classes:{paper:Object(j.a)((t={},Object(O.a)(t,i.drawerOpen,o),Object(O.a)(t,i.drawerClose,!o),t))},open:o},r.a.createElement("div",{className:i.toolbar},r.a.createElement(S.a,{onClick:this.props.closeDrawer},"rtl"===l.direction?r.a.createElement(R.a,null):r.a.createElement(z.a,null))),r.a.createElement(k.a,null),r.a.createElement(N.a,null,r.a.createElement(C.a,{button:!0,onClick:function(){return a.props.setDashboard("organisations")}},r.a.createElement(B.a,{className:i.listItemIcon},r.a.createElement(P.a,null)),r.a.createElement(D.a,{primary:"Organisations"})),r.a.createElement(C.a,{button:!0,onClick:function(){return a.props.setDashboard("mobiles")}},r.a.createElement(B.a,{className:i.listItemIcon},r.a.createElement(T.a,null)),r.a.createElement(D.a,{primary:"Mobiles"})),r.a.createElement(C.a,{button:!0,onClick:function(){return a.props.setDashboard("routes")}},r.a.createElement(B.a,{className:i.listItemIcon},r.a.createElement(H.a,null)),r.a.createElement(D.a,{primary:"Routes"})),r.a.createElement(C.a,{button:!0,onClick:function(){return a.props.setDashboard("stops")}},r.a.createElement(B.a,{className:i.listItemIcon},r.a.createElement(G.a,null)),r.a.createElement(D.a,{primary:"Stops"}))))}}]),t}(n.Component),J=Object(w.a)(function(e){return{drawer:{width:240,flexShrink:0,whiteSpace:"nowrap"},drawerOpen:{width:240,transition:e.transitions.create("width",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.enteringScreen})},drawerClose:Object(O.a)({transition:e.transitions.create("width",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen}),overflowX:"hidden",width:e.spacing(7)+1},e.breakpoints.up("sm"),{width:e.spacing(9)+1}),toolbar:Object(p.a)({display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 8px"},e.mixins.toolbar),listItemIcon:Object(O.a)({},e.breakpoints.up("sm"),{paddingLeft:"8px"})}},{withTheme:!0})(Z),X=a(225),$=a(226),q=a(77),K=a(270),Q=a.n(K),U=a(271),V=a.n(U),Y=a(269),ee=a.n(Y),te=function(e){function t(){return Object(l.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.drawer_open;return r.a.createElement(X.a,{position:"fixed",elevation:0,color:"default",className:Object(j.a)(a.appBar,Object(O.a)({},a.appBarShift,n))},r.a.createElement($.a,null,r.a.createElement(S.a,{color:"inherit","aria-label":"Open drawer",onClick:this.props.openDrawer,edge:"start",className:Object(j.a)(a.menuButton,Object(O.a)({},a.hide,n))},r.a.createElement(ee.a,null)),r.a.createElement(q.a,{variant:"h6",color:"inherit",noWrap:!0},"Mobile Libraries"),r.a.createElement("div",{className:a.grow}),r.a.createElement(S.a,{onClick:function(){return e.props.setPage("dashboard")}},r.a.createElement(Q.a,null)),r.a.createElement(S.a,{onClick:function(){return e.props.setPage("map")}},r.a.createElement(V.a,null))))}}]),t}(n.Component),ae=Object(w.a)(function(e){return{appBar:{zIndex:e.zIndex.drawer+1,transition:e.transitions.create(["width","margin"],{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen})},appBarShift:{marginLeft:240,width:"calc(100% - ".concat(240,"px)"),transition:e.transitions.create(["width","margin"],{easing:e.transitions.easing.sharp,duration:e.transitions.duration.enteringScreen})},grow:{flexGrow:1},menuButton:{marginRight:36},hide:{display:"none"}}},{withTheme:!0})(te),ne=a(227),re=a(234),oe=a(232),ie=a(233),le=a(228),se=a(230),ce=a(229),me=a(265),ue=a(231),pe=a(69),be=a.n(pe),de=a(264),he=a(106),fe=a.n(he),ge=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.mobile,o=t.organisation,i=t.location;return r.a.createElement(ne.a,{item:!0,xs:4},r.a.createElement(le.a,{className:a.card,elevation:0},r.a.createElement(ce.a,null,r.a.createElement(q.a,{className:a.title,color:"textSecondary",gutterBottom:!0},o?o.name:""),r.a.createElement(q.a,{variant:"h6",component:"h2"},n.name),r.a.createElement(de.a,{separator:"\u203a"},i&&i.previous_stop_id?r.a.createElement(me.a,{size:"small",label:i.previous_stop_name}):null,i&&!i.current_stop_id&&!i.previous_stop_id&!i.geox?r.a.createElement(me.a,{size:"small",color:"primary",label:"Off Road"}):null,i&&!i.current_stop_id&&i.previous_stop_id&&i.next_stop_id&&i.geox?r.a.createElement(me.a,{size:"small",color:"primary",label:"Travelling"}):null,i&&i.current_stop_id?r.a.createElement(me.a,{size:"small",color:"primary",label:i.current_stop_name}):null,i&&i.next_stop_id?r.a.createElement(me.a,{size:"small",label:fe()(i.next_stop_arrival).format("HH:mma")+" "+i.next_stop_name}):null)),r.a.createElement(k.a,{variant:"middle"}),r.a.createElement(se.a,null,r.a.createElement(ue.a,{title:"Mobile library stops"},r.a.createElement(oe.a,{color:"primary",badgeContent:n.number_stops,className:a.margin},r.a.createElement(ie.a,{size:"small",color:"primary",className:a.button,onClick:function(){return e.props.viewStopsByMobile(n.id)}},r.a.createElement(G.a,{className:a.leftIcon}),"Stops"))),r.a.createElement(ue.a,{title:"Mobile library routes"},r.a.createElement(oe.a,{color:"primary",badgeContent:n.number_routes,className:a.margin},r.a.createElement(ie.a,{size:"small",color:"primary",className:a.button},r.a.createElement(H.a,{className:a.leftIcon}),"Routes"))),r.a.createElement(k.a,{className:a.verticalDivider}),r.a.createElement(ue.a,{title:"Download PDF timetable for mobile"},r.a.createElement(S.a,null,r.a.createElement(be.a,null))))))}}]),t}(n.Component),Ee=Object(w.a)(function(e){return{card:{minWidth:275,border:"1px solid rgba(0, 0, 0, 0.12)"},bullet:{display:"inline-block",margin:"0 2px",transform:"scale(0.8)"},margin:{margin:e.spacing(2)},verticalDivider:{width:1,height:28,margin:8},leftIcon:{marginRight:e.spacing(1)},title:{fontSize:12,fontWeight:500}}},{withTheme:!0})(ge),ve=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.mobiles,o=t.organisation_lookup,i=t.mobile_location_lookup;return r.a.createElement("div",{className:a.root},r.a.createElement(re.a,null,"Mobile libraries"),r.a.createElement(ne.a,{container:!0,spacing:3},n.map(function(t,a){return r.a.createElement(Ee,{key:"crd_"+t.name.replace(" ","")+"_"+a,mobile:t,location:i[t.id],organisation:o[t.organisation_id],viewStopsByMobile:e.props.viewStopsByMobile})})))}}]),t}(n.Component),_e=Object(w.a)(function(e){return{root:{flexGrow:1}}},{withTheme:!0})(ve),ye=a(79),we=a(235),Oe=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.props,t=e.classes;e.mobile;return r.a.createElement(we.a,{size:"small",color:"primary",className:t.fab},r.a.createElement(T.a,null))}}]),t}(n.Component),je=Object(w.a)(function(e){return{fab:{margin:e.spacing(1),boxShadow:"none"}}},{withTheme:!0})(Oe),ke=Object(ye.e)({minZoom:7,maxZoom:18,scrollZoom:!0,interactive:!0,dragRotate:!0,attributionControl:!0}),xe=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.props,t=e.position,a=e.zoom,n=e.pitch,o=e.bearing,i=e.fit_bounds,l=e.mobile_locations,s=e.mobile_lookup;return r.a.createElement(ke,{style:"style.json",center:t,zoom:a,maxZoom:17,pitch:n,bearing:o,fitBounds:i,containerStyle:{top:0,bottom:0,right:0,left:0,height:"100vh",width:"100vw",position:"absolute"}},l&&l.length>0?l.map(function(e){return r.a.createElement(ye.b,{coordinates:[e.geox,e.geoy],anchor:"bottom"},r.a.createElement(je,{mobile:s[e.mobile_id]}))}):null,r.a.createElement(ye.c,{id:"src_stops",tileJsonSource:{type:"vector",tiles:["https://api.mobilelibraries.org/api/stops/{z}/{x}/{y}.mvt"]}}),r.a.createElement(ye.a,{id:"lyr_stops_circles",type:"circle",sourceId:"src_stops",sourceLayer:"stop",layout:{},paint:{"circle-radius":4,"circle-color":"#36A2EB","circle-stroke-width":1,"circle-stroke-color":"#FFFFFF","circle-opacity":.8}}),r.a.createElement(ye.a,{id:"lyr_stops_labels",type:"symbol",sourceId:"src_stops",sourceLayer:"stop",layout:{"text-ignore-placement":!0,"text-field":["to-string",["get","name"]],"text-size":["interpolate",["linear"],["zoom"],12,9,14,11],"text-font":["Source Sans Pro Regular"],"text-line-height":1,"text-anchor":"top"},paint:{"text-halo-color":"#FFFFFF","text-halo-width":1,"text-halo-blur":1,"text-color":"#36A2EB"}}),r.a.createElement(ye.d,{position:"bottom-right"}))}}]),t}(n.Component),Se=Object(w.a)(function(e){return{}},{withTheme:!0})(xe),Ne=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.organisation;return r.a.createElement(ne.a,{item:!0,xs:4},r.a.createElement(le.a,{className:a.card,elevation:0},r.a.createElement(ce.a,null,r.a.createElement(q.a,{className:a.title,color:"textSecondary",gutterBottom:!0},"Scotland"),r.a.createElement(q.a,{variant:"h6",component:"h2"},n.name)),r.a.createElement(se.a,null,r.a.createElement(ue.a,{title:"Mobile library stops"},r.a.createElement(oe.a,{color:"primary",badgeContent:n.number_stops,className:a.margin},r.a.createElement(ie.a,{size:"small",color:"primary",className:a.button,onClick:function(){return e.props.viewStopsByOrganisation(n.id)}},r.a.createElement(G.a,{className:a.leftIcon}),"Stops"))),r.a.createElement(ue.a,{title:"Mobile library routes"},r.a.createElement(oe.a,{color:"primary",badgeContent:n.number_routes,className:a.margin},r.a.createElement(ie.a,{size:"small",color:"primary",className:a.button},r.a.createElement(H.a,{className:a.leftIcon}),"Routes"))),r.a.createElement(k.a,{className:a.verticalDivider}),r.a.createElement(ue.a,{title:"Download PDF timetable for mobile"},r.a.createElement(S.a,null,r.a.createElement(be.a,null))))))}}]),t}(n.Component),Ce=Object(w.a)(function(e){return{card:{minWidth:275,border:"1px solid rgba(0, 0, 0, 0.12)"},bullet:{display:"inline-block",margin:"0 2px",transform:"scale(0.8)"},margin:{margin:e.spacing(2)},verticalDivider:{width:1,height:28,margin:8},leftIcon:{marginRight:e.spacing(1)},title:{fontSize:12,fontWeight:500}}},{withTheme:!0})(Ne),Be=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.organisations;return r.a.createElement("div",{className:a.root},r.a.createElement(re.a,null,"Mobile library organisations"),r.a.createElement(ne.a,{container:!0,spacing:3},n.map(function(t,a){return r.a.createElement(Ce,{key:"crd_"+t.name.replace(" ","")+"_"+a,organisation:t,viewStopsByOrganisation:e.props.viewStopsByOrganisation})})))}}]),t}(n.Component),De=Object(w.a)(function(e){return{root:{flexGrow:1}}},{withTheme:!0})(Be),Ie=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.route,o=t.organisation,i=t.mobile;return r.a.createElement(ne.a,{item:!0,xs:4},r.a.createElement(le.a,{className:a.card,elevation:0},r.a.createElement(ce.a,null,r.a.createElement(q.a,{className:a.title,color:"textSecondary",gutterBottom:!0},o?o.name+" ":"",i?i.name:""),r.a.createElement(q.a,{variant:"h6",component:"h2"},n.name)),r.a.createElement(k.a,{variant:"middle"}),r.a.createElement(se.a,null,r.a.createElement(ue.a,{title:"Route stops"},r.a.createElement(oe.a,{color:"primary",badgeContent:n.number_stops,className:a.margin},r.a.createElement(ie.a,{size:"small",color:"primary",className:a.button,onClick:function(){return e.props.viewStopsByRoute(n.id)}},r.a.createElement(G.a,{className:a.leftIcon}),"Stops"))),r.a.createElement(k.a,{className:a.verticalDivider}),r.a.createElement(ue.a,{title:"Download PDF timetable for route"},r.a.createElement(S.a,null,r.a.createElement(be.a,null))))))}}]),t}(n.Component),ze=Object(w.a)(function(e){return{card:{minWidth:275,border:"1px solid rgba(0, 0, 0, 0.12)"},bullet:{display:"inline-block",margin:"0 2px",transform:"scale(0.8)"},margin:{margin:e.spacing(2)},verticalDivider:{width:1,height:28,margin:8},leftIcon:{marginRight:e.spacing(1)},title:{fontSize:12,fontWeight:500}}},{withTheme:!0})(Ie),Me=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.routes,o=t.organisation_lookup,i=t.mobile_lookup;return r.a.createElement("div",{className:a.root},r.a.createElement(re.a,null,"Mobile library routes"),r.a.createElement(ne.a,{container:!0,spacing:3},n.map(function(t,a){return r.a.createElement(ze,{key:"dsm_"+t.name.replace(" ","")+"_"+a,route:t,organisation:o[t.organisation_id],mobile:i[t.mobile_id],viewStopsByRoute:e.props.viewStopsByRoute})})))}}]),t}(n.Component),Re=Object(w.a)(function(e){return{root:{flexGrow:1}}},{withTheme:!0})(Me),Fe=a(75),Pe=a(274),Ae=a.n(Pe),Te=a(286),We=a.n(Te),He=a(284),Le=a.n(He),Ge=a(283),Ze=a.n(Ge),Je=a(285),Xe=a.n(Je),$e=a(61),qe=a.n($e),Ke=a(124);var Qe=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(o)))).state={title:"All stops"},a.tableRef=r.a.createRef(),a.getStopCalendar=function(e,t){},a.getStopPdf=function(e,t){},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.props,t=e.classes,a=e.organisation_lookup,n=e.mobile_lookup,o=e.route_lookup,i={};Object.keys(a).forEach(function(e){i[e]=a[e].name});var l={};Object.keys(n).forEach(function(e){l[e]=n[e].name});var s={};return Object.keys(o).forEach(function(e){s[e]=o[e].name}),r.a.createElement("div",{style:{maxWidth:"100%"}},r.a.createElement(re.a,null,"Mobile library stops"),r.a.createElement(Ae.a,{tableRef:this.tableRef,components:{Container:function(e){return r.a.createElement(Fe.a,Object.assign({},e,{elevation:0,className:t.table}))}},icons:{Filter:Ze.a,FirstPage:Le.a,LastPage:Xe.a,NextPage:R.a,PreviousPage:z.a},options:{search:!1,loadingType:"linear",actionsColumnIndex:6,filtering:!0},columns:[{title:"Name",field:"name",filtering:!1},{title:"Community",field:"community",filtering:!1},{title:"Organisation",field:"organisation_id",type:"numeric",defaultFilter:this.props.organisation_filter,lookup:i,fitering:!0},{title:"Mobile",field:"mobile_id",type:"numeric",defaultFilter:this.props.mobile_filter,lookup:l,filtering:!0},{title:"Route",field:"route_id",type:"numeric",defaultFilter:this.props.route_filter,lookup:s,filtering:!0},{title:"Arrival",field:"arrival",filtering:!1,render:function(e){return fe()(e.arrival,"HH:mm:ssZ").format("HH:mma")}},{title:"Departure",field:"departure",filtering:!1,render:function(e){return fe()(e.departure,"HH:mm:ssZ").format("HH:mma")}}],actions:[{icon:function(){return r.a.createElement(We.a,{color:"action",fontSize:"small"})},iconProps:{color:"primary"},tooltip:"Download stop calendar",onClick:this.getStopCalendar},{icon:function(){return r.a.createElement(be.a,{color:"action",fontSize:"small"})},iconProps:{color:"primary"},tooltip:"Download stop as PDF",onClick:this.getStopPdf}],data:function(e){return new Promise(function(t,a){!function(e,t){var a=[],n=[],r=[];e.filters&&e.filters.length>0&&e.filters.forEach(function(e){"organisation_id"===e.column.field&&(a=e.value),"mobile_id"===e.column.field&&(n=e.value),"route_id"===e.column.field&&(r=e.value)});var o=Ke.api+"/api/stops?page="+(e.page+1)+"&limit="+e.pageSize;e.orderBy&&e.orderBy.field&&(o=o+"&sort="+e.orderBy.field+"&direction="+e.orderDirection),n.length>0&&(o=o+"&mobile_ids="+n.join("|")),a.length>0&&(o=o+"&organisation_ids="+a.join("|")),r.length>0&&(o=o+"&route_ids="+r.join("|")),qe.a.get(o).then(function(e){e&&e.data?t({stops:e.data,total:parseInt(e.headers["x-total-count"]),page:parseInt(e.headers["x-page"])}):t({stops:[],total:0,page:1})}).catch(function(e){return t({stops:[],total:0,page:1})})}(e,function(e){t({data:e.stops,page:e.page-1,totalCount:e.total})})})},title:this.state.title}))}}]),t}(n.Component),Ue=Object(w.a)(function(e){return{root:{flexGrow:1,maxWidth:"100%"},table:{border:"1px solid rgba(0, 0, 0, 0.12)"}}},{withTheme:!0})(Qe),Ve=a(124);var Ye=a(124);var et=a(124);var tt=Object(_.a)({palette:{primary:h.a,secondary:g.a,error:v.a},overrides:{MuiButton:{text:{textTransform:"inherit"}}}}),at=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={drawer_open:!1,page:"dashboard",dashboard:"mobiles",organisations:[],organisation_lookup:{},organisation_filter:[],mobiles:[],mobile_lookup:{},mobile_filter:[],mobile_locations:[],mobile_location_lookup:{},location_timer:null,routes:[],route_lookup:{},route_filter:[],fit_bounds:null,position:[-4.1429,50.3732],zoom:[12],pitch:[0],bearing:[0]},a.getOrganisations=function(){var e;e=function(e){var t={};e.forEach(function(e){return t[e.id]=e}),a.setState({organisations:e,organisation_lookup:t})},qe.a.get(Ye.api+"/api/organisations").then(function(t){t&&t.data?e(t.data):e([])}).catch(function(t){return e([])})},a.getMobiles=function(){var e;e=function(e){var t={};e.forEach(function(e){return t[e.id]=e}),a.setState({mobiles:e,mobile_lookup:t})},qe.a.get(Ve.api+"/api/mobiles").then(function(t){t&&t.data?e(t.data):e([])}).catch(function(t){return e([])})},a.getRoutes=function(){var e;e=function(e){var t={};e.forEach(function(e){return t[e.id]=e}),a.setState({routes:e,route_lookup:t})},qe.a.get(et.api+"/api/routes").then(function(t){t&&t.data?e(t.data):e([])}).catch(function(t){return e([])})},a.getMobileLocations=function(){var e;e=function(e){var t={};e.forEach(function(e){return t[e.mobile_id]=e}),a.setState({mobile_locations:e,mobile_location_lookup:t})},qe.a.get(Ve.api+"/api/mobiles/locations").then(function(t){t&&t.data?e(t.data):e([])}).catch(function(t){return e([])})},a.componentDidMount=function(){a.getOrganisations(),a.getMobiles(),a.getRoutes(),a.getMobileLocations();var e=setInterval(function(){a.getMobileLocations()},15e3);a.setState({location_timer:e})},a.setPage=function(e){return a.setState({page:e})},a.setDashboard=function(e){return a.setState({dashboard:e})},a.viewStopsByOrganisation=function(e){return a.setState({page:"dashboard",dashboard:"stops",organisation_filter:[e]})},a.viewStopsByMobile=function(e){return a.setState({page:"dashboard",dashboard:"stops",mobile_filter:[e]})},a.viewStopsByRoute=function(e){return a.setState({page:"dashboard",dashboard:"stops",route_filter:[e]})},a.openDrawer=function(){return a.setState({drawer_open:!0})},a.closeDrawer=function(){return a.setState({drawer_open:!1})},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.props.classes;return r.a.createElement(y.a,{theme:tt},r.a.createElement("div",{className:e.root},r.a.createElement(b.a,null),r.a.createElement(ae,{drawer_open:this.state.drawer_open,setPage:this.setPage,openDrawer:this.openDrawer}),r.a.createElement(J,{drawer_open:this.state.drawer_open,setDashboard:this.setDashboard,closeDrawer:this.closeDrawer}),r.a.createElement("main",{className:e.content},r.a.createElement("div",{className:e.toolbar}),"dashboard"===this.state.page&&"organisations"===this.state.dashboard?r.a.createElement(De,{organisations:this.state.organisations,viewStopsByOrganisation:this.viewStopsByOrganisation}):null,"dashboard"===this.state.page&&"mobiles"===this.state.dashboard?r.a.createElement(_e,{mobiles:this.state.mobiles,mobile_lookup:this.state.mobile_lookup,mobile_location_lookup:this.state.mobile_location_lookup,organisation_lookup:this.state.organisation_lookup,viewStopsByMobile:this.viewStopsByMobile}):null,"dashboard"===this.state.page&&"routes"===this.state.dashboard?r.a.createElement(Re,{routes:this.state.routes,organisation_lookup:this.state.organisation_lookup,mobile_lookup:this.state.mobile_lookup,viewStopsByRoute:this.viewStopsByRoute}):null,"dashboard"===this.state.page&&"stops"===this.state.dashboard?r.a.createElement(Ue,{organisation_lookup:this.state.organisation_lookup,organisation_filter:this.state.organisation_filter,mobile_lookup:this.state.mobile_lookup,mobile_filter:this.state.mobile_filter,route_lookup:this.state.route_lookup,route_filter:this.state.route_filter}):null,"map"===this.state.page?r.a.createElement(Se,{bearing:this.state.bearing,fit_bounds:this.state.fit_bounds,pitch:this.state.pitch,position:this.state.position,zoom:this.state.zoom,mobile_lookup:this.state.mobile_lookup,mobile_locations:this.state.mobile_locations.filter(function(e){return null!==e.geox})}):null)))}}]),t}(n.Component),nt=Object(w.a)(function(e){return{root:{display:"flex"},toolbar:Object(p.a)({display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 8px"},e.mixins.toolbar),content:{flexGrow:1,padding:e.spacing(3)}}})(at);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(nt,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[295,1,2]]]);
//# sourceMappingURL=main.b5b11b4d.chunk.js.map