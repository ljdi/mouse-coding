export enum FileType {
  FILE = 'FILE',
  DIRECTORY = 'DIRECTORY',
  LINK = 'LINK',
  UNKNOWN = 'UNKNOWN',
}

interface DirectoryFileMetadata {
  children: BaseFile[]
}
interface FileMetadata {
  mimeType: string
}
interface LinkFileMetadata {
  target: string
}
type UnknownFileMetadata = Record<string, unknown>

export interface BaseFile<T extends FileType = FileType> {
  name: string
  path: string
  type: T
  metadata?: T extends FileType.FILE
    ? FileMetadata
    : T extends FileType.DIRECTORY
      ? DirectoryFileMetadata
      : T extends FileType.LINK
        ? LinkFileMetadata
        : UnknownFileMetadata
}

export type Directory = BaseFile<FileType.DIRECTORY>
export type File = BaseFile<FileType.FILE>
export type Link = BaseFile<FileType.LINK>
export type UnknownFile = BaseFile<FileType.UNKNOWN>
