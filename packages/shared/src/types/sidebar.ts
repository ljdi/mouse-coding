import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { type ReactNode } from 'react'

export interface SidebarView {
  id: SidebarViewId
  icon: ReactNode
  label: string
  component: ReactNode
}
