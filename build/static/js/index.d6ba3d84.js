import{h as r,q as f,v as l,S as m,j as d}from"./entryPointFactory.769a35d1.js";import{A as e,p as u}from"./index.1ca238f3.js";import{A}from"./Alert.b6791173.js";import{u as S}from"./index.3e5f4c4f.js";import"./index.e6917ec6.js";import"./AuthLayout.7c6c8571.js";import"./ExclamationCircleOutlined.f52c2310.js";const P=()=>{const[p,t]=r.useState(e.Initialized),[h,g]=r.useState(""),s=S(),o=f();return r.useEffect(()=>{const a=new URLSearchParams(window.location.search),i=a.get("authorization_token"),n=a.get("error_message");i&&(t(e.Pending),s(l({token:i,resolve:()=>{const c=u.session.get(m.AuthRedirectUrl);c?(u.session.remove(m.AuthRedirectUrl),window.location.href=c):o.replace("/")},reject:()=>{t(e.Error)}}))),n&&(t(e.Error),g(n))},[s,o]),d.jsx(A,{status:p,errorMessage:h})};export{P as AuthorizationPage};