import { ROOT } from '@/constants/fs'
import { readDirectory } from '@/utils/fs'

export const getProjectNameList = async () => {
  return (await readDirectory(ROOT)).filter((dir) => !dir.startsWith('.'))
}

export const getProjectPath = (projectName: string) => {
  return `${ROOT}/${projectName}`
}
