import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiJson,
} from '@icons-pack/react-simple-icons'
import { useParams } from '@tanstack/react-router'
import { Suspense, useEffect, useState, type FC } from 'react'

import { EditorViewCss } from '@/components/editor-css'
import { EditorViewHtml } from '@/components/editor-html'
import { EditorViewJs } from '@/components/editor-js'
import { EditorViewJson } from '@/components/editor-json'
import { EditorWithTabs } from '@/components/tabs'
import { EditorMode } from '@/constants/editor'
import { useStore } from '@/store'
import { type EditorView } from '@/types/view'

export const Playground: FC = () => {
  const { projectId } = useParams({ strict: false })

  const setupProject = useStore((state) => state.setupProject)

  useEffect(() => {
    if (!projectId) return
    setupProject(projectId)
  }, [projectId, setupProject])

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
      <EditorWithTabs key='editor-tabs' views={editorViews} />
    </Suspense>
  )
}
