'use client'

import {
  SiCss,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJson,
} from '@icons-pack/react-simple-icons'
import { EditorMode } from '@mc/shared/constants/editor'
import { LayoutId } from '@mc/shared/constants/layout'
import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { EditorView, SidebarView } from '@mc/shared/types/view'
import { EditorViewCss } from '@mc/ui/components/editor'
import { EditorViewHtml } from '@mc/ui/components/html-editor'
import { EditorViewJs } from '@mc/ui/components/js-editor'
import { EditorViewJson } from '@mc/ui/components/json-editor'
import { DefaultLayout } from '@mc/ui/components/layout/default'
import { SideBar } from '@mc/ui/components/side-bar'
import { FileTree } from '@mc/ui/components/sidebar-view-files'
import { SidebarViewGit } from '@mc/ui/components/sidebar-view-git'
import { SidebarViewPackages } from '@mc/ui/components/sidebar-view-packages'
import { SidebarViewSearch } from '@mc/ui/components/sidebar-view-search'
import { EditorWithTabs } from '@mc/ui/components/tabs'
import { Files, Package, Search } from 'lucide-react'
import { FC, Suspense, useState } from 'react'

interface PlaygroundPageProps {
  name: string
}
export const PlaygroundPage: FC<PlaygroundPageProps> = ({ name }) => {
  console.log('workspace name', name)

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

  const [sidebarViews] = useState<SidebarView[]>([
    {
      id: SidebarViewId.FILES,
      icon: <Files />,
      name: 'Files',
      component: <FileTree workspaceName={name} />,
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

  return (
    <DefaultLayout
      id={LayoutId.PLAYGROUND}
      primarySideBar={<SideBar key="primary-sidebar" views={sidebarViews} />}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <EditorWithTabs key="editor-tabs" views={editorViews} />
      </Suspense>
    </DefaultLayout>
  )
}
