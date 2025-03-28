import { TMP_PATH, WORKSPACES_PATH } from '@mc/shared/constants/fs'
import { PackageManager } from '@mc/shared/lib/package-manager'
import { configure, InMemory } from '@zenfs/core'
import * as pathModule from '@zenfs/core/path.js'
import * as fileSystemModule from '@zenfs/core/promises'
import { IndexedDB } from '@zenfs/dom'

export const getWorkspacePath = async (workspaceName: string) => {
  if (!workspaceName) {
    throw Error('Workspace name is required')
  }
  const workspacePath = pathModule.join(WORKSPACES_PATH, workspaceName)
  if (!(await fileSystemModule.exists(workspacePath))) {
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

  if (!(await fileSystemModule.exists(WORKSPACES_PATH))) {
    await fileSystemModule.mkdir(WORKSPACES_PATH, { recursive: true })
  }
}

export const getWorkspaceNames = async () => {
  const workspaceNameList = await fileSystemModule.readdir(WORKSPACES_PATH)
  return workspaceNameList
}

export const createWorkspace = async (workspaceName: string) => {
  const workspacePath = pathModule.join(WORKSPACES_PATH, workspaceName)
  await fileSystemModule.mkdir(workspacePath, { recursive: true })
}

export const deleteWorkspace = async (workspaceName: string) => {
  const workspacePath = await getWorkspacePath(workspaceName)

  await fileSystemModule.rmdir(workspacePath)
}

export const renameWorkspace = async (
  workspaceName: string,
  newName: string,
) => {
  const workspacePath = await getWorkspacePath(workspaceName)
  const newPath = pathModule.join(WORKSPACES_PATH, newName)
  if (await fileSystemModule.exists(newPath)) {
    throw Error('A workspace with this name already exists.')
  }
  await fileSystemModule.rename(workspacePath, newPath)
}

export class Workspace {
  public static root = WORKSPACES_PATH
  public static isMounted = false

  private packageManager: PackageManager

  constructor(public name: string) {
    this.packageManager = new PackageManager(this.cwd)
  }

  get cwd() {
    return pathModule.join(Workspace.root, this.name)
  }

  public static async mount() {
    await configure({
      mounts: {
        [Workspace.root]: IndexedDB,
        [TMP_PATH]: InMemory,
      },
    })

    if (!(await fileSystemModule.exists(Workspace.root))) {
      await fileSystemModule.mkdir(Workspace.root, { recursive: true })
    }
    Workspace.isMounted = true
  }

  public static checkWorkspaceRootMounted() {
    if (!Workspace.isMounted) {
      throw Error('Workspaces not mounted')
    }
  }

  public static async checkWorkspaceExists(
    workspaceNameOrPath: string,
    throwError = false,
  ) {
    const path = pathModule.isAbsolute(workspaceNameOrPath)
      ? workspaceNameOrPath
      : pathModule.join(Workspace.root, workspaceNameOrPath)
    const exists = await fileSystemModule.exists(path)
    if (!exists && throwError) {
      throw Error(`Workspace "${workspaceNameOrPath}" not found`)
    }
    return exists
  }

  static async getWorkspaceNames() {
    return (
      await fileSystemModule.readdir(Workspace.root, { withFileTypes: true })
    )
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }

  public async create() {
    const workspacePath = this.cwd
    await fileSystemModule.mkdir(workspacePath, { recursive: true })
  }

  public async init() {
    Workspace.checkWorkspaceRootMounted()
    await Workspace.checkWorkspaceExists(this.name, true)

    await this.packageManager.init()
  }

  public async getPathEntries(path: string) {
    const workspacePath = pathModule.join(Workspace.root, this.name)
    await Workspace.checkWorkspaceExists(workspacePath, true)

    const readDirectoryResult = await fileSystemModule.readdir(workspacePath, {
      withFileTypes: true,
    })
    // TODO: 现在是返回 react-complex-tree 的 ExplicitDataSource<string>['items'] 类型结构, 可以修改成更通用的结构
    return readDirectoryResult.reduce((res, cur) => {
      const curPath = pathModule.join(path, cur.name)
      const isFolder = cur.isDirectory()
      return {
        ...res,
        [curPath]: {
          index: curPath,
          isFolder,
          children: isFolder ? [] : undefined,
          data: cur.name,
        },
      }
    }, {})
  }
}
