export enum CustomErrorCode {
  UNKNOWN = 1000,
  WORKSPACE_NAME_ALREADY_EXISTS,
  WORKSPACE_NOT_FOUND,
  WORKSPACE_NOT_INITIALIZED,
}

// 定义错误码到错误消息的映射
export const ErrorMessages: Record<CustomErrorCode, string> = {
  [CustomErrorCode.UNKNOWN]: 'Unknown error occurred.',
  [CustomErrorCode.WORKSPACE_NAME_ALREADY_EXISTS]: 'Workspace name already exists.',
  [CustomErrorCode.WORKSPACE_NOT_FOUND]: 'Workspace not found.',
  [CustomErrorCode.WORKSPACE_NOT_INITIALIZED]: 'Workspace not initialized.',
}
