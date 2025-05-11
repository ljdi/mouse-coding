import { BaseFile, FileType } from '@mc/shared/types/fs'
import { ExplicitDataSource, TreeItemIndex } from 'react-complex-tree'
import type { StateCreator } from 'zustand'

type DataSourceItems = ExplicitDataSource<string>['items']

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

      // Ensure children array is initialized
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

        // Recursively process directory children if it's a folder
        if (isFolder) {
          const directoryItem = item as BaseFile<FileType.DIRECTORY>
          convert(item.path, directoryItem.metadata?.children)
        }
      }
    }

    // Start conversion process from the root
    convert(path, metadata?.children)

    // Sort all nodes - separate folders and files
    const sortedDataSourceItems = Object.entries(
      fileTreeDataSourceItems,
    ).reduce<DataSourceItems>((acc, [key, item]) => {
      // Skip items with no children or undefined children
      if (!item.children?.length) {
        acc[key] = item
        return acc
      }

      // Partition children into folders and files for sorting
      const folders: TreeItemIndex[] = []
      const files: TreeItemIndex[] = []

      // Sort children into folders and files
      for (const childIndex of item.children) {
        const childItem = fileTreeDataSourceItems[childIndex]
        if (!childItem) continue

        if (childItem.isFolder) {
          folders.push(childIndex)
        }
        else {
          files.push(childIndex)
        }
      }

      // Sort function for alphabetical ordering
      const compareFn = (a: TreeItemIndex, b: TreeItemIndex) =>
        String(a).localeCompare(String(b))

      // Sort folders and files alphabetically and combine (folders first)
      acc[key] = {
        ...item,
        children: [...folders.sort(compareFn), ...files.sort(compareFn)],
      }

      return acc
    }, {})

    // Update state with the sorted tree structure
    set({ fileTreeDataSourceItems: sortedDataSourceItems })
  },
})
