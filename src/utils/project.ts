import * as pathModule from '@zenfs/core/path'

import { ROOT } from '@/constants/env'
import { readDirectory } from '@/lib/file-system'

export const getProjectIds = async () => {
  return (await readDirectory(ROOT)).filter((dir) => !dir.startsWith('.'))
}

export const getProjectPath = (projectName: string) => {
  return pathModule.join(ROOT, projectName)
}
