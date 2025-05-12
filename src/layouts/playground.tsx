import { SiGit } from '@icons-pack/react-simple-icons'

import { Outlet } from '@tanstack/react-router'

import { Files, Package, Search } from 'lucide-react'

import { type FC, type ReactNode, useState } from 'react'

import { PanelGroup } from '@/components/panel-group'
import { SideBar } from '@/components/side-bar'
import { SidebarViewExplorer } from '@/components/sidebar-view-explorer'
import { SidebarViewGit } from '@/components/sidebar-view-git'
import { SidebarViewPackages } from '@/components/sidebar-view-packages'
import { SidebarViewSearch } from '@/components/sidebar-view-search'
import { LayoutId } from '@/constants/layout'
import { SidebarViewId } from '@/constants/sidebar'
import { useStore } from '@/store'
import { type SidebarView } from '@/types/view'

interface PlaygroundLayoutProps {
  secondarySideBar?: ReactNode
}
export const PlaygroundLayout: FC<PlaygroundLayoutProps> = ({ secondarySideBar = null }) => {
  const defaultSizeMap = useStore((state) => state.defaultSizeMap)

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
      views={[<SideBar key='primary-sidebar' views={primarySidebarViews} />, <Outlet key='outlet' />, secondarySideBar]}
      defaultSize={defaultSizeMap[LayoutId.PLAYGROUND]}
    />
  )
}
