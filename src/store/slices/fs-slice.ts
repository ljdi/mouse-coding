import { configure } from '@zenfs/core'
import { IndexedDB } from '@zenfs/dom'
import type { StateCreator } from 'zustand'

import { createDirectory, createFile, removeFile, writeFile } from '@/lib/file-system'

export interface FsSlice {
  isFsInitialized: boolean
  initializeFs: () => Promise<void>
  createFile: typeof createFile
  createDirectory: typeof createDirectory
  removeFile: typeof removeFile
  writeFile: typeof writeFile
}

export const createFsSlice: StateCreator<FsSlice> = (set) => ({
  isFsInitialized: false,
  initializeFs: async () => {
    const configuration = {
      backend: IndexedDB,
      storeName: 'mouse-coding',
      disableAsyncCache: true,
    }
    console.log('Configuration:', configuration)
    await configure({
      mounts: {
        '/': configuration,
      },
      log: { enabled: true, level: 'debug' },
    })

    // const idbfs = await resolveMountConfig(configuration)
    // // idbfs.mount
    // console.log(idbfs)

    set({ isFsInitialized: true })
  },
  createFile,
  createDirectory,
  removeFile,
  writeFile,
})
