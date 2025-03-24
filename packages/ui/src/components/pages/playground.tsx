'use client'

import { useStore } from '@mc/store'
import { PanelGroup } from '@mc/ui/components/panel-group'
import { PanelSidebar } from '@mc/ui/components/panel-sidebar'
import { PanelTabs } from '@mc/ui/components/panel-tabs'
import { useEffect } from 'react'

export const PlaygroundPage = () => {
  const initWorkspaces = useStore(state => state.initWorkspaces)

  useEffect(() => {
    initWorkspaces()
  }, [initWorkspaces])

  return (
    <PanelGroup
      panelViews={[
        <PanelSidebar key="primary-sidebar" />,
        <PanelTabs key="editor-tabs" editors={[]} />,
      ]}
    />
  )
}
