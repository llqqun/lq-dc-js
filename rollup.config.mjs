import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { readFileSync } from 'fs';

// 使用fs模块读取package.json
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default [
  // UMD版本 (浏览器兼容)
  {
    input: 'src/index.js',
    output: {
      name: 'lqDcJs',
      file: pkg.browser,
      format: 'umd',
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  },
  // ESM版本 (现代浏览器和打包工具)
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ]
  },
  // CommonJS版本 (Node.js)
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ]
  }
];