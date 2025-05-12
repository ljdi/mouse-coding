export const CustomErrorCode = {
  UNKNOWN: 1000,
  WORKSPACE_NAME_ALREADY_EXISTS: 1001,
  WORKSPACE_NOT_FOUND: 1002,
  WORKSPACE_NOT_INITIALIZED: 1003,
} as const
export type CustomErrorCodeType = (typeof CustomErrorCode)[keyof typeof CustomErrorCode]

// 定义错误码到错误消息的映射
export const ErrorMessages: Record<CustomErrorCodeType, string> = {
  [CustomErrorCode.UNKNOWN]: 'Unknown error occurred.',
  [CustomErrorCode.WORKSPACE_NAME_ALREADY_EXISTS]: 'Workspace name already exists.',
  [CustomErrorCode.WORKSPACE_NOT_FOUND]: 'Workspace not found.',
  [CustomErrorCode.WORKSPACE_NOT_INITIALIZED]: 'Workspace not initialized.',
}
