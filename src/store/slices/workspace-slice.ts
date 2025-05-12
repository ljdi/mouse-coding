import * as pathModule from '@zenfs/core/path'
import type { StateCreator } from 'zustand'

import { PackageManager } from '@/lib/package-manager'
import { type FileStructure, type Directory, FileStructureType } from '@/types/fs'
import { createDirectory, exists, readDirectoryTree } from '@/utils/fs'
import { getProjectPath } from '@/utils/project'

export interface WorkspaceSlice {
  projectPath?: string
  projectFileTree?: Directory
  packageManager?: PackageManager

  setupProject: (name: string) => void
  getProjectFileTree: () => Promise<void>
  createProject: (projectName: string) => Promise<void>
}

export const createWorkspaceSlice: StateCreator<WorkspaceSlice> = (set, get) => ({
  setupProject: (projectName?: string) => {
    if (projectName) {
      const projectPath = getProjectPath(projectName)
      set({
        projectPath,
        packageManager: new PackageManager(projectPath),
      })
    } else {
      set({
        projectPath: undefined,
        packageManager: undefined,
      })
    }
  },

  createProject: async (projectPath: string) => {
    if (await exists(projectPath)) {
      throw new Error('Project already exists')
    }

    await createDirectory(projectPath)

    await new PackageManager(projectPath).init()
  },

  getProjectFileTree: async () => {
    const { projectPath } = get()
    if (!projectPath) return

    const children = await readDirectoryTree(projectPath)

    const projectFileTree: FileStructure<typeof FileStructureType.DIRECTORY> = {
      name: pathModule.basename(projectPath),
      path: projectPath,
      type: FileStructureType.DIRECTORY,
      metadata: {
        children,
      },
    }
    set({ projectFileTree })
  },
})
