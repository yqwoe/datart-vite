import{h as l,e as d,j as r,w as g,u as h,fh as m}from"./entryPointFactory.769a35d1.js";import{b7 as f,B as x,F as p,I as j,gH as L}from"./index.1ca238f3.js";import{L as w}from"./LoginForm.f01daba0.js";import{h as y,i as b}from"./selectors.caa0f834.js";import{u as P}from"./index.3e5f4c4f.js";const i="password-input",M=l.memo(({visible:t,onChange:a})=>{const s=d("share.modal"),o=d("global"),e=l.useRef(null);return r.jsx(f,{title:s("password"),open:t,closable:!1,footer:[r.jsx(x,{onClick:()=>{var c;(c=e==null?void 0:e.current)==null||c.validateFields().then(()=>{var u;const n=(u=e==null?void 0:e.current)==null?void 0:u.getFieldsValue([i]);a(n==null?void 0:n[i])}).catch(n=>Promise.reject())},type:"primary",children:o("button.ok")})],children:r.jsx(p,{ref:e,children:r.jsx(p.Item,{label:s("password"),name:i,rules:[{required:!0}],children:r.jsx(j.Password,{placeholder:s("enterPassword")})})})})});function _({visible:t,onChange:a}){const s=P(),o=h(y),e=h(b);return l.useEffect(()=>{s(L())},[s]),t&&r.jsx(S,{children:r.jsx(w,{loading:o,oauth2Clients:e,inShare:!0,onLogin:a})})}const S=g.div.withConfig({displayName:"ShareLoginModal__LoginWrapper",componentId:"sc-yjg3zk-0"})(["position:absolute;top:0;right:0;bottom:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;width:100%;height:100%;background:",";"],t=>t.theme.bodyBackground),B=({key:t})=>{const a=function(){return new URLSearchParams(m().search)};return(()=>{var o;return t?(o=a())==null?void 0:o.get(t):a()})()};export{M as P,_ as S,B as u};