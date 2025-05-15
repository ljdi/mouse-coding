import * as pathModule from '@zenfs/core/path'
import * as fileSystemModule from '@zenfs/core/promises'

import { FileStructureType, type FileStructure, type Directory } from '@/types/fs'

const DEFAULT_ENCODING = 'utf-8'

export const readDirectoryTree = async <T extends FileStructure = Directory>(path: string): Promise<T[]> => {
  // 组装成绝对路径
  if (!(await exists(path))) {
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
      ? FileStructureType.DIRECTORY
      : dirent.isFile()
        ? FileStructureType.FILE
        : dirent.isSymbolicLink()
          ? FileStructureType.LINK
          : FileStructureType.UNKNOWN
    let children: FileStructure[] = []

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

export const readDirectoryWithFileTypes = async (path: string) => {
  const direntList = await fileSystemModule.readdir(path, {
    encoding: 'utf8',
    withFileTypes: true /* , recursive: true */,
  })
  const directories = direntList.filter((dirent) => dirent.isDirectory())
  console.log(directories)

  return directories.map((dirent) => dirent.path)
}

export const exists = async (path: string) => {
  return await fileSystemModule.exists(path)
}

export const createDirectory = async (path: string) => {
  if (await exists(path)) {
    throw new Error('Directory already exists')
  }

  await fileSystemModule.mkdir(path, { recursive: true })
}

export const createFile = async (path: string) => {
  if (await exists(path)) {
    throw new Error('File already exists')
  }

  await writeFile(path, '')
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
  const directoryPath = pathModule.dirname(path)
  if (!(await exists(directoryPath))) {
    throw Error(`${directoryPath} does not exist`)
  }
  await fileSystemModule.writeFile(path, content, {
    encoding: DEFAULT_ENCODING,
  })
}
