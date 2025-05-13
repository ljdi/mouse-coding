import type { StateCreator } from 'zustand'

import { LayoutId, type LayoutIdType } from '@/constants/layout'

export interface LayoutSlice {
  defaultSizeMap: Partial<Record<LayoutIdType, number[]>>

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
