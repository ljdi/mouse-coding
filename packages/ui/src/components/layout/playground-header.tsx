'use client'

import { useStore } from '@mc/store'
import { WorkspaceSelector } from '@mc/ui/components/workspace-selector'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export const PlaygroundHeader = () => {
  const isPrimarySidebarCollapsed = useStore(
    state => state.isPrimarySidebarCollapsed,
  )
  const togglePrimarySidebar = useStore(state => state.togglePrimarySidebar)

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="my-8 flex items-center space-x-4">
        <WorkspaceSelector />
      </div>
      <div className="flex items-center space-x-2">
        {isPrimarySidebarCollapsed
          ? (
              <PanelLeftClose onClick={togglePrimarySidebar} />
            )
          : (
              <PanelLeftOpen onClick={togglePrimarySidebar} />
            )}
      </div>
    </header>
  )
}
