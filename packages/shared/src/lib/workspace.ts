import { TMP_PATH, WORKSPACES_PATH } from '@mc/shared/constants/fs'
import { configure, InMemory } from '@zenfs/core'
import * as path from '@zenfs/core/path.js'
import * as fs from '@zenfs/core/promises'
import { IndexedDB } from '@zenfs/dom'

export const getWorkspacePath = async (workspaceName: string) => {
  if (!workspaceName) {
    throw Error('Workspace name is required')
  }
  const workspacePath = path.join(WORKSPACES_PATH, workspaceName)
  if (!(await fs.exists(workspacePath))) {
    throw Error(`Workspace "${workspaceName}" not found`)
  }
  return workspacePath
}

export const initializeWorkspaces = async () => {
  await configure({
    mounts: {
      [WORKSPACES_PATH]: IndexedDB,
      [TMP_PATH]: InMemory,
    },
  })

  if (!(await fs.exists(WORKSPACES_PATH))) {
    await fs.mkdir(WORKSPACES_PATH, { recursive: true })
  }
}

export const getWorkspaceNames = async () => {
  const workspaceNameList = await fs.readdir(WORKSPACES_PATH)
  return workspaceNameList
}

export const createWorkspace = async (workspaceName: string) => {
  const workspacePath = await getWorkspacePath(workspaceName)

  await fs.mkdir(workspacePath, { recursive: true })
}

export const deleteWorkspace = async (workspaceName: string) => {
  const workspacePath = await getWorkspacePath(workspaceName)

  await fs.rmdir(workspacePath)
}

export const renameWorkspace = async (
  workspaceName: string,
  newName: string,
) => {
  const workspacePath = await getWorkspacePath(workspaceName)
  const newPath = path.join(WORKSPACES_PATH, newName)
  if (await fs.exists(newPath)) {
    throw Error('A workspace with this name already exists.')
  }
  await fs.rename(workspacePath, newPath)
}
