'use client'

import { getWorkspacePath } from '@mc/shared/lib/workspace'
import { useStore } from '@mc/store'
import { FileTree } from '@mc/ui/components/file-tree'
import { useEffect, useState } from 'react'

export function SidebarViewFiles() {
  const activeWorkspaceName = useStore(state => state.selectedWorkspaceName)
  const [activeWorkspacePath, setActiveWorkspacePath] = useState('')

  useEffect(() => {
    if (activeWorkspaceName) {
      getWorkspacePath(activeWorkspaceName)
        .then(setActiveWorkspacePath)
        .catch(console.error)
    }
  }, [activeWorkspaceName])

  return <FileTree path={activeWorkspacePath} />
}
