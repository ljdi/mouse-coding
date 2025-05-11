import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import html from '@rollup/plugin-html'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import swc from '@rollup/plugin-swc'
import typescript from '@rollup/plugin-typescript'
import wasm from '@rollup/plugin-wasm'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import livereload from 'rollup-plugin-livereload'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  external: undefined,
  input: 'src/index.tsx',
  jsx: 'react-jsx',
  output: {
    dir: 'dist',
    format: 'umd',
    sourcemap: true
  },
  treeshake: 'recommended',
  plugins: [
    // replaceNodeModule({ fs: path.join(import.meta.dirname, 'lib', 'node', 'fs'), path: path.join(import.meta.dirname, 'lib', 'node', 'path') }),
    nodePolyfills(),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript(),
    alias({
      entries: [
        { find: /^@\/(.*)$/, replacement: path.resolve('src', '$1') },
        { find: 'fs', replacement: path.resolve(import.meta.dirname, 'src/lib/node/fs/index.js') },
        { find: 'path', replacement: path.resolve(import.meta.dirname, 'src/lib/node/path.js') },
        { find: 'util', replacement: path.resolve(import.meta.dirname, 'src/lib/node/util.js') },
        { find: 'stream', replacement: path.resolve(import.meta.dirname, 'src/lib/node/stream.js') },
        { find: 'module', replacement: path.resolve(import.meta.dirname, 'src/lib/node/module.js') },
        { find: 'url', replacement: path.resolve(import.meta.dirname, 'src/lib/node/url.js') },
        { find: 'os', replacement: path.resolve(import.meta.dirname, 'src/lib/node/os.js') },
        { find: 'buffer', replacement: path.resolve(import.meta.dirname, 'src/lib/node/buffer.js') }
      ]
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.READABLE_STREAM': '"disable"',
        'process.platform': '"linux"',
        'process.versions': 'true',
        'process.versions.node': '"v22.12.0"'
      }
    }),
    swc({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/
    }),
    html({
      template: () => readFile(path.resolve('public', 'index.html')).then(buffer => buffer.toString())
    }),
    json(),
    copy({
      targets: [
        { src: ['node_modules/@swc/wasm-web/wasm_bg.wasm', 'node_modules/@rollup/browser/dist/bindings_wasm_bg.wasm'], dest: 'dist' }
      ]
    }),
    wasm(),
    postcss({
      extract: true,
      minimize: true
    }),
    !isProduction && serve({
      open: true,
      contentBase: 'dist',
      port: 3000,
      historyApiFallback: true
    }),
    !isProduction && livereload('dist'),
    isProduction && (await import('@rollup/plugin-terser')).default()
  ]
})
