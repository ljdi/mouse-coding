import type { StateCreator } from 'zustand'

export interface WorkspaceSlice {
  // TODO: File System API 只有 Chromium 系列浏览器支持，有时间再做
  // syncDirectoryHandle?: FileSystemDirectoryHandle;

  workspacesAreReady: boolean
  selectedWorkspaceName?: string
  setWorkspacesReady: () => void
  selectWorkspace: (name: string) => void
}

export const createWorkspaceSlice: StateCreator<WorkspaceSlice> = set => ({
  workspacesAreReady: false,
  selectedWorkspaceName: undefined,
  setWorkspacesReady: () => {
    set({ workspacesAreReady: true })
  },
  selectWorkspace: (activeWorkspaceName) => {
    set({ selectedWorkspaceName: activeWorkspaceName })
  },
})
