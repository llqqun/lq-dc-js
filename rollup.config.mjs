import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { readFileSync, copyFileSync } from 'fs';

// 使用fs模块读取package.json
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const copyTypesPlugin = {
  name: 'copy-types',
  writeBundle() {
    copyFileSync('src/index.d.ts', 'dist/index.d.ts');
  }
};

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'lqDcJs',
      file: 'dist/dev.umd.js', // 非压缩测试版本
      format: 'umd',
      exports: 'default',
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
      terser(),
      copyTypesPlugin
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
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser(),
      copyTypesPlugin
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
      }),
      terser(),
      copyTypesPlugin
    ]
  }
];