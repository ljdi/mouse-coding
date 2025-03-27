import { EditorMode } from '@mc/shared/constants/editor'
import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { type ReactNode } from 'react'

export type ViewId = string | number | symbol

export interface View {
  id: ViewId
  name: string
  icon: ReactNode
  component: ReactNode
}

export interface EditorView extends View {
  path: string
  content: string
  mode: EditorMode
}

export interface SidebarView extends View {
  id: SidebarViewId
  icon: ReactNode
}
