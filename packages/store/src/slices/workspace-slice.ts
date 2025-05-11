import { PackageManager } from '@mc/shared/lib/package-manager'
import { BaseFile, Directory, FileType } from '@mc/shared/types/fs'
import { createDirectory, exists, readDirectoryTree } from '@mc/shared/utils/fs'
import { getProjectPath } from '@mc/shared/utils/project'
import * as pathModule from '@zenfs/core/path.js'
import type { StateCreator } from 'zustand'

export interface WorkspaceSlice {
  projectPath?: string
  projectFileTree?: Directory
  packageManager?: PackageManager

  setupProject: (name: string) => void
  getProjectFileTree: () => Promise<void>
  createProject: (projectName: string) => Promise<void>
}

export const createWorkspaceSlice: StateCreator<WorkspaceSlice> = (
  set,
  get,
) => ({
  setupProject: (projectName?: string) => {
    if (projectName) {
      const projectPath = getProjectPath(projectName)
      set({
        projectPath,
        packageManager: new PackageManager(projectPath),
      })
    }
    else {
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

    const projectFileTree: BaseFile<FileType.DIRECTORY> = {
      name: pathModule.basename(projectPath),
      path: projectPath,
      type: FileType.DIRECTORY,
      metadata: {
        children,
      },
    }
    set({ projectFileTree })
  },
})
