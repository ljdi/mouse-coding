'use client'

import { TreeView } from '@/components/tree-view'
import { useStore } from '@mc/store'
import { useEffect } from 'react'

export const FileTree = () => {
  const workspace = useStore(state => state.workspace)

  const fileTreeDataSourceItems = useStore(
    state => state.fileTreeDataSourceItems,
  )
  const getFileTreeDataSourceItems = useStore(
    state => state.getFileTreeDataSourceItems,
  )

  // 工作区可用时，获取工作区的文件树数据源
  useEffect(() => {
    if (workspace) {
      getFileTreeDataSourceItems(workspace.cwd).catch(console.error)
    }
  }, [workspace, getFileTreeDataSourceItems])

  return <TreeView treeData={fileTreeDataSourceItems} />
}
