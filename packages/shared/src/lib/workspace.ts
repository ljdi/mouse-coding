import { TMP_PATH, WORKSPACES_PATH } from '@mc/shared/constants/fs'
import { PackageManager } from '@mc/shared/lib/package-manager'
import { DataSourceItems } from '@mc/shared/types/file-tree'
import { configure, InMemory } from '@zenfs/core'
import * as pathModule from '@zenfs/core/path.js'
import * as fileSystemModule from '@zenfs/core/promises'
import { IndexedDB } from '@zenfs/dom'
import { TreeItemIndex } from 'react-complex-tree'

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
  static root = WORKSPACES_PATH
  static isMounted = false

  private packageManager: PackageManager

  static async mount() {
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

  static checkFileSystemMounted() {
    if (!Workspace.isMounted) {
      throw Error('File System not mounted')
    }
  }

  static async checkWorkspaceExists(name: string, throwError = false) {
    const path = pathModule.resolve(Workspace.root, name)
    const exists = await fileSystemModule.exists(path)

    if (!exists && throwError) {
      throw Error(`Workspace "${name}" not found`)
    }
    return exists
  }

  static async listWorkspace() {
    Workspace.checkFileSystemMounted()
    return (
      await fileSystemModule.readdir(Workspace.root, { withFileTypes: true })
    )
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }

  /**
   * 根据工作空间相对路径返回 react-complex-tree 数据源
   * @param path 工作空间相对路径
   * @returns react-complex-tree 数据源
   */
  static async getFileTreeDataSourceItems(path: string) {
    // 组装成绝对路径
    const exists = await fileSystemModule.exists(path)
    if (!exists) {
      throw Error(`${path} does not exist`)
    }

    const directoryResult = await fileSystemModule.readdir(path, {
      withFileTypes: true,
    })
    // TODO: 现在是返回 react-complex-tree 的 ExplicitDataSource<string>['items'] 类型结构, 可以修改成更通用的结构
    const result: DataSourceItems = {}
    for (const dirent of directoryResult) {
      const curPath = pathModule.join(path, dirent.name)
      const isFolder = dirent.isDirectory()
      let children: (TreeItemIndex)[] | undefined = undefined
      // 递归获取子目录
      if (isFolder) {
        children = await Workspace.getFileTreeDataSourceItems(curPath).then(
          res => Object.keys(res),
        )
      }
      result[curPath] = {
        index: curPath,
        isFolder,
        children,
        data: dirent.name,
      }
    }
    return result
  }

  constructor(public name: string) {
    this.packageManager = new PackageManager(this.cwd)
  }

  get cwd() {
    return pathModule.join(Workspace.root, this.name)
  }

  async create() {
    const workspacePath = this.cwd
    await fileSystemModule.mkdir(workspacePath, { recursive: true })
  }

  async init() {
    Workspace.checkFileSystemMounted()
    await Workspace.checkWorkspaceExists(this.name, true)

    await this.packageManager.init()
  }
}
