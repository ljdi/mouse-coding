import { Workspace } from '@mc/workspace'
import type { StateCreator } from 'zustand'

// 定义 Counter Slice 的状态和操作
export interface WorkspaceSlice {
  // TODO: File System API 只有 Chromium 系列浏览器支持，有时间再做
  // syncDirectoryHandle?: FileSystemDirectoryHandle;
  workspace?: Workspace
  initWorkspaces: () => void
  createWorkspace: (workspace: Workspace) => void
  changeWorkspace: (workspace: Workspace) => void
  listWorkspaces: () => Promise<string[]>
  // packageManager?: PackageManager;
}

// 创建 Workspace Slice
export const createWorkspaceSlice: StateCreator<WorkspaceSlice> = set => ({
  workspace: undefined,
  initWorkspaces: async () => {
    await Workspace.initWorkspaces()
  },
  createWorkspace: (workspace) => {
    set({ workspace: Workspace.createWorkspace(workspace) })
  },
  changeWorkspace: ({ name, path }) => {
    set({ workspace: new Workspace(name, path) })
  },
  listWorkspaces: async () => {
    const workspaces = await Workspace.listWorkspaces()
    return workspaces
  },
})
