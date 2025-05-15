import { LayoutId, RESIZEABLE_PANEL_SIZE_KEY_PREFIX } from '@/constants/layout'

export const getDefaultSizeMap = () => {
  const defaultSizeMap: Record<string, number[]> = [
    LayoutId.PLAYGROUND,
    LayoutId.WORKSPACE,
  ].reduce((acc, cur) => {
    // 在 Vite 中获取 cookies 需要不同的方法
    // 这里我们先尝试从 localStorage 获取
    const layoutStr = localStorage.getItem(
      `${RESIZEABLE_PANEL_SIZE_KEY_PREFIX}${cur}`
    )
    let defaultLayout: number[] | undefined
    if (layoutStr) {
      defaultLayout = JSON.parse(layoutStr) as typeof defaultLayout
    }
    return { ...acc, [cur]: defaultLayout ?? [10, 90] }
  }, {})

  return defaultSizeMap
}

export const getKeyFromEnum = <V extends string | number>(
  enumType: Record<string, V>,
  value: V
): string | undefined => {
  return Object.keys(enumType).find((key) => enumType[key] === value)
}

export const isObject = (obj?: unknown) =>
  obj ? typeof obj === 'object' : false
export const { isArray } = Array
export const ensureArray = <T>(
  thing: readonly T[] | T | undefined | null
): readonly T[] => {
  if (isArray(thing)) return thing
  if (thing == null) return []
  return [thing] as readonly T[]
}
export const ensureObject = (
  o: Record<string, unknown> = {}
): Record<string, unknown> => (isObject(o) ? o : {})

export const hash = async (message: string) => {
  const data = new TextEncoder().encode(message)
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export const promisify =
  <T>(fn: (...args: unknown[]) => void) =>
    (...args: unknown[]) =>
      new Promise<T>((resolve, reject) => {
        fn(...args, (err: Error | null, result: T) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })

export interface FsCommand {
  action: 'create' | 'modify' | 'rename' | 'delete'
  type: 'file' | 'directory'
  // For non-rename actions, target is a string representing the relative path from the base directory.
  // For the rename action, target is an object with { from, to } properties.
  target: string | { from: string; to: string }
  // For create/modify file: content to write
  content?: string
}

export const getFileExtension = (id: string) => {
  const lastDotIndex = id.lastIndexOf('.')
  if (lastDotIndex >= 0) {
    return id.substring(lastDotIndex)
  }
  return ''
}

/**
 *
 */
export const storageUsage = async () => {
  const { usage, quota } = await navigator.storage.estimate()
  if (usage === undefined || quota === undefined) {
    throw new Error('Storage usage and quota are not available.')
  }
  return ((usage / quota) * 100).toFixed(2)
}
