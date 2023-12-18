import{eQ as E,go as O,$ as g,f6 as L,h as r,e as x,j as e,w as u,eh as D,X as C,el as _,eI as j,e9 as v}from"./entryPointFactory.769a35d1.js";import{j as T,aB as S,aL as y,u as A,aH as W,aO as b}from"./index.e6917ec6.js";import{c_ as a,aq as F}from"./index.1ca238f3.js";import{A as R}from"./WidgetMapper.1c4fa18b.js";const k={[a.CREATED]:E,[a.DOWNLOADED]:O,[a.DONE]:g,[a.FAILED]:L},B=({onDownloadFile:n,children:i,...l})=>{const{name:s,status:t,updateTime:w,createTime:m}=l,d=x("main.nav.download.status"),{color:h,tagName:p,titleClasses:o}=r.useMemo(()=>{const c=["download-file-name"];return t===a.DOWNLOADED?c.push("downloaded"):t===a.DONE&&c.push("finished"),{color:k[t],tagName:d(a[t].toLowerCase()),titleClasses:c.join(" ")}},[t,d]),f=()=>t===a.DONE||t===a.DOWNLOADED?n(l):null;return e.jsxs(P,{children:[e.jsx("span",{className:o,onClick:f,children:s}),p?e.jsx(y,{color:h,children:p}):null]})},M=r.memo(({onDownloadFile:n,tasks:i})=>{const l=x("main.nav.download"),s=r.useMemo(()=>e.jsx(T,{size:"small",dataSource:i,rowKey:t=>t.name,renderItem:t=>e.jsx(S,{children:e.jsx(B,{...t,onDownloadFile:n})})}),[n,i]);return e.jsxs(G,{children:[e.jsx(H,{children:e.jsx("h2",{children:l("title")})}),e.jsx(z,{children:s})]})}),G=u.div.withConfig({displayName:"DownloadList__Wrapper",componentId:"sc-1d0view-0"})(["display:flex;flex-direction:column;min-width:256px;max-width:512px;max-height:480px;background-color:",";"],n=>n.theme.componentBackground),H=u.header.withConfig({displayName:"DownloadList__Title",componentId:"sc-1d0view-1"})(["display:flex;flex-shrink:0;align-items:center;padding:"," "," ",";h2{flex:1;font-size:",";line-height:",";}"],D,D,C,_,j),z=u.div.withConfig({displayName:"DownloadList__Content",componentId:"sc-1d0view-2"})(["flex:1;overflow-y:auto;"]),P=u.div.withConfig({displayName:"DownloadList__DownloadFileItemWrapper",componentId:"sc-1d0view-3"})(["display:flex;flex:1;align-items:center;overflow:hidden;.download-file-name{flex:1;overflow:hidden;color:",";text-overflow:ellipsis;white-space:nowrap;vertical-align:middle;&.finished{font-weight:",";color:",";text-decoration:underline;cursor:pointer;}&.downloaded{text-decoration:underline;cursor:pointer;}}.ant-tag{margin:0;text-align:center;}"],n=>n.theme.textColorDisabled,v,n=>n.theme.textColor),U=5e3,V=({tooltipProps:n,polling:i,renderDom:l,setPolling:s,onLoadTasks:t,onDownloadFile:w})=>{const[m,d]=r.useState([]),h=x("main.nav"),p=r.useMemo(()=>(m||[]).filter(o=>o.status===a.DONE).length,[m]);return r.useEffect(()=>{let o;return i&&typeof o!="number"?t().then(({isNeedStopPolling:f,data:c})=>{d(c),f?s(!1):o=setInterval(()=>{t().then(({isNeedStopPolling:I,data:N})=>{d(N),I&&(clearInterval(o),s(!1))})},U)}):typeof o=="number"&&typeof o=="number"&&clearInterval(o),()=>{typeof o=="number"&&clearInterval(o)}},[i,s,t]),A(()=>{s(!0)}),e.jsx(W,{content:e.jsx(M,{onDownloadFile:w,tasks:m}),trigger:["click"],placement:"rightBottom",children:e.jsx("li",{children:e.jsx(F,{title:h("download.title"),placement:"right",...n,children:e.jsx(b,{count:p,children:l||e.jsx(R,{style:{fontSize:20}})})})})})};export{V as D};
