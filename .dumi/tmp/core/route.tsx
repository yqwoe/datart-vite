// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import React from 'react';

export async function getRoutes() {
  return {
    routes: {"404":{"id":"404","path":"*","parentId":"DocLayout"},"dumi-context-layout":{"id":"dumi-context-layout","path":"/","isLayout":true},"DocLayout":{"id":"DocLayout","path":"/","parentId":"dumi-context-layout","isLayout":true},"demo-render":{"id":"demo-render","path":"~demos/:id","parentId":"dumi-context-layout"}},
    routeComponents: {
'404': React.lazy(() => import(/* webpackChunkName: "__Users__yqwoe__.nvm__versions__node__v16.19.0__lib__node_modules__dumi__dist__client__pages__404" */'/Users/yqwoe/.nvm/versions/node/v16.19.0/lib/node_modules/dumi/dist/client/pages/404.js')),
'dumi-context-layout': React.lazy(() => import(/* webpackChunkName: "dumi__tmp__dumi__theme__ContextWrapper" */'/Users/yqwoe/workspace/datart/.dumi/tmp/dumi/theme/ContextWrapper.tsx')),
'DocLayout': React.lazy(() => import(/* webpackChunkName: "__Users__yqwoe__.nvm__versions__node__v16.19.0__lib__node_modules__dumi__theme-default__layouts__DocLayout__index" */'/Users/yqwoe/.nvm/versions/node/v16.19.0/lib/node_modules/dumi/theme-default/layouts/DocLayout/index.js')),
'demo-render': React.lazy(() => import(/* webpackChunkName: "__Users__yqwoe__.nvm__versions__node__v16.19.0__lib__node_modules__dumi__dist__client__pages__Demo__index" */'/Users/yqwoe/.nvm/versions/node/v16.19.0/lib/node_modules/dumi/dist/client/pages/Demo/index.js')),
},
  };
}