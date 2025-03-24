import { StoreContext } from '@mc/store/providers/store-provider'
import {
  createCounterSlice,
  type CounterSlice,
} from '@mc/store/slices/counter-slice'
import { createDndSlice, type DndSlice } from '@mc/store/slices/dnd-slice'
import {
  createEditorSlice,
  type EditorSlice,
} from '@mc/store/slices/editor-slice'
import { createFsSlice, type FsSlice } from '@mc/store/slices/fs-slice'
import {
  createLayoutSlice,
  type LayoutSlice,
} from '@mc/store/slices/layout-slice'
import {
  createWorkspaceSlice,
  type WorkspaceSlice,
} from '@mc/store/slices/workspace-slice'
import { useContext } from 'react'
import { create, useStore as useZustandStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

// 组合所有 slices 到一个 store 类型
export type StoreState = CounterSlice &
  DndSlice &
  EditorSlice &
  LayoutSlice &
  FsSlice &
  WorkspaceSlice

export type InitialState = Partial<{
  [K in keyof StoreState]: StoreState[K] extends (...args: unknown[]) => unknown
    ? never
    : StoreState[K];
}>

// 创建 store 工厂函数
export const createStore = (initialState: InitialState = {}) => {
  // 创建基础 store
  const store = create<StoreState>()((set, get, api) => {
    return {
      ...createCounterSlice(set, get, api),
      ...createDndSlice(set, get, api),
      ...createEditorSlice(set, get, api),
      ...createLayoutSlice(set, get, api),
      ...createFsSlice(set, get, api),
      ...createWorkspaceSlice(set, get, api),
      ...initialState,
    }
  })

  return store
}

// 创建通用 hook 来使用 store
export function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used within StoreProvider')

  return useZustandStore(store, useShallow(selector))
}
