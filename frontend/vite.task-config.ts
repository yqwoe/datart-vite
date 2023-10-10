/* eslint-disable import/no-anonymous-default-export */
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { cpus } from 'os';
import { join } from 'path';
import { defineConfig } from 'vite';

import tsConfigPaths from 'vite-tsconfig-paths'

const isProduction = process.env.NODE_ENV === 'production';
const srcRoot = join(__dirname, 'src/');

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [
    typescript({
      tsconfig: join(__dirname, 'tsconfig.rollup.json'),
    })
  ],
  resolve:{
    browserField: false,
    conditions: ["node"],
    extensions: ['.js','.ts']
  },
  build: {
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/task.ts',
      formats: ['umd'],
      name: 'getQueryData',
    },
    minify: false,
    outDir: 'public/task',
    copyPublicDir: false,
    rollupOptions: {
      cache: false,
      maxParallelFileOps: Math.max(1, cpus().length - 1),
      input: 'src/task.ts',
      output:{
        format: 'umd',
        entryFileNames: 'index.js',
        generatedCode:{
          preset: 'es5',
          arrowFunctions: false,

        },
      },
      treeshake: {
        preset: 'smallest'
      },
      plugins: [
        babel({
          babelHelpers: 'runtime',
          exclude: [/core-js/],
          presets: [
            [
              '@babel/preset-env',
              {
                debug: true,
                modules: false,
              },
            ]
          ],
          plugins: [
            '@babel/plugin-transform-runtime'
          ],
          comments: false,
        }),
        replace({
          'console.log': '//console.log',
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
      ],
    },
  },
  esbuild: false
});
