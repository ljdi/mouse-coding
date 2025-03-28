'use client'

import { WORKSPACES_PATH } from '@mc/shared/constants/fs'
import { FC, useState } from 'react'
import {
  ControlledTreeEnvironment,
  ExplicitDataSource,
  Tree,
  TreeItemIndex,
} from 'react-complex-tree'
import 'react-complex-tree/lib/style-modern.css'

interface FileTreeProps {
  path: string
}

export const FileTree: FC<FileTreeProps> = ({ path }) => {
  const [items, setItems] = useState<ExplicitDataSource<string>['items']>({
    [WORKSPACES_PATH]: {
      index: WORKSPACES_PATH,
      isFolder: true,
      children: [],
      data: '',
    },
  })

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>()
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([])
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([])

  return (
    <ControlledTreeEnvironment
      items={items}
      getItemTitle={item => item.data}
      viewState={{
        [path]: {
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
      onSelectItems={(items) => {
        setSelectedItems(items)
      }}
      onMissingItems={(items) => {
        alert(`We should now load the items ${items.join(', ')}...`)
      }}
    >
      <Tree treeId={path} rootItem={WORKSPACES_PATH} treeLabel="Tree Example" />
    </ControlledTreeEnvironment>
  )
}
