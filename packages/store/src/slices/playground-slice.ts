import { Workspace } from '@mc/shared/lib/workspace'
import type { DataSourceItems } from '@mc/shared/types/file-tree'
import type { StateCreator } from 'zustand'

export interface PlaygroundSlice {
  workspace?: Workspace
  fileTreeDataSourceItems: DataSourceItems
  setWorkspace: (workspaceName: string) => void
  getFileTreeDataSourceItems: (workspacePath: string) => Promise<void>
}

export const createPlaygroundSlice: StateCreator<PlaygroundSlice> = (
  set,
  get,
) => ({
  fileTreeDataSourceItems: {},

  setWorkspace: (workspaceName: string) => {
    const workspace = new Workspace(workspaceName)
    set({
      workspace,
      fileTreeDataSourceItems: {
        [workspace.cwd]: {
          index: workspace.cwd,
          isFolder: true,
          children: [],
          data: workspace.name,
        },
      },
    })
  },
  getFileTreeDataSourceItems: async (path) => {
    const { fileTreeDataSourceItems } = get()
    const fileTreeItem = fileTreeDataSourceItems[path]
    const fileTreeItems = await Workspace.getFileTreeDataSourceItems(path)
    const newItems: DataSourceItems = Object.assign(
      {},
      fileTreeDataSourceItems,
      fileTreeItems,
      fileTreeItem
        ? {
            [path]: {
              ...fileTreeItem,
              children: Object.keys(fileTreeItems),
            },
          }
        : {},
    )
    set({ fileTreeDataSourceItems: newItems })
  },
})
