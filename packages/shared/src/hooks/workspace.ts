import { useStore } from '@mc/store'
import { useEffect, useState } from 'react'

export const useWorkspacePath = () => {
  const activeWorkspace = useStore(state => state.activeWorkspace)
  const [workspacePath, setWorkspacePath] = useState<string | null>(activeWorkspace?.path ?? null)
  useEffect(() => {
    setWorkspacePath(activeWorkspace?.path ?? null)
  }, [activeWorkspace])

  return workspacePath
}
