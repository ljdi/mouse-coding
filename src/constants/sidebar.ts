export const SidebarViewId = {
  FILES: 0,
  SEARCH: 1,
  GIT: 2,
  PACKAGES: 3,
} as const

export type SidebarViewIdType = (typeof SidebarViewId)[keyof typeof SidebarViewId]
