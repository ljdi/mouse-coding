import { resolveMountConfig, configure } from '@zenfs/core'
import type { StateCreator } from 'zustand'

import { homeStorageConfig, configuration } from '@/constants/zenfs'
import { createDirectory, createFile, removeFile, writeFile } from '@/lib/file-system'

export interface FsSlice {
  isConfigured: boolean
  configureFs: () => Promise<void>
  createFile: typeof createFile
  createDirectory: typeof createDirectory
  removeFile: typeof removeFile
  writeFile: typeof writeFile
}

export const createFsSlice: StateCreator<FsSlice> = (set) => ({
  isConfigured: false,
  configureFs: async () => {
    await configure(configuration)

    set({ isConfigured: true })
  },
  resolveMountConfig: async () => {
    console.log('Configuration:', homeStorageConfig)

    const storeFs = await resolveMountConfig(homeStorageConfig)
    console.log('storeFs', storeFs)

    return storeFs
  },
  createFile,
  createDirectory,
  removeFile,
  writeFile,
})
