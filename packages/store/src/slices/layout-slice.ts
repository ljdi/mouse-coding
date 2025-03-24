import { StateCreator } from 'zustand'

export interface LayoutSlice {
  defaultLayout: number[]
  isPrimarySidebarCollapsed: boolean
  togglePrimarySidebar: () => void
}

export const createLayoutSlice: StateCreator<LayoutSlice> = set => ({
  defaultLayout: [10, 90],
  isPrimarySidebarCollapsed: false,
  togglePrimarySidebar: () => {
    set(state => ({
      isPrimarySidebarCollapsed: !state.isPrimarySidebarCollapsed,
    }))
  },
})
