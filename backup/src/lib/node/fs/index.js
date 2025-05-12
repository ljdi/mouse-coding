import { fs } from '@zenfs/core'
export default fs
export const existsSync = fs.existsSync
export const readFileSync = fs.readFileSync
export const statSync = fs.statSync
export const realpathSync = fs.realpathSync
