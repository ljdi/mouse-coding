'use client'

import { writeFile } from '@mc/shared/utils/fs'
import { useStore } from '@mc/store'
import { cn } from '@mc/ui/lib/utils'
import { useEffect } from 'react'
// import { Input } from '@mc/ui/components/input'
import * as pathModule from '@zenfs/core/path.js'
import {
  ChevronRight,
  File,
  FolderIcon,
} from 'lucide-react'
import { useRef, useState } from 'react'
import {
  ControlledTreeEnvironment,
  Tree,
  TreeViewState,
  type TreeRef,
} from 'react-complex-tree'

const TREE_ID = 'project'

const viewStateInitial = {
  [TREE_ID]: {
    focusedItem: undefined,
    selectedItems: [],
    expandedItems: [],
  },
}

export const SidebarViewExplorer = () => {
  const projectPath = useStore(state => state.projectPath)
  const projectFileTree = useStore(state => state.projectFileTree)
  const getProjectFileTree = useStore(state => state.getProjectFileTree)
  const items = useStore(state => state.fileTreeDataSourceItems)
  const convertFileTreeDataSourceItems = useStore(
    state => state.convertFileTreeDataSourceItems,
  )

  useEffect(() => {
    getProjectFileTree().catch(console.error)
  }, [projectPath, getProjectFileTree])

  // 工作区可用时，获取工作区的文件树数据源
  useEffect(() => {
    if (projectFileTree) {
      convertFileTreeDataSourceItems(projectFileTree)
    }
  }, [projectFileTree, convertFileTreeDataSourceItems])

  const tree = useRef<TreeRef>(null)
  const [viewState, setViewState]
    = useState<TreeViewState<string>>(viewStateInitial)

  return (
    <div className="mx-auto flex h-screen w-full flex-col gap-1">
      <button
        onClick={(): void => {
          void writeFile(
            pathModule.join(`${projectPath}/${String(Math.random())}`),
            'hello world',
          )
            .then(getProjectFileTree)
            .catch(console.error)
        }}
      >
        create file
      </button>
      <ControlledTreeEnvironment
        items={items}
        getItemTitle={item => item.data}
        canSearch={false}
        canSearchByStartingTyping={false}
        canRename={false}
        viewState={viewState}
        onExpandItem={(item, treeId) => {
          setViewState(prevViewState => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId],
              expandedItems: [
                ...(prevViewState[treeId]?.expandedItems ?? []),
                item.index,
              ],
            },
          }))
        }}
        onCollapseItem={(item, treeId) => {
          setViewState(prevViewState => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId],
              expandedItems: prevViewState[treeId]?.expandedItems?.filter(
                id => id !== item.index,
              ),
            },
          }))
        }}
        onFocusItem={(item, treeId) => {
          setViewState(prevViewState => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId as keyof typeof viewState],
              focusedItem: item.index,
            },
          }))
        }}
        onSelectItems={(items, treeId) => {
          setViewState(prevViewState => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId as keyof typeof viewState],
              selectedItems: [items.at(-1) ?? ''],
            },
          }))
        }}
        renderTreeContainer={({ children, containerProps }) => {
          return (
            <div
              {...containerProps}
              className="tree-container border-border border p-[1px]"
            >
              {children}
            </div>
          )
        }}
        renderLiveDescriptorContainer={({}) => <></>}
        renderItemsContainer={({ children, containerProps }) => {
          return <ul {...containerProps}>{children}</ul>
        }}
        renderItem={({ title, item, context, depth, children }) => {
          const indentation = 10 * depth
          return (
            <li
              {...context.itemContainerWithChildrenProps}
              className="[&>div]:aria-[selected=true]:bg-primary/50 my-[1px] [&>div>svg.chevron]:aria-[expanded=true]:rotate-90"
            >
              <div
                {...context.itemContainerWithoutChildrenProps}
                {...context.interactiveElementProps}
                className={cn(
                  'flex h-6 w-full items-center justify-between gap-[2px] border-none text-xs',
                  'focus:bg-secondary/20 hover:bg-secondary/10 rounded px-1',
                )}
                style={{
                  paddingLeft: `${String(indentation)}px`,
                }}
              >
                <div className="flex items-center gap-1">
                  {item.isFolder
                    ? (
                        <ChevronRight
                          {...context.arrowProps}
                          className={cn(
                            'chevron transition-transform duration-150',
                            viewState[TREE_ID]?.expandedItems?.includes(
                              item.index,
                            ) && 'rotate-90',
                          )}
                          size={14}
                        />
                      )
                    : (
                        <span className="w-[14px]"></span>
                      )}

                  {item.isFolder
                    ? (
                        <FolderIcon size={14} className="text-yellow-500" />
                      )
                    : (
                        <File size={14} className="text-blue-500" />
                      )}
                  <span>
                    {title}
                  </span>
                </div>
              </div>
              {children}
            </li>
          )
        }}
      >
        <Tree
          ref={tree}
          treeId={TREE_ID}
          rootItem={projectPath ?? '/'}
          treeLabel="Project File Tree"
        />
      </ControlledTreeEnvironment>
    </div>
  )
}
