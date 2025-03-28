'use client'

import {
  SiCss,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJson,
} from '@icons-pack/react-simple-icons'
import { EditorMode } from '@mc/shared/constants/editor'
import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { initializeWorkspaces } from '@mc/shared/lib/workspace'
import { EditorView, SidebarView } from '@mc/shared/types/view'
import { useStore } from '@mc/store'
import { EditorViewCss } from '@mc/ui/components/css-editor'
import { EditorWithTabs } from '@mc/ui/components/editor-with-tabs'
import { EditorViewHtml } from '@mc/ui/components/html-editor'
import { EditorViewJs } from '@mc/ui/components/js-editor'
import { EditorViewJson } from '@mc/ui/components/json-editor'
import { PanelGroup } from '@mc/ui/components/panel-group'
import { SideBar } from '@mc/ui/components/side-bar'
import { SidebarViewFiles } from '@mc/ui/components/sidebar-view-files'
import { SidebarViewGit } from '@mc/ui/components/sidebar-view-git'
import { SidebarViewPackages } from '@mc/ui/components/sidebar-view-packages'
import { SidebarViewSearch } from '@mc/ui/components/sidebar-view-search'
import { Files, Package, Search } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

export const PlaygroundPage = () => {
  const workspacesAreReady = useStore(state => state.workspacesAreReady)
  const setWorkspacesReady = useStore(state => state.setWorkspacesReady)

  useEffect(() => {
    if (!workspacesAreReady) {
      initializeWorkspaces().then(setWorkspacesReady).catch(console.error)
    }
  }, [workspacesAreReady, setWorkspacesReady])

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
      id: 'editor-html',
      icon: <SiHtml5 />,
      name: 'index.html',
      path: '/index.html',
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
    <Suspense fallback={<div>Loading...</div>}>
      <PanelGroup
        views={[
          <SideBar key="primary-sidebar" views={sidebarViews} />,
          <EditorWithTabs key="editor-tabs" views={editorViews} />,
        ]}
        defaultLayout={defaultLayout}
        onLayout={onLayout}
      />
    </Suspense>
  )
}
