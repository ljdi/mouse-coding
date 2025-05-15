import './App.css'

import { createRouter, RouterProvider } from '@tanstack/react-router'

import { useEffect } from 'react'

import { ThemeProvider } from '@/providers/theme-provider'
import { routeTree } from '@/routeTree.gen'
import { useStore } from '@/store'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const router = createRouter({ routeTree })

function App () {
  const configureFs = useStore((state) => state.configureFs)
  useEffect(() => {
    // Configure ZenFS with the configuration
    configureFs()
  }, [configureFs])
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
