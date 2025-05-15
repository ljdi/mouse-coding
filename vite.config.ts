import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react({
      tsDecorators: true,
      useAtYourOwnRisk_mutateSwcOptions: (options) => {
        console.log('options', options)
        if (!options.jsc) options.jsc = {}
        if (!options.jsc.transform) options.jsc.transform = {}
        options.jsc.transform.decoratorVersion = '2022-03'
      }
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
