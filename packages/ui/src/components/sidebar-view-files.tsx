'use client'

import { useWorkspacePath } from '@mc/shared/hooks/workspace'
import { FileTree } from '@mc/ui/components/file-tree'

export function SidebarViewFiles() {
  const workspacePath = useWorkspacePath()

  return (
    <FileTree path={workspacePath} />
  )
}
