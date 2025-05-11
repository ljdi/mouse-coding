import { htmlPlugin } from '@craftamap/esbuild-plugin-html'
import postCssPlugin from '@deanc/esbuild-plugin-postcss'
import tailwindcssPostcss from '@tailwindcss/postcss'
import stdLibBrowser from 'node-stdlib-browser'
import stdLibBrowserEsbuildPlugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import path from 'path'

export default {
  jsx: 'automatic',
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outdir: 'dist',
  metafile: true,
  format: 'iife',
  sourcemap: true,
  target: ['es2020'],
  loader: {
    '.wasm': 'file',
    '.ttf': 'file'
  },
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer'
    // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // 'process.env.READABLE_STREAM': '"disable"',
    // 'process.platform': 'linux',
    // 'process.versions': JSON.stringify({ node: 'v22.12.0' })
  },
  alias: {
    '@/*': '@/src/*'
  },
  inject: [new URL(import.meta.resolve('node-stdlib-browser/helpers/esbuild/shim')).pathname],
  plugins: [
    stdLibBrowserEsbuildPlugin({
      ...stdLibBrowser,
      fs: path.resolve('./src/lib/node/fs/index.js'),
      module: path.resolve('./src/lib/node/module.js'),
      path: path.resolve('./src/lib/node/path.js')
    }),
    postCssPlugin({
      plugins: [
        // @ts-expect-error plugins 未定义类型
        tailwindcssPostcss()]
    }),
    htmlPlugin({
      files: [
        {
          entryPoints: [
            'src/main.tsx'
          ],
          filename: 'index.html',
          htmlTemplate: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <div id="root"></div>
            </body>
            </html>
          `
        }]
    })
  ]
}
