import { configureSingle } from '@zenfs/core'
import { IndexedDB } from '@zenfs/dom'
import type { StateCreator } from 'zustand'

export interface FsSlice {
  isFsInitialized: boolean
  initializeFs: () => Promise<void>
}

export const createFsSlice: StateCreator<FsSlice> = set => ({
  isFsInitialized: false,
  initializeFs: async () => {
    await configureSingle({ backend: IndexedDB })
    set({ isFsInitialized: true })
  },
})
