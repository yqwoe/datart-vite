import react from '@vitejs/plugin-react';
import history from 'connect-history-api-fallback';
import fs from 'fs';
import { cpus } from 'os';
import { extname, join, parse, resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { inspectorServer } from '@react-dev-inspector/vite-plugin'

function entryPoints(...paths) {
  const entries = paths.map(parse).map(entry => {
    const { dir, base, name, ext } = entry;
    const key = join(dir, name);
    const path = resolve(__dirname, dir, base);
    return [key, path];
  });

  const config = Object.fromEntries(entries);
  return config;
}


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-styled-components',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
        ],
      },
    }),
    inspectorServer(),
    {
      name: 'historyApiFallback',
      configureServer(server) {
        server.middlewares.use(
          history({
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
            disableDotRule: false,
            rewrites: [
              { from: /^\/$/, to: '/index.html' },
              { from: /^\/shareChart\/\w/, to: '/shareChart.html' },
              { from: /^\/shareDashboard\/\w/, to: '/shareDashboard.html' },
              { from: /^\/shareStoryPlayer\/\w/, to: '/shareStoryPlayer.html' },
            ],
          }),
        );
      },
    },
    {
      name: 'custom-chart-plugins',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/v1/plugins/custom/charts') {
            const pluginPath = 'custom-chart-plugins';
            const dir = fs.readdirSync(`./public/${pluginPath}`);
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                data: (dir || [])
                  .filter(file => extname(file) === '.js')
                  .map(file => `${pluginPath}/${file}`),
                errCode: 0,
                success: true,
              }),
            );
            return;
          }
          next();
        });
      },
    },
    svgr({
      svgrOptions: {},
    }),
    tsconfigPaths(),
    visualizer({ open: process.env.NODE_ENV === 'development' }),
  ],
  build: {
    emptyOutDir: true,
    sourcemap: false,
    outDir: './build',
    assetsDir: 'static',
    assetsInlineLimit: 4096 * 2,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      maxParallelFileOps: Math.max(1, cpus().length - 1),
      input: entryPoints(
        'index.html',
        'shareChart.html',
        'shareDashboard.html',
        'shareStoryPlayer.html',
      ),
      output: {
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          // 用后缀名称进行区别处理
          // 处理其他资源文件名 e.g. css png 等
          let subDir = 'media';

          if (extname(assetInfo?.name) === '.css') {
            subDir = 'css';
          }

          return `static/${subDir}/[name].[hash].[ext]`;
        },
        // 入口文件名
        entryFileNames: 'static/js/[name].[hash].js',
      },
    },
  },
  server: {
    open: true,
    port: 8000,
    proxy: {
      '/api/v1': {
        changeOrigin: true,
        // target: 'https://test-data-cube.corebrew.net/',
        target: "http://localhost:8080/"
      },
      '/resources': {
        changeOrigin: true,
        // target: 'https://test-data-cube.corebrew.net/',
        target: "http://localhost:8080/"
      },
    },
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
