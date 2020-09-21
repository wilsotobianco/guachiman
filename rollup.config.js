import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
     file: pkg.main,
     format: 'cjs'
    },
    {
     file: pkg.module,
     format: 'es' // the preferred format
    },
    {
     file: pkg.browser,
     format: 'iife',
     name: 'Guachiman' // the global which can be used in a browser
    }
   ],
   plugins: [
     resolve(),
     babel({ babelHelpers: 'bundled' })
   ]
}