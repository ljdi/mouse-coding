import { create } from 'zustand'

import { createDndSlice, type DndSlice } from '@/store/slices/dnd-slice'
import { createEditorSlice, type EditorSlice } from '@/store/slices/editor-slice'
import { createFsSlice, type FsSlice } from '@/store/slices/fs-slice'
import { createLayoutSlice, type LayoutSlice } from '@/store/slices/layout-slice'
import { createLoadingSlice, type LoadingSlice } from '@/store/slices/loading-slice'
import { createPlaygroundSlice, type PlaygroundSlice } from '@/store/slices/playground-slice'
import { createProjectSlice, type ProjectSlice } from '@/store/slices/project-slice'

// 组合所有 slices 到一个 store 类型
export type StoreState = DndSlice & EditorSlice & FsSlice & LayoutSlice & LoadingSlice & PlaygroundSlice & ProjectSlice

export type InitialState = Partial<{
  [K in keyof StoreState]: StoreState[K] extends (...args: unknown[]) => unknown ? never : StoreState[K]
}>

export const useStore = create<StoreState>()((...rest) => {
  return {
    ...createDndSlice(...rest),
    ...createEditorSlice(...rest),
    ...createFsSlice(...rest),
    ...createLayoutSlice(...rest),
    ...createLoadingSlice(...rest),
    ...createPlaygroundSlice(...rest),
    ...createProjectSlice(...rest),
  }
})
