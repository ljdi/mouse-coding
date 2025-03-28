import { LayoutId } from '@mc/shared/constants/layout'
import { StateCreator } from 'zustand'

export interface LayoutSlice {
  defaultSizeMap: Record<LayoutId, number[]>

  isPrimarySideBarCollapsed: boolean
  togglePrimarySideBar: () => void
}

export const createLayoutSlice: StateCreator<LayoutSlice> = set => ({
  defaultSizeMap: [LayoutId.PLAYGROUND, LayoutId.WORKSPACE].reduce(
    (acc, cur) => ({ ...acc, [cur]: [10, 90] }),
    {} as Record<LayoutId, number[]>,
  ),
  isPrimarySideBarCollapsed: false,
  togglePrimarySideBar: () => {
    set(state => ({
      isPrimarySideBarCollapsed: !state.isPrimarySideBarCollapsed,
    }))
  },
})
