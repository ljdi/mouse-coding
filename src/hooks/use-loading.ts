import { useCallback, useState, useEffect } from 'react'

import { UnknownLoadingType } from '@/constants/action'
import { useStore } from '@/store'
import { type LoadingType } from '@/types/loading'

/**
 * 使用此钩子来精准跟踪异步操作的加载状态
 * @param asyncFunc 异步函数
 * @param type 加载操作的类型
 * @returns [wrappedFunc(...args):[Promise<result>, id],isLoading, checkLoading(id)]
 *
 * @description
 * 直接调用返回 包装后的异步函数和一个函数来检查类型加载状态
 * 调用包装后的异步函数时返回一个Promise和一个唯一的ID
 * 该ID可以用于检查特定类型的加载状态
 * 例如:
 * ```
 * const [wrappedFunc, isLoading, checkLoading] = useLoadingV2(asyncFunc, type)
 * const [promiseResult, id] = wrappedFunc(args)
 * const typeLoadingState = checkLoading()
 * await promiseResult
 *
 * // 或者如果不在乎Id并且需要获取返回值可以使用Promise.all
 * const [result] = await Promise.all(wrappedFunc(args))
 * ```
 * 注意: 因为包装的异步函数返回唯一Id, 所以需要自己管理Id的状态
 * 因为包装的函数返回为数组包裹的Promise和Id, 如果不想管理Id可以使用Promise.all包裹后使用 await 直接获取结果
 */
export const useLoading = <T extends unknown[], R>(
  asyncFunc: (...args: T) => Promise<R>,
  type: LoadingType = UnknownLoadingType.UNKNOWN
) => {
  const addLoadingInstance = useStore((state) => state.addLoadingInstance)
  const removeLoadingInstance = useStore((state) => state.removeLoadingInstance)
  const isInstanceLoading = useStore((state) => state.isInstanceLoading)
  const loadingInstanceMap = useStore((state) => state.loadingInstanceMap)
  const [isLoading, setIsLoading] = useState(false)

  const checkLoading = (id?: string) => isInstanceLoading({ id, type })

  useEffect(() => {
    if (loadingInstanceMap.size > 0) {
      setIsLoading(isInstanceLoading({ type }))
    } else {
      setIsLoading(false)
    }
  }, [loadingInstanceMap, isInstanceLoading, type])

  const wrappedFunction = useCallback(
    (...args: T): [Promise<R>, string] => {
      // 生成新ID并立即更新引用
      const id = crypto.randomUUID()

      // 创建Promise并立即添加到加载状态
      const promiseResult = asyncFunc(...args)
      addLoadingInstance({ id, type, promiseResult })

      return [promiseResult.then((result) => result).finally(async () => removeLoadingInstance({ id })), id]
    },
    [asyncFunc, type, addLoadingInstance, removeLoadingInstance]
  )

  return [wrappedFunction, isLoading, checkLoading] as const
}
