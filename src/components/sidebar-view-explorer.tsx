import * as pathModule from '@zenfs/core/path'
import { ChevronRight, File, FolderIcon } from 'lucide-react'
import { useEffect, useRef, useState, type FC } from 'react'
import { ControlledTreeEnvironment, Tree, type TreeRef, type TreeViewState } from 'react-complex-tree'

import {
  ConfigurableContextMenu,
  type ConfigurableContextMenuItem,
  type OnSelect,
} from '@/components/configurable-context-menu'
import { Input } from '@/components/ui/input'
import { FileSystemAction } from '@/constants/action'
import { treeContainerContextMenuItems } from '@/constants/sidebar'
import { useFileTreeTempItems } from '@/hooks/useFileTreeTempItems'
import { writeFile } from '@/lib/file-system'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import type { FileTreeEditing } from '@/types/view'

const TreeItemInput: FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <div className='flex items-center gap-1'>
      <Input
        className='w-full'
        value={value}
        onInput={(e) => {
          console.log(e, 'onInput')
          onChange(e.target.value)
        }}
        autoFocus
      />
    </div>
  )
}

const TREE_ID = 'project'
const viewStateInitial = {
  [TREE_ID]: {
    focusedItem: undefined,
    selectedItems: [],
    expandedItems: [],
  },
}

export const SidebarViewExplorer = () => {
  const projectPath = useStore((state) => state.projectPath)
  const projectFileTree = useStore((state) => state.projectFileTree)
  const createFile = useStore((state) => state.createFile)
  const createDirectory = useStore((state) => state.createDirectory)
  const getProjectFileTree = useStore((state) => state.getProjectFileTree)
  const items = useStore((state) => state.fileTreeDataSourceItems)
  const convertFileTreeDataSourceItems = useStore((state) => state.convertFileTreeDataSourceItems)
  const [editing, setEditing] = useState<FileTreeEditing | undefined>()
  const tempItems = useFileTreeTempItems(editing)

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
  const [viewState, setViewState] = useState<TreeViewState<string>>(viewStateInitial)

  const createContextMenuSelectHandler = (baseDir: string): OnSelect => {
    return async (event: Event, item: ConfigurableContextMenuItem) => {
      switch (item.type) {
        case 'item':
          {
            const index = crypto.randomUUID()
            if (item.id === 'create-file') {
              // await createFile(pathModule.join(baseDir))
              setEditing({
                index,
                path: pathModule.join(baseDir),
                name: '123',
                type: FileSystemAction.CREATE_FILE,
              })
              console.log(event, '-0-------', baseDir)
            } else if (item.id === 'create-folder') {
              // await createDirectory(pathModule.join(baseDir, ))
              console.log(event, '-1-------')
              setEditing({
                index,
                path: pathModule.join(baseDir),
                name: '456',
                type: FileSystemAction.CREATE_DIRECTORY,
              })
            }
          }
          break
        default:
          break
      }
    }
  }

  // TODO: 单选多选
  const createContextMenuCheckedChangeHandler = (baseDir: string) => {
    return (checked: boolean, item: ConfigurableContextMenuItem) => {
      console.log('createContextMenuCheckedChangeHandler', baseDir, checked, item)
    }
  }
  const createContextMenuValueChangeHandler = (baseDir: string) => {
    return (value: string, item: ConfigurableContextMenuItem) => {
      console.log(value, 'createContextMenuValueChangeHandler', baseDir, value, item)
    }
  }

  if (!projectPath) {
    return undefined
  }

  return (
    <div className='mx-auto flex h-screen w-full flex-col gap-1'>
      <button
        onClick={(): void => {
          writeFile(pathModule.join(`${projectPath}/${String(Math.random())}`), 'hello world')
            .then(getProjectFileTree)
            .catch(console.error)
        }}
      >
        create file
      </button>
      <ControlledTreeEnvironment
        items={editing ? tempItems : items}
        getItemTitle={(item) => item.data}
        canSearch={false}
        canSearchByStartingTyping={false}
        canRename={false}
        viewState={viewState}
        onExpandItem={(item, treeId) => {
          setViewState((prevViewState) => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId],
              expandedItems: [...(prevViewState[treeId]?.expandedItems ?? []), item.index],
            },
          }))
        }}
        onCollapseItem={(item, treeId) => {
          setViewState((prevViewState) => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId],
              expandedItems: prevViewState[treeId]?.expandedItems?.filter((id) => id !== item.index),
            },
          }))
        }}
        onFocusItem={(item, treeId) => {
          setViewState((prevViewState) => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId as keyof typeof viewState],
              focusedItem: item.index,
            },
          }))
        }}
        onSelectItems={(items, treeId) => {
          setViewState((prevViewState) => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId as keyof typeof viewState],
              selectedItems: [items.at(-1) ?? ''],
            },
          }))
        }}
        renderTreeContainer={({ children, containerProps }) => {
          return (
            <div {...containerProps} className='h-full'>
              <ConfigurableContextMenu
                items={treeContainerContextMenuItems}
                onSelect={createContextMenuSelectHandler(projectPath)}
                onCheckedChange={createContextMenuCheckedChangeHandler(projectPath)}
                onValueChange={createContextMenuValueChangeHandler(projectPath)}
              >
                {children}
              </ConfigurableContextMenu>
            </div>
          )
        }}
        renderRenameInput={({ item, inputProps }) => {
          console.log('renderRenameInput', item, inputProps)
          return <input value={item.data} onInput={(value) => console.log(value, 'onChange')} />
        }}
        renderItem={({ title, item, context, depth, children }) => {
          const indentation = 10 * depth
          return (
            <li
              {...context.itemContainerWithChildrenProps}
              className='[&>div]:aria-[selected=true]:bg-primary/50 my-[1px] [&>div>svg.chevron]:aria-[expanded=true]:rotate-90'
            >
              <div
                {...context.itemContainerWithoutChildrenProps}
                {...context.interactiveElementProps}
                className={cn(
                  'flex h-6 w-full items-center justify-between gap-[2px] border-none text-xs',
                  'focus:bg-secondary/20 hover:bg-secondary/10 rounded px-1'
                )}
                style={{
                  paddingLeft: `${String(indentation)}px`,
                }}
              >
                <div className='flex items-center gap-1'>
                  {item.isFolder
                    ? (
                      <ChevronRight
                        {...context.arrowProps}
                        className={cn(
                          'chevron transition-transform duration-150',
                          viewState[TREE_ID]?.expandedItems?.includes(item.index) && 'rotate-90'
                        )}
                        size={14}
                      />
                      )
                    : (
                      <span className='w-[14px]' />
                      )}

                  {item.isFolder
                    ? (
                      <FolderIcon size={14} className='text-yellow-500' />
                      )
                    : (
                      <File size={14} className='text-blue-500' />
                      )}
                  <span>{title}</span>
                </div>
              </div>
              {children}
            </li>
          )
        }}
      >
        <Tree ref={tree} treeId={TREE_ID} rootItem={projectPath ?? '/'} treeLabel='Project File Tree' />
      </ControlledTreeEnvironment>
    </div>
  )
}
