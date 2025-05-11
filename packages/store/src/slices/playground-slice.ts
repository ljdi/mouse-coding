import type { DataSourceItems } from '@mc/shared/types/file-tree'
import { BaseFile, FileType } from '@mc/shared/types/fs'
import type { StateCreator } from 'zustand'

export interface PlaygroundSlice {
  fileTreeDataSourceItems: DataSourceItems
  convertFileTreeDataSourceItems: (
    workspacePath: BaseFile<FileType.DIRECTORY>,
  ) => void
}

export const createPlaygroundSlice: StateCreator<PlaygroundSlice> = set => ({
  fileTreeDataSourceItems: {},
  convertFileTreeDataSourceItems: ({ path, name, metadata }) => {
    const fileTreeDataSourceItems: DataSourceItems = {}

    // Initialize root node
    fileTreeDataSourceItems[path] = {
      index: path,
      children: [],
      isFolder: true,
      data: name,
    }

    // Recursively convert file tree
    const convert = (parentPath: string, children?: BaseFile[]) => {
      if (!children?.length) return

      const parentItem = fileTreeDataSourceItems[parentPath]
      if (!parentItem) return

      // Initialize children array if needed
      if (!Array.isArray(parentItem.children)) {
        parentItem.children = []
      }

      for (const item of children) {
        const isFolder = item.type === FileType.DIRECTORY

        // Add child to parent's children array
        parentItem.children.push(item.path)

        // Create item in the data source
        fileTreeDataSourceItems[item.path] = {
          index: item.path,
          children: [],
          isFolder,
          data: item.name,
        }

        // Recursively process directory children
        if (isFolder) {
          convert(
            item.path,
            (item as BaseFile<FileType.DIRECTORY>).metadata?.children,
          )
        }
      }
    }

    convert(path, metadata?.children)

    set({ fileTreeDataSourceItems })
  },
})
