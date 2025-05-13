import type { ConfigurableContextMenuItem } from '@/components/configurable-context-menu'

export const SidebarViewId = {
  FILES: 0,
  SEARCH: 1,
  GIT: 2,
  PACKAGES: 3,
} as const

export type SidebarViewIdType = (typeof SidebarViewId)[keyof typeof SidebarViewId]

export const treeContainerContextMenuItems: ConfigurableContextMenuItem[] = [
  {
    id: 'create-file',
    type: 'item',
    textValue: 'Create File',
  },
  {
    id: 'create-folder',
    type: 'item',
    textValue: 'Create Folder',
  },
]
