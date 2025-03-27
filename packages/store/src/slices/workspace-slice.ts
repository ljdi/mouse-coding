import { WORKSPACES_PATH } from '@mc/shared/constants/workspace'
import { configureSingle } from '@zenfs/core'
import * as path from '@zenfs/core/path.js'
import * as fs from '@zenfs/core/promises'
import { IndexedDB } from '@zenfs/dom'
import type { StateCreator } from 'zustand'

export interface WorkspaceSlice {
  // syncDirectoryHandle?: FileSystemDirectoryHandle; // TODO: File System API 只有 Chromium 系列浏览器支持，有时间再做

  activeWorkspaceName?: string
  workspaceInitialized: boolean

  initializeWorkspaces: () => Promise<void>
  getWorkspacePath: (workspaceName?: string) => Promise<string>
  getWorkspaceNames: () => Promise<string[]>

  createWorkspace: (workspaceName: string) => Promise<void>
  selectWorkspace: (name: string) => void
  deleteWorkspace: (name: string) => Promise<void>
  renameWorkspace: (newName: string) => Promise<void>
}

export const createWorkspaceSlice: StateCreator<WorkspaceSlice> = (
  set,
  get,
) => ({
  workspaceInitialized: false,
  activeWorkspaceName: undefined,

  initializeWorkspaces: async () => {
    await configureSingle({ backend: IndexedDB })

    if (!(await fs.exists(WORKSPACES_PATH))) {
      await fs.mkdir(WORKSPACES_PATH, { recursive: true })
    }

    set({ workspaceInitialized: true })
  },

  getWorkspacePath: async (workspaceName) => {
    const name = workspaceName ?? get().activeWorkspaceName

    if (!name) {
      throw Error('No active workspace selected or provided')
    }

    const workspacePath = path.join(WORKSPACES_PATH, name)
    if (!(await fs.exists(workspacePath))) {
      throw Error('Workspace not found')
    }
    return workspacePath
  },

  getWorkspaceNames: async () => {
    const workspaceNameList = await fs.readdir(WORKSPACES_PATH)
    return workspaceNameList
  },
  selectWorkspace: (activeWorkspaceName) => {
    set({ activeWorkspaceName })
  },

  createWorkspace: async (workspaceName) => {
    const workspacePath = `${WORKSPACES_PATH}/${workspaceName}`

    if (await fs.exists(workspacePath)) {
      throw Error('Workspace name already exists.')
    }
    await fs.mkdir(workspacePath)
    // TODO: npm init
  },

  deleteWorkspace: async () => {
    const workspacePath = await get().getWorkspacePath()

    await fs.rmdir(workspacePath)
  },

  renameWorkspace: async (newName: string) => {
    const workspacePath = await get().getWorkspacePath()
    const newPath = path.join(WORKSPACES_PATH, newName)
    if (await fs.exists(newPath)) {
      throw Error('A workspace with this name already exists.')
    }
    await fs.rename(workspacePath, newPath)
  },
})
