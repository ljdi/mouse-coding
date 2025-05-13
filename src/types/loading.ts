import type { FileSystemAction, PackageAction, ProjectAction, RequestLoadingType, UnknownLoadingType } from '@/constants/action'

export type FileSystemLoadingTypeKey = keyof typeof FileSystemAction

export type ProjectLoadingTypeKey = keyof typeof ProjectAction

export type PackageLoadingTypeKey = keyof typeof PackageAction

export type RequestLoadingTypeKey = keyof typeof RequestLoadingType

export type UnknownLoadingTypeKey = keyof typeof UnknownLoadingType

export type LoadingType =
  | FileSystemLoadingTypeKey
  | ProjectLoadingTypeKey
  | PackageLoadingTypeKey
  | RequestLoadingTypeKey
  | UnknownLoadingTypeKey

export interface BaseLoadingInstance {
  id: string
  type: LoadingType
  promiseResult: Promise<unknown>
  data?: Record<string, unknown>
}

export interface FileSystemLoadingInstance extends BaseLoadingInstance {
  type: FileSystemLoadingTypeKey
}

export interface ProjectLoadingInstance extends BaseLoadingInstance {
  type: ProjectLoadingTypeKey
}

export interface RequestLoadingInstance extends BaseLoadingInstance {
  type: RequestLoadingTypeKey
  data?: { url: string; signal?: AbortSignal }
}

export interface PackageLoadingInstance extends BaseLoadingInstance {
  type: PackageLoadingTypeKey
  data?: { name?: string }
}

export interface UnknownLoadingInstance extends BaseLoadingInstance {
  type: UnknownLoadingTypeKey
}

export type LoadingInstance =
  | FileSystemLoadingInstance
  | PackageLoadingInstance
  | ProjectLoadingInstance
  | RequestLoadingInstance
  | PackageLoadingInstance
  | UnknownLoadingInstance

export type LoadingInstanceKey = keyof LoadingInstance

// 基于ID的实例存储
export type LoadingInstanceMap = Map<string, LoadingInstance>
