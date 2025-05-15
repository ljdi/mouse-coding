import type { Configuration, MountConfiguration } from '@zenfs/core'
import { IndexedDB } from '@zenfs/dom'

import { HOME } from '@/constants/env'

export const homeStorageConfig: MountConfiguration<IndexedDB> = {
  backend: IndexedDB,
  storeName: 'mouse-coding',
  disableAsyncCache: true,
}
export const configuration: Partial<Configuration<{ [HOME]: IndexedDB }>> = {
  mounts: {
    [HOME]: homeStorageConfig
  },
  log: { enabled: true, level: 'error' },
}
