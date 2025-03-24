import type { StateCreator } from 'zustand'

// 定义 Counter Slice 的状态和操作
export interface FsSlice {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// 创建 Fs Slice
export const createFsSlice: StateCreator<FsSlice> = set => ({
  count: 0,
  increment: () => { set(state => ({ count: state.count + 1 })) },
  decrement: () => { set(state => ({ count: state.count - 1 })) },
  reset: () => { set({ count: 0 }) },
})
