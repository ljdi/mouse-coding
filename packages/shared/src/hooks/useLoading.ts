import { LoadingKey } from '@mc/shared/constants/loading'
import { generateId } from '@mc/shared/utils'
import { useStore } from '@mc/store'

export const useLoading = <T extends unknown[], R>(
  key: LoadingKey,
  asyncFunc: (...args: T) => Promise<R>,
) => {
  const addInstance = useStore(state => state.addInstance)
  const removeInstance = useStore(state => state.removeInstance)
  return async (...args: T): Promise<R> => {
    const instanceId = generateId() // 为每次调用生成唯一 ID
    addInstance(key, instanceId)
    try {
      return await asyncFunc(...args)
    }
    finally {
      removeInstance(key, instanceId)
    }
  }
}
