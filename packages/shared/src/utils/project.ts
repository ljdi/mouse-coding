import { ROOT } from '@mc/shared/constants/fs'
import { readDirectory } from '@mc/shared/utils/fs'

export const getProjectNameList = async () => {
  return (await readDirectory(ROOT)).filter(dir => !dir.startsWith('.'))
}

export const getProjectPath = (projectName: string) => {
  return `${ROOT}/${projectName}`
}
