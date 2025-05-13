import type { ReactNode } from 'react'

import type { FileSystemAction } from '@/constants/action'
import { type EditorModeType } from '@/constants/editor'
import { type SidebarViewIdType } from '@/constants/sidebar'

type ViewId = string | number | symbol

interface View {
  id: ViewId
  name: string
  icon: ReactNode
  component: ReactNode
}

export interface EditorView extends View {
  path: string
  content: string
  mode: EditorModeType
}

export interface SidebarView extends View {
  id: SidebarViewIdType
  icon: ReactNode
}

export interface FileTreeEditing {
  index: string
  path: string
  name: string
  oldName?: string
  type: typeof FileSystemAction.CREATE_FILE | typeof FileSystemAction.CREATE_DIRECTORY | typeof FileSystemAction.RENAME
}
