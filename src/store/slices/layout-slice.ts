import type { StateCreator } from 'zustand'

import { LayoutId } from '@/constants/layout'

export interface LayoutSlice {
  defaultSizeMap: Partial<Record<LayoutId, number[]>>

  isPrimarySideBarCollapsed: boolean
  togglePrimarySideBar: () => void
}

export const createLayoutSlice: StateCreator<LayoutSlice> = (set) => ({
  defaultSizeMap: { [LayoutId.PLAYGROUND]: [10, 90] },
  isPrimarySideBarCollapsed: false,

  togglePrimarySideBar: () => {
    set((state) => ({
      isPrimarySideBarCollapsed: !state.isPrimarySideBarCollapsed,
    }))
  },
})
