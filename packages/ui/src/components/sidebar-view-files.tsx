'use client'

import { useStore } from '@mc/store'
import { FileTree } from '@mc/ui/components/file-tree'

export function SidebarViewFiles() {
  const activeWorkspaceName = useStore(state => state.selectedWorkspaceName)

  return activeWorkspaceName && <FileTree workspaceName={activeWorkspaceName} />
}
