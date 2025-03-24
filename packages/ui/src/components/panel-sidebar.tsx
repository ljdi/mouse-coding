'use client'

import { SiGit } from '@icons-pack/react-simple-icons'
import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { type SidebarView } from '@mc/shared/types/sidebar'
import { SidebarViewFiles } from '@mc/ui/components/sidebar-view-files'
import { SidebarViewGit } from '@mc/ui/components/sidebar-view-git'
import { SidebarViewPackages } from '@mc/ui/components/sidebar-view-packages'
import { SidebarViewSearch } from '@mc/ui/components/sidebar-view-search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@mc/ui/shadcn/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mc/ui/shadcn/tooltip'
import { Files, Package, Search } from 'lucide-react'
import { type FC, useState } from 'react'

interface ActivityBarProps {
  views: SidebarView[]
  onChange?: (id: SidebarViewId) => void
}

const ActivityBar: FC<ActivityBarProps> = ({ views: items, onChange }) => (
  <TabsList className="bg-transparent">
    {items.map(item => (
      <TabsTrigger
        key={item.id}
        value={String(item.id)}
        onClick={() => onChange?.(item.id)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{item.icon}</TooltipTrigger>
            <TooltipContent>
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsTrigger>
    ))}
  </TabsList>
)

interface SidebarViewsProps {
  views: SidebarView[]
}

export const ViewContent: FC<SidebarViewsProps> = ({ views }) => {
  return (
    <>
      {views.map(view => (
        <TabsContent key={view.id} value={String(view.id)}>
          <div className="h-full overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-2">
              <h2 className="text-sm font-semibold">{view.label}</h2>
            </div>
            <div className="p-2">{view.component}</div>
          </div>
        </TabsContent>
      ))}
    </>
  )
}

// interface PanelSidebarProps {}

export const PanelSidebar /* : FC<PanelSidebarProps> */ = () => {
  const [viewItems] = useState<SidebarView[]>([
    {
      id: SidebarViewId.FILES,
      icon: <Files />,
      label: 'Files',
      component: <SidebarViewFiles />,
    },
    {
      id: SidebarViewId.SEARCH,
      icon: <Search />,
      label: 'Search',
      component: <SidebarViewSearch />,
    },
    {
      id: SidebarViewId.GIT,
      icon: <SiGit />,
      label: 'Git',
      component: <SidebarViewGit />,
    },
    {
      id: SidebarViewId.PACKAGES,
      icon: <Package />,
      label: 'Packages',
      component: <SidebarViewPackages />,
    },
  ])
  // const [activeView, setActiveView] = useState<SidebarViewId>(
  //   SidebarViewId.FILES,
  // )

  return (
    <>
      <Tabs
        defaultValue={String(viewItems.at(0)?.id ?? SidebarViewId.FILES)}
        className="h-full"
      >
        <ActivityBar views={viewItems} />
        <ViewContent views={viewItems} />
      </Tabs>
    </>
  )
}

/* const useMinSize = (minSizeInPixels: number) => {
  const [minSize, setMinSize] = useState(10);

  useLayoutEffect(() => {
    const resizablePanelGroup = document.querySelector<HTMLDivElement>(
      '[data-panel-group-id="playground-layout"]',
    );
    const resizableHandles = document.querySelectorAll<HTMLDivElement>(
      "[data-panel-resize-handle-id]",
    );
    if (!resizablePanelGroup) return;
    const observer = new ResizeObserver(() => {
      let width = resizablePanelGroup.offsetWidth || 0;

      resizableHandles.forEach((resizeHandle) => {
        width -= resizeHandle.offsetWidth;
      });

      // Minimum size in pixels is a percentage of the PanelGroup's height,
      // less the (fixed) height of the resize handles.
      setMinSize((minSizeInPixels / width) * 100);
    });
    observer.observe(resizablePanelGroup);
    resizableHandles.forEach((resizeHandle) => {
      observer.observe(resizeHandle);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return minSize;
}; */
