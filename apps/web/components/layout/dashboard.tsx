'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { SidebarController } from '@/components/side-bar'
import { useStore } from '@mc/store'
import { Button } from '@mc/ui/components/button'
import { Mouse } from 'lucide-react'
import { FC, ReactNode, useEffect } from 'react'

interface DefaultLayoutProps {
  children: ReactNode
  search?: ReactNode
}
export const DashboardLayout: FC<DefaultLayoutProps> = ({
  children,
  search,
}) => {
  const isFsInitialized = useStore(state => state.isFsInitialized)
  const initializeFs = useStore(state => state.initializeFs)
  useEffect(() => {
    initializeFs().catch(console.error)
  }, [initializeFs])

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center justify-between space-x-4 bg-neutral-50 px-4 dark:bg-neutral-950">
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <Mouse className="text-neutral-950 dark:text-neutral-50" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center space-x-4">
          {search}
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <SidebarController />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {isFsInitialized && children}
      </div>
    </div>
  )
}
