import { LayoutId } from '@mc/shared/constants/layout'
import { StateCreator } from 'zustand'

export interface LayoutSlice {
  defaultSizeMap: Partial<Record<LayoutId, number[]>>

  isPrimarySideBarCollapsed: boolean
  togglePrimarySideBar: () => void
}

export const createLayoutSlice: StateCreator<LayoutSlice> = set => ({
  defaultSizeMap: {},
  isPrimarySideBarCollapsed: false,

  togglePrimarySideBar: () => {
    set(state => ({
      isPrimarySideBarCollapsed: !state.isPrimarySideBarCollapsed,
    }))
  },
})
