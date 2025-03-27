'use client'

import { SidebarController } from '@mc/ui/components/panel-sidebar'
import { WorkspaceSelector } from '@mc/ui/components/workspace'
import { Mouse } from 'lucide-react'

export const PlaygroundHeader = () => {
  return (
    <header className="flex h-14 items-center justify-between bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="my-8 flex items-center space-x-4">
        <Mouse className="text-neutral-950 dark:text-neutral-50" />
      </div>
      <div className="flex items-center space-x-2">
        <WorkspaceSelector />
        <SidebarController />
      </div>
    </header>
  )
}
