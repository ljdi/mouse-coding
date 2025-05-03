import { Workspace } from '@mc/shared/lib/workspace'
import type { StateCreator } from 'zustand'

export interface WorkspaceSlice {
  // TODO: File System API 只有 Chromium 系列浏览器支持，有时间再做
  // syncDirectoryHandle?: FileSystemDirectoryHandle;

  selectedWorkspaceName?: string
  isMounted: boolean
  mount: () => Promise<void>
  listWorkspace: () => Promise<string[]>
}

export const createWorkspaceSlice: StateCreator<WorkspaceSlice> = set => ({
  selectedWorkspaceName: undefined,
  isMounted: false,
  mount: async () => {
    await Workspace.mount()
    set({ isMounted: Workspace.isMounted })
  },

  listWorkspace: () => {
    return Workspace.listWorkspace()
  },
})
