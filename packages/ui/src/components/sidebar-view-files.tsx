'use client'

import { ControlledTreeEnvironment, Tree } from 'react-complex-tree'
import 'react-complex-tree/lib/style-modern.css'

export function SidebarViewFiles() {
  const items = {
    root: {
      index: 'root',
      isFolder: true,
      children: ['child1', 'child2'],
      data: 'Root item',
    },
    child1: {
      index: 'child1',
      children: [],
      data: 'Child item 1',
    },
    child2: {
      index: 'child2',
      isFolder: true,
      children: ['child3'],
      data: 'Child item 2',
    },
    child3: {
      index: 'child3',
      children: [],
      data: 'Child item 3',
    },
  }

  return (
    <ControlledTreeEnvironment
      items={items}
      getItemTitle={item => item.data}
      viewState={{}}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </ControlledTreeEnvironment>
  )
}
