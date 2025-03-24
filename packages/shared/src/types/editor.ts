import { EditorMode } from '@mc/shared/constants/editor'
import { type ReactNode } from 'react'

export interface Editor {
  name: string
  path: string
  content: string
  mode: EditorMode
  component: ReactNode
}
