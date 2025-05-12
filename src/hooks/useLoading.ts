import type { LoadingKey } from '@/constants/loading'
import { useStore } from '@/store'
import { generateUUID } from '@/utils/crypto'

export const useLoading = <T extends unknown[], R>(
  key: LoadingKey,
  asyncFunc: (...args: T) => Promise<R>
) => {
  const addInstance = useStore((state) => state.addInstance)
  const removeInstance = useStore((state) => state.removeInstance)
  return async (...args: T): Promise<R> => {
    const instanceId = generateUUID() // 为每次调用生成 UUID
    addInstance(key, instanceId)
    try {
      return await asyncFunc(...args)
    } finally {
      removeInstance(key, instanceId)
    }
  }
}
