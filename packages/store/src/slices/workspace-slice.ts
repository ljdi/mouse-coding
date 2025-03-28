import { Workspace } from '@mc/shared/lib/workspace'
import type { StateCreator } from 'zustand'

export interface WorkspaceSlice {
  // TODO: File System API 只有 Chromium 系列浏览器支持，有时间再做
  // syncDirectoryHandle?: FileSystemDirectoryHandle;

  workspace?: Workspace
  selectedWorkspaceName?: string
  isMounted: boolean
  mount: () => Promise<void>
  selectWorkspace: (name: string) => void
  setWorkspace: (workspace: Workspace) => void
}

export const createWorkspaceSlice: StateCreator<WorkspaceSlice> = set => ({
  selectedWorkspaceName: undefined,
  workspace: undefined,
  isMounted: false,
  mount: async () => {
    await Workspace.mount()
    set({ isMounted: true })
  },

  selectWorkspace: (activeWorkspaceName) => {
    set({ selectedWorkspaceName: activeWorkspaceName })
  },
  setWorkspace: (workspace: Workspace) => {
    set({ workspace })
  },
})
