import { Directory, FileType, type BaseFile } from '@mc/shared/types/fs'
import * as pathModule from '@zenfs/core/path.js'
import * as fileSystemModule from '@zenfs/core/promises'

const DEFAULT_ENCODING = 'utf-8'

export const readDirectoryTree = async <T extends BaseFile = Directory>(
  path: string,
): Promise<T[]> => {
  // 组装成绝对路径
  const exists = await fileSystemModule.exists(path)
  if (!exists) {
    throw Error(`${path} does not exist`)
  }

  // 如果没有传入路径，则默认使用工作空间根目录
  let fileList: T[] = []
  const direntList = await fileSystemModule.readdir(path, {
    withFileTypes: true,
  })

  for (const dirent of direntList) {
    const filePath = pathModule.join(path, dirent.name)
    const isDirectory = dirent.isDirectory()
    const type = isDirectory
      ? FileType.DIRECTORY
      : dirent.isFile()
        ? FileType.FILE
        : dirent.isSymbolicLink()
          ? FileType.LINK
          : FileType.UNKNOWN
    let children: BaseFile[] = []

    // 递归获取子目录
    if (isDirectory) {
      children = await readDirectoryTree(filePath)
    }
    const file = {
      name: dirent.name,
      path: filePath,
      type,
      metadata: isDirectory ? { children } : undefined,
    } as T
    fileList = [...fileList, file]
  }
  return fileList
}

export const readDirectory = async (path: string) => {
  return (await fileSystemModule.readdir(path, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

export const exists = async (path: string) => {
  return await fileSystemModule.exists(path)
}

export const createDirectory = async (path: string) => {
  await fileSystemModule.mkdir(path, { recursive: true })
}

export const createFile = async (path: string, content = '') => {
  const dirPath = pathModule.dirname(path)
  await createDirectory(dirPath)
  await fileSystemModule.writeFile(path, content, {
    encoding: DEFAULT_ENCODING,
  })
}
export const removeFile = async (path: string) => {
  if (!(await exists(path))) {
    throw Error(`${path} does not exist`)
  }
  await fileSystemModule.rm(path, { recursive: true, force: true })
}
export const moveFile = async (oldPath: string, newPath: string) => {
  if (!(await exists(oldPath))) {
    throw Error(`${oldPath} does not exist`)
  }
  if (await exists(newPath)) {
    throw Error(`${newPath} already exists`)
  }
  await fileSystemModule.rename(oldPath, newPath)
}
export const copyFile = async (oldPath: string, newPath: string) => {
  if (!(await exists(oldPath))) {
    throw Error(`${oldPath} does not exist`)
  }
  if (await exists(newPath)) {
    throw Error(`${newPath} already exists`)
  }
  await fileSystemModule.copyFile(oldPath, newPath)
}
export const readFile = async (path: string) => {
  if (!(await exists(path))) {
    throw Error(`${path} does not exist`)
  }
  const content = await fileSystemModule.readFile(path, {
    encoding: DEFAULT_ENCODING,
  })
  return content
}
export const writeFile = async (path: string, content: string) => {
  await fileSystemModule.writeFile(path, content, {
    encoding: DEFAULT_ENCODING,
  })
  return path
}
