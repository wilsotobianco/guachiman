import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      eslint({
        exclude: ['sandbox/**'],
      }),
      replace({
        exclude: 'node_modules/**',
        ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      }),
      process.env.NODE_ENV === 'production' && terser(),
    ],
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.browser,
        format: 'iife',
        name: 'Guachiman',
      },
    ],
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      eslint({
        exclude: ['sandbox/**'],
      }),
      babel({ babelHelpers: 'bundled' }),
      replace({
        exclude: 'node_modules/**',
        ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      }),
      process.env.NODE_ENV === 'production' && terser(),
    ],
  },
];
