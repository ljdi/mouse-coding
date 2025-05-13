import { useEffect, useState } from 'react'
import type { TreeItem, TreeItemIndex } from 'react-complex-tree'

import { useStore } from '@/store'
import type { FileTreeEditing } from '@/types/view'

export const useFileTreeTempItems = (editing?: FileTreeEditing) => {
  const items = useStore((state) => state.fileTreeDataSourceItems)
  const [tempItems, setTempItems] = useState<Record<TreeItemIndex, TreeItem<string>>>({})

  useEffect(() => {
    if (editing) {
      const { index, path, name } = editing
      const newItems = {
        ...items,
        [index]: {
          index,
          data: name,
          canRename: true,
        },
        [path]: {
          ...items[path],
          children: [index, ...(items[path]?.children ?? [])],
        },
      }
      setTempItems(newItems)
    }
  }, [editing, items])

  return tempItems
}
