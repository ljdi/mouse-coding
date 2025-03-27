'use client'

import {
  SiCss,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJson,
} from '@icons-pack/react-simple-icons'
import { EditorMode } from '@mc/shared/constants/editor'
import { LoadingKey } from '@mc/shared/constants/loading'
import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { useLoading } from '@mc/shared/hooks/useLoading'
import { EditorView, SidebarView } from '@mc/shared/types/view'
import { useStore } from '@mc/store'
import { EditorViewCss } from '@mc/ui/components/editor-view-css'
import { EditorViewHtml } from '@mc/ui/components/editor-view-html'
import { EditorViewJs } from '@mc/ui/components/editor-view-js'
import { EditorViewJson } from '@mc/ui/components/editor-view-json'
import { PanelGroup } from '@mc/ui/components/panel-group'
import { PanelSidebar } from '@mc/ui/components/panel-sidebar'
import { PanelTabs } from '@mc/ui/components/panel-tabs'
import { SidebarViewFiles } from '@mc/ui/components/sidebar-view-files'
import { SidebarViewGit } from '@mc/ui/components/sidebar-view-git'
import { SidebarViewPackages } from '@mc/ui/components/sidebar-view-packages'
import { SidebarViewSearch } from '@mc/ui/components/sidebar-view-search'
import { Files, Package, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export const PlaygroundPage = () => {
  const isLoading = useStore(state => state.isLoading)
  const initWorkspaces = useStore(state => state.initializeWorkspaces)

  const initializeWorkspacesWithLoading = useLoading(
    LoadingKey.WORKSPACES_INITIALIZING,
    initWorkspaces,
  )

  const initializeWorkspacesIsLoading = isLoading(LoadingKey.WORKSPACES_INITIALIZING)

  useEffect(() => {
    initializeWorkspacesWithLoading().catch(console.error)
  }, [initializeWorkspacesWithLoading])

  const defaultLayout = useStore(state => state.defaultLayout)
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
  }

  const [sidebarViews] = useState<SidebarView[]>([
    {
      id: SidebarViewId.FILES,
      icon: <Files />,
      name: 'Files',
      component: <SidebarViewFiles />,
    },
    {
      id: SidebarViewId.SEARCH,
      icon: <Search />,
      name: 'Search',
      component: <SidebarViewSearch />,
    },
    {
      id: SidebarViewId.GIT,
      icon: <SiGit />,
      name: 'Git',
      component: <SidebarViewGit />,
    },
    {
      id: SidebarViewId.PACKAGES,
      icon: <Package />,
      name: 'Packages',
      component: <SidebarViewPackages />,
    },
  ])

  const [editorViews] = useState<EditorView[]>([
    {
      id: 'editor-css',
      icon: <SiCss />,
      name: 'index.css',
      path: '/index.css',
      content: '',
      mode: EditorMode.CODE,
      component: <EditorViewCss />,
    },
    {
      id: 'editor-js',
      icon: <SiHtml5 />,
      name: 'index.js',
      path: '/index.js',
      content: '',
      mode: EditorMode.CODE,
      component: <EditorViewHtml />,
    },
    {
      id: 'editor-js',
      icon: <SiJavascript />,
      name: 'index.js',
      path: '/index.js',
      content: '',
      mode: EditorMode.CODE,
      component: <EditorViewJs />,
    },
    {
      id: 'editor-json',
      icon: <SiJson />,
      name: 'index.json',
      path: '/index.json',
      content: '',
      mode: EditorMode.CODE,
      component: <EditorViewJson />,
    },
  ])

  return (
    <PanelGroup
      views={[
        <PanelSidebar key="primary-sidebar" views={sidebarViews} />,
        <PanelTabs key="editor-tabs" views={editorViews} />,
      ]}
      defaultLayout={defaultLayout}
      onLayout={onLayout}
    />
  )
}
