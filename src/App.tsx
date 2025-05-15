import './App.css'

import { createRouter, RouterProvider } from '@tanstack/react-router'

import { useEffect } from 'react'

import { FileSystemAction } from './constants/action'
import { useLoading } from './hooks/use-loading'
import { routeTree } from './routeTree.gen'

import { ThemeProvider } from '@/providers/theme-provider'
import { useStore } from '@/store'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const router = createRouter({ routeTree })

function App () {
  const isFsInitialized = useStore((state) => state.isFsInitialized)
  const initializeFs = useStore((state) => state.initializeFs)
  const [initializeFsWithLoading, isLoading] = useLoading(initializeFs, FileSystemAction.INITIALIZE_FILE_SYSTEM)

  useEffect(() => {
    if (isFsInitialized || isLoading) {
      return
    }
    initializeFsWithLoading()
  }, [isFsInitialized, isLoading, initializeFsWithLoading])

  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
