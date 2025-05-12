export const RESIZEABLE_PANEL_SIZE_KEY_PREFIX = 'react-resizable-panels:'

export const LayoutId = {
  WORKSPACE: 0,
  PLAYGROUND: 1,
} as const

export type LayoutIdType = (typeof LayoutId)[keyof typeof LayoutId]
