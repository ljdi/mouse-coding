export const LoadingKey = {
  FS_INITIALIZING: 0,
  PACKAGE_INSTALLING: 1,
  PACKAGE_UNINSTALLING: 2,
  PACKAGE_UPDATING: 3,
  PROJECT_CREATING: 4,
  PROJECT_DELETING: 5,
  PROJECT_RENAMING: 6,
} as const

export type LoadingKeyType = (typeof LoadingKey)[keyof typeof LoadingKey]
