'use client'

import { writeFile } from '@mc/shared/utils/fs'
import { useStore } from '@mc/store'
import { Button } from '@mc/ui/components/button'
import { cn } from '@mc/ui/lib/utils'
import { useEffect } from 'react'
// import { Input } from '@mc/ui/components/input'
import * as pathModule from '@zenfs/core/path.js'
import { ChevronRight } from 'lucide-react'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  ControlledTreeEnvironment,
  Tree,
  TreeDataProvider,
  type TreeItem,
  type TreeItemIndex,
  type TreeRef,
  type TreeViewState,
} from 'react-complex-tree'

const viewStateInitial: TreeViewState = {
  tree: {},
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
  const [viewState, setViewState] = useState<TreeViewState>(viewStateInitial)
  const [search] = useState<string | undefined>('')

  const dataProvider = useMemo(
    () => new CustomTreeDataProvider<string>(items),
    [items],
  )

  const getItemPath = useCallback(
    async (
      search: string,
      searchRoot: TreeItemIndex = 'root',
    ): Promise<TreeItemIndex[] | null> => {
      const item = await dataProvider.getTreeItem(searchRoot)

      if (item.data.toLowerCase().includes(search.toLowerCase())) {
        return [item.index]
      }

      const searchedItems = await Promise.all(
        item.children?.map(child => getItemPath(search, child)) ?? [],
      )

      const result = searchedItems.find(item => item !== null)
      if (!result) {
        return null
      }

      return [item.index, ...result]
    },
    [dataProvider],
  )

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (search) {
        getItemPath(search)
          .then((path) => {
            if (path) {
              return tree.current?.expandSubsequently(path).then(() => {
                tree.current?.selectItems([...[path.at(-1) ?? '']])
                tree.current?.focusItem(path.at(-1) ?? '')
                tree.current?.toggleItemSelectStatus(path.at(-1) ?? '')
              })
            }
          })
          .catch((error) => {
            console.error('Error getting item:', error)
          })
      }
    },
    [getItemPath, search],
  )

  return (
    <div className="mx-auto flex h-screen w-full flex-col gap-1 pt-[100px]">
      {/*
      <form
        onSubmit={onSubmit}
        className="flex items-center justify-start gap-2"
      >
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          placeholder="Search..."
        />
        <Button type="submit">Search</Button>
      </form>
      */}
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
      <ControlledTreeEnvironment<string>
        items={items}
        getItemTitle={item => item.data}
        canSearch={false}
        canSearchByStartingTyping={false}
        canRename={false}
        viewState={viewState}
        onExpandItem={(item, treeId) => {
          console.log('expand', item, treeId)
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
              expandedItems:
                prevViewState[treeId]?.expandedItems?.filter(
                  id => id !== item.index,
                ) ?? [],
            },
          }))
        }}
        onFocusItem={(item, treeId) => {
          setViewState(prevViewState => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId],
              focusedItem: item.index,
            },
          }))
        }}
        onSelectItems={(items, treeId) => {
          setViewState(prevViewState => ({
            ...prevViewState,
            [treeId]: {
              ...prevViewState[treeId],
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
        renderItem={({ title, item, arrow, context, depth, children }) => {
          const indentation = 10 * depth
          return (
            <li
              {...context.itemContainerWithChildrenProps}
              className="[&>button]:aria-[selected=true]:bg-primary/50 my-[1px] [&>button>svg]:aria-[expanded=true]:rotate-90"
            >
              <Button
                {...context.itemContainerWithoutChildrenProps}
                {...context.interactiveElementProps}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'w-fullitems-center h-6 w-full justify-start gap-[2px] border-none text-xs shadow-none',
                  'focus:bg-secondary/20',
                )}
                style={{
                  paddingLeft: `${String(item.isFolder ? indentation : indentation + 16)}px`,
                }}
              >
                {item.isFolder && arrow}
                {title}
              </Button>
              {children}
            </li>
          )
        }}
        renderItemArrow={({ context }) => {
          return <ChevronRight {...context.arrowProps} size={14} />
        }}
        renderItemTitle={({ title }) => <span>{title}</span>}
      >
        <Tree
          ref={tree}
          treeId="project"
          rootItem={projectPath ?? '/'}
          treeLabel="Project File Tree"
        />
      </ControlledTreeEnvironment>
    </div>
  )
}

interface EventEmitterOptionsType<T> {
  logger?: (log: string, payload?: T) => void
}

type EventHandlerType<T> =
  | ((payload: T) => Promise<void> | void)
  | null
  | undefined

class EventEmitter<EventPayload> {
  private handlerCount = 0

  private handlers: EventHandlerType<EventPayload>[] = []

  private options?: EventEmitterOptionsType<EventPayload>

  constructor(options?: EventEmitterOptionsType<EventPayload>) {
    this.options = options
  }

  public get numberOfHandlers() {
    return this.handlers.filter(h => !!h).length
  }

  public async emit(payload: EventPayload): Promise<void> {
    const promises: Promise<void>[] = []

    this.options?.logger?.('emit', payload)

    for (const handler of this.handlers) {
      if (handler) {
        const res = handler(payload) as Promise<void>
        if (typeof res.then === 'function') {
          promises.push(res)
        }
      }
    }

    await Promise.all(promises)
  }

  public on(handler: EventHandlerType<EventPayload>): number {
    this.options?.logger?.('on')
    this.handlers.push(handler)

    return this.handlerCount++
  }

  public off(handlerId: number) {
    this.delete(handlerId)
  }

  public delete(handlerId: number) {
    this.options?.logger?.('off')
    this.handlers[handlerId] = null
  }
}

class CustomTreeDataProvider<T> implements TreeDataProvider<T> {
  private items: Record<TreeItemIndex, TreeItem<T>>
  private setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>

  public readonly onDidChangeTreeDataEmitter = new EventEmitter<
    TreeItemIndex[]
  >()

  constructor(
    items: Record<TreeItemIndex, TreeItem<T>>,
    setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>,
  ) {
    this.items = items
    this.setItemName = setItemName
  }

  public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem<T>> {
    const item = this.items[itemId]
    if (!item) {
      return Promise.resolve({
        index: itemId,
        isFolder: false,
        data: `Unknown Item: ${String(itemId)}` as T,
      })
    }
    return Promise.resolve(item)
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[],
  ) {
    if (this.items[itemId]) {
      this.items[itemId].children = newChildren
      await this.onDidChangeTreeDataEmitter.emit([itemId])
    }
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void,
  ) {
    const handlerId = this.onDidChangeTreeDataEmitter.on((payload) => {
      listener(payload)
    })
    return {
      dispose: () => {
        this.onDidChangeTreeDataEmitter.off(handlerId)
      },
    }
  }

  public async onRenameItem(item: TreeItem<T>, name: string): Promise<void> {
    if (this.setItemName) {
      this.items[item.index] = this.setItemName(item, name)
    }
    return Promise.resolve()
  }
}
