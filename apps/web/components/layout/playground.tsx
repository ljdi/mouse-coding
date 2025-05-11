'use client'

import { PanelGroup } from '@/components/panel-group'
import { SideBar } from '@/components/side-bar'
import { SidebarViewExplorer } from '@/components/sidebar-view-explorer'
import { SidebarViewGit } from '@/components/sidebar-view-git'
import { SidebarViewPackages } from '@/components/sidebar-view-packages'
import { SidebarViewSearch } from '@/components/sidebar-view-search'
import { SiGit } from '@icons-pack/react-simple-icons'
import {
  LayoutId,
  RESIZEABLE_PANEL_SIZE_KEY_PREFIX,
} from '@mc/shared/constants/layout'
import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { type SidebarView } from '@mc/shared/types/view'
import { useStore } from '@mc/store'
import { Files, Package, Search } from 'lucide-react'
import { FC, ReactNode, useState } from 'react'

interface PlaygroundLayoutProps {
  children: ReactNode
  defaultSize?: number[]
  secondarySideBar?: ReactNode
  search?: ReactNode
  cookieStore?: Map<string, { name: string, value: string }>
}
export const PlaygroundLayout: FC<PlaygroundLayoutProps> = ({
  children,
  secondarySideBar = null,
}) => {
  const defaultSizeMap = useStore(state => state.defaultSizeMap)
  const onLayout = (sizes: number[]) => {
    document.cookie = `${RESIZEABLE_PANEL_SIZE_KEY_PREFIX}${LayoutId.PLAYGROUND}=${JSON.stringify(sizes)}`
  }

  const [primarySidebarViews] = useState<SidebarView[]>([
    {
      id: SidebarViewId.FILES,
      icon: <Files />,
      name: 'Files',
      component: <SidebarViewExplorer />,
    },
    {
      id: SidebarViewId.SEARCH,
      icon: <Search />,
      name: 'Search',
      component: <SidebarViewSearch />,
    },
    {
      id: SidebarViewId.GIT,
      icon: <SiGit />,
      name: 'Git',
      component: <SidebarViewGit />,
    },
    {
      id: SidebarViewId.PACKAGES,
      icon: <Package />,
      name: 'Packages',
      component: <SidebarViewPackages />,
    },
  ])

  return (
    <PanelGroup
      views={[<SideBar key="primary-sidebar" views={primarySidebarViews} />, children, secondarySideBar]}
      defaultSize={defaultSizeMap[LayoutId.PLAYGROUND]}
      onLayout={onLayout}
    />
  )
}
