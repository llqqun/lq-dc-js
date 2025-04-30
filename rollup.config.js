import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  // {
  //   input: 'src/index.js',
  //   output: {
  //     name: 'lqDcJs',
  //     file: 'dist/index.umd.js', // 非压缩版本
  //     format: 'umd',
  //     exports: 'named'
  //   },
  //   plugins: [
  //     resolve(),
  //     commonjs(),
  //     babel({
  //       babelHelpers: 'bundled',
  //       exclude: 'node_modules/**'
  //     })
  //   ]
  // },
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
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ]
  }
];