import { LoadingKey } from '@mc/shared/constants/loading'
import { StateCreator } from 'zustand'

export interface LoadingSlice {
  counters: Record<LoadingKey | string, number>
  instances: Record<LoadingKey | string, string[]>
  addInstance: (key: LoadingKey, id: string) => void
  removeInstance: (key: LoadingKey, id: string) => void
  isLoading: (key: LoadingKey) => boolean
}

export const createLoadingSlice: StateCreator<LoadingSlice> = (set, get) => ({
  counters: {},
  instances: {},

  addInstance: (key, id) => {
    set(state => ({
      counters: {
        ...state.counters,
        [key]: (state.counters[key] ?? 0) + 1,
      },
      instances: {
        ...state.instances,
        [key]: [...(state.instances[key] ?? []), id],
      },
    }))
  },
  removeInstance: (key, id) => {
    set(state => ({
      counters: {
        ...state.counters,
        [key]: Math.max((state.counters[key] ?? 0) - 1, 0),
      },
      instances: {
        ...state.instances,
        [key]: (state.instances[key] ?? []).filter(i => i !== id),
      },
    }))
  },

  isLoading: (key) => {
    return (get().counters[key] ?? 0) > 0
  },
})
