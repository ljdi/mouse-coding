'use client'

import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { type SidebarView } from '@mc/shared/types/view'
import { useStore } from '@mc/store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@mc/ui/shadcn/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mc/ui/shadcn/tooltip'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { type FC } from 'react'

interface ActivityBarProps {
  views: SidebarView[]
  onChange?: (id: SidebarViewId) => void
}

const ActivityBar: FC<ActivityBarProps> = ({ views, onChange }) => (
  <TabsList className="bg-transparent">
    {views.map(item => (
      <TabsTrigger
        key={item.id}
        value={String(item.id)}
        onClick={() => onChange?.(item.id)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{item.icon}</TooltipTrigger>
            <TooltipContent>
              <p>{item.name}</p>
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

export const ActivityContent: FC<SidebarViewsProps> = ({ views }) => {
  return (
    <>
      {views.map(view => (
        <TabsContent key={view.id} value={String(view.id)}>
          <div className="h-full overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-2">
              <h2 className="text-sm font-semibold">{view.name}</h2>
            </div>
            <div className="p-2">{view.component}</div>
          </div>
        </TabsContent>
      ))}
    </>
  )
}

interface PanelSidebarProps {
  views: SidebarView[]
}

export const PanelSidebar: FC<PanelSidebarProps> = ({ views }) => {
  // const [activeView, setActiveView] = useState<SidebarViewId>(
  //   SidebarViewId.FILES,
  // )

  return (
    <>
      <Tabs
        defaultValue={String(views.at(0)?.id ?? SidebarViewId.FILES)}
        className="h-full"
      >
        <ActivityBar views={views} />
        <ActivityContent views={views} />
      </Tabs>
    </>
  )
}

export const SidebarController = () => {
  const isPrimarySidebarCollapsed = useStore(
    state => state.isPrimarySidebarCollapsed,
  )
  const togglePrimarySidebar = useStore(state => state.togglePrimarySidebar)

  return isPrimarySidebarCollapsed
    ? (
        <PanelLeftClose onClick={togglePrimarySidebar} />
      )
    : (
        <PanelLeftOpen onClick={togglePrimarySidebar} />
      )
}
