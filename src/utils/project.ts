import * as pathModule from '@zenfs/core/path'

import { HOME, } from '@/constants/env'
import { readDirectoryWithFileTypes } from '@/lib/file-system'

export const getProjectIds = async () => {
  const directories = await readDirectoryWithFileTypes(HOME)
  const projectNames = directories.filter((dir) => !dir.startsWith('.'))
  return projectNames
}

export const getProjectPath = (projectName: string) => {
  return pathModule.join(HOME, projectName)
}
