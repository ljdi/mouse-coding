import { Outlet } from '@tanstack/react-router'
import { Mouse } from 'lucide-react'
import { useEffect, type FC, type ReactNode } from 'react'

import { ModeToggle } from '@/components/mode-toggle'
import { SidebarController } from '@/components/side-bar'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'

interface DefaultLayoutProps {
  search?: ReactNode
}
export const DashboardLayout: FC<DefaultLayoutProps> = ({ search }) => {
  const isFsInitialized = useStore((state) => state.isFsInitialized)
  const initializeFs = useStore((state) => state.initializeFs)
  useEffect(() => {
    if (isFsInitialized) {
      return
    }

    initializeFs().catch(console.error)
  }, [isFsInitialized, initializeFs])

  return (
    <div className='flex h-screen flex-col'>
      <header className='flex h-14 items-center justify-between space-x-4 bg-neutral-50 px-4 dark:bg-neutral-950'>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon'>
            <Mouse className='text-neutral-950 dark:text-neutral-50' />
          </Button>
        </div>
        <div className='flex flex-1 items-center justify-center space-x-4'>{search}</div>
        <div className='flex items-center space-x-4'>
          <ModeToggle />
          <SidebarController />
        </div>
      </header>
      <div className='flex flex-1 overflow-hidden bg-neutral-100 dark:bg-neutral-800'>
        {isFsInitialized && <Outlet />}
      </div>
    </div>
  )
}
