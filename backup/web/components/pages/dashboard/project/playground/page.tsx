'use client'

import { EditorViewCss } from '@/components/editor'
import { EditorViewHtml } from '@/components/html-editor'
import { EditorViewJs } from '@/components/js-editor'
import { EditorViewJson } from '@/components/json-editor'
import { EditorWithTabs } from '@/components/tabs'
import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiJson,
} from '@icons-pack/react-simple-icons'
import { EditorMode } from '@mc/shared/constants/editor'
import { EditorView } from '@mc/shared/types/view'
import { useStore } from '@mc/store'
import { FC, Suspense, useEffect, useState } from 'react'

interface PlaygroundPageProps {
  projectName: string
}
export const PlaygroundPage: FC<PlaygroundPageProps> = ({ projectName }) => {
  const setupProject = useStore(state => state.setupProject)

  useEffect(() => {
    setupProject(projectName)
  }, [projectName, setupProject])

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
      <EditorWithTabs key="editor-tabs" views={editorViews} />
    </Suspense>
  )
}
