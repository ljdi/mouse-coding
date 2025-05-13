export const RESIZEABLE_PANEL_SIZE_KEY_PREFIX = 'react-resizable-panels:'

export const LayoutId = {
  WORKSPACE: 'WORKSPACE',
  PLAYGROUND: 'PLAYGROUND',
} as const

export type LayoutIdType = (typeof LayoutId)[keyof typeof LayoutId]
