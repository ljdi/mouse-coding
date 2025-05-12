export const EditorMode = {
  CODE: 0,
  NOCODE: 1,
} as const
export type EditorModeType = (typeof EditorMode)[keyof typeof EditorMode]
