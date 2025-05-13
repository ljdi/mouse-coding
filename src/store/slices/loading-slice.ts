import type { StateCreator } from 'zustand'

import type { LoadingInstance, LoadingInstanceKey, LoadingInstanceMap } from '@/types/loading'

export interface LoadingSlice {
  loadingInstanceMap: LoadingInstanceMap
  addLoadingInstance: (instance: LoadingInstance) => void
  removeLoadingInstance: (instanceLike: Partial<LoadingInstance>) => void
  getInstances: (instanceLike: Partial<LoadingInstance>) => LoadingInstance[]
  isInstanceLoading: (instanceLike: Partial<LoadingInstance>) => boolean
}

export const createLoadingSlice: StateCreator<LoadingSlice> = (set, get) => ({
  loadingInstanceMap: new Map<string, LoadingInstance>(),

  addLoadingInstance: (instance) => {
    const newMap = new Map<string, LoadingInstance>(get().loadingInstanceMap)
    newMap.set(instance.id, instance)

    set({ loadingInstanceMap: newMap })
  },
  removeLoadingInstance: (instanceLike) => {
    const { loadingInstanceMap, getInstances } = get()
    const idsToRemove = getInstances(instanceLike).map(({ id }) => id)
    const newMap = new Map<string, LoadingInstance>(loadingInstanceMap)
    idsToRemove.forEach((id) => newMap.delete(id))

    set({ loadingInstanceMap: newMap })
  },

  isInstanceLoading: (instanceLike) => {
    const { loadingInstanceMap, getInstances } = get()
    if (!instanceLike) {
      return Object.keys(loadingInstanceMap).length > 0
    }
    return getInstances(instanceLike).length > 0
  },

  getInstances: (instanceLike) => {
    const { loadingInstanceMap } = get()
    return Array.from(loadingInstanceMap.values()).filter((instance) =>
      Object.keys(instanceLike).every(
        // 如果传入的属性值为 undefined，则不进行比较
        (key) => key === undefined || instance[key as LoadingInstanceKey] === instanceLike[key as LoadingInstanceKey]
      )
    )
  },
})
