'use client'

import { Workspace } from '@mc/shared/lib/workspace'
import { FC, useCallback, useEffect, useState } from 'react'
import {
  ControlledTreeEnvironment,
  ExplicitDataSource,
  Tree,
  TreeItemIndex,
} from 'react-complex-tree'
import 'react-complex-tree/lib/style-modern.css'

type TreeItems = ExplicitDataSource<string>['items']

interface FileTreeProps {
  workspaceName: string
}
export const FileTree: FC<FileTreeProps> = ({ workspaceName }) => {
  const [workspace] = useState<Workspace>(new Workspace(workspaceName))
  const [items, setItems] = useState<TreeItems>({
    [workspaceName]: {
      index: workspaceName,
      isFolder: true,
      children: [],
      data: workspaceName,
    },
  })

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>()
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([])
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([])

  const fetchItems = useCallback(
    async (treeItemIndex: string) => {
      const treeItem = items[treeItemIndex]
      const treeItemEntries = await workspace.getPathEntries(treeItemIndex)
      const newItems: TreeItems = {
        ...items,
        ...treeItemEntries,
      }
      if (treeItem) {
        newItems[treeItemIndex] = {
          ...treeItem,
          children: Object.keys(treeItemEntries),
        }
      }
      setItems(newItems)
    },
    [workspace, items],
  )

  useEffect(() => {
    fetchItems(workspaceName).catch(console.error)
  }, [fetchItems, workspaceName])

  const handleMissingItems = useCallback(
    async (missingItemIndices: TreeItemIndex[]): Promise<void> => {
      console.info(
        `We should now load the items ${missingItemIndices.join(', ')}...`,
      )

      for (const missingItemIndex of missingItemIndices) {
        if (typeof missingItemIndex === 'string') {
          await fetchItems(missingItemIndex)
        }
      }
    },
    [fetchItems],
  )

  return (
    <ControlledTreeEnvironment
      items={items}
      getItemTitle={item => item.data}
      canDragAndDrop
      canDropOnFolder
      canDrag={() => true}
      canDropAt={() => true}
      viewState={{
        [workspaceName]: {
          focusedItem,
          expandedItems,
          selectedItems,
        },
      }}
      onFocusItem={(item) => {
        setFocusedItem(item.index)
      }}
      onExpandItem={(item) => {
        setExpandedItems([...expandedItems, item.index])
      }}
      onCollapseItem={(item) => {
        setExpandedItems(
          expandedItems.filter(
            expandedItemIndex => expandedItemIndex !== item.index,
          ),
        )
      }}
      onSelectItems={setSelectedItems}
      onMissingItems={(items) => {
        void handleMissingItems(items)
      }}
    >
      <Tree treeId={workspaceName} rootItem={workspaceName} />
    </ControlledTreeEnvironment>
  )
}
