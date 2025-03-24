import { FileType } from '@mc/shared/constants/fs'

export interface File {
  name: string
  path: string
  type: FileType
  children?: File[]
  content?: unknown
}
