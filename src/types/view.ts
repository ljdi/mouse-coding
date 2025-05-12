import type { ReactNode } from 'react'

import { EditorMode } from '@/constants/editor'
import { SidebarViewId } from '@/constants/sidebar'

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
