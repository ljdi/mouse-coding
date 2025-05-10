'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { PanelGroup } from '@/components/panel-group'
import { SidebarController } from '@/components/side-bar'
import {
  LayoutId,
  RESIZEABLE_PANEL_SIZE_KEY_PREFIX,
} from '@mc/shared/constants/layout'
import { useStore } from '@mc/store'
import { Button } from '@mc/ui/components/button'
import { Mouse } from 'lucide-react'
import { FC, ReactNode, useEffect } from 'react'

interface DefaultLayoutProps {
  children: ReactNode
  defaultSize?: number[]
  primarySideBar?: ReactNode
  secondarySideBar?: ReactNode
  search?: ReactNode
  cookieStore?: Map<string, { name: string, value: string }>
  id: LayoutId
}
export const DefaultLayout: FC<DefaultLayoutProps> = ({
  children,
  primarySideBar = null,
  secondarySideBar = null,
  search,
  id,
}) => {
  const defaultSizeMap = useStore(state => state.defaultSizeMap)
  const onLayout = (sizes: number[]) => {
    document.cookie = `${RESIZEABLE_PANEL_SIZE_KEY_PREFIX}${id}=${JSON.stringify(sizes)}`
  }

  const isMounted = useStore(state => state.isMounted)
  const workspaceMount = useStore(state => state.mount)
  useEffect(() => {
    if (!isMounted) {
      workspaceMount().catch(console.error)
    }
  }, [isMounted, workspaceMount])

  return (
    isMounted && (
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
          <PanelGroup
            views={[primarySideBar, children, secondarySideBar]}
            defaultSize={defaultSizeMap[id]}
            onLayout={onLayout}
          />
        </div>
      </div>
    )
  )
}
