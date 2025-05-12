export const FileStructureType = {
  UNKNOWN: 0,
  FILE: 1,
  DIRECTORY: 2,
  LINK: 3,
} as const

export type FileType = (typeof FileStructureType)[keyof typeof FileStructureType]

interface DirectoryFileMetadata {
  // eslint-disable-next-line no-use-before-define
  children: FileStructure[]
}
interface FileMetadata {
  mimeType: string
}
interface LinkFileMetadata {
  target: string
}
type UnknownFileMetadata = Record<string, unknown>

export interface FileStructure<T extends FileType = FileType> {
  name: string
  path: string
  type: T
  metadata?: T extends typeof FileStructureType.FILE
    ? FileMetadata
    : T extends typeof FileStructureType.DIRECTORY
      ? DirectoryFileMetadata
      : T extends typeof FileStructureType.LINK
        ? LinkFileMetadata
        : UnknownFileMetadata
}

export type Directory = FileStructure<typeof FileStructureType.DIRECTORY>
export type File = FileStructure<typeof FileStructureType.FILE>
export type Link = FileStructure<typeof FileStructureType.LINK>
export type UnknownFile = FileStructure<typeof FileStructureType.UNKNOWN>
