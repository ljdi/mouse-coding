export enum FileType {
  FILE = 'file',
  DIRECTORY = 'directory',
  LINK = 'link',
}

export const ROOT_PATH = '/'
export const HOME_PATH = '/root'
export const TMP_PATH = '/tmp'
export const CONFIG_PATH = `${HOME_PATH}/.config`
export const PM_CONFIG_PATH = `${CONFIG_PATH}/pm`
export const PM_CONFIG_FILE_PATH = `${PM_CONFIG_PATH}/config.json`
export const STORE_PATH = `${HOME_PATH}/.store`
export const STORE_CACHE_PATH = `${STORE_PATH}/cache`
export const DEFAULT_REGISTRY_URL = 'https://registry.npmmirror.com'

export const DOT_PACKAGE_LOCK_NAME = '.package-lock.json'
export const REGISTRY_FILE_NAME = 'registry.json'
export const MODULES_DIR_NAME = 'node_modules'
export const PACKAGE_JSON_FILE_NAME = 'package.json'
export const CAS_NAME = '.mcpm'
export const CAS_MODULES_SYMLINKS_PROPERTY_NAME = 'symlinks'
