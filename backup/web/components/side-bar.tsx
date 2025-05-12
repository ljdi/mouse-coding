'use client'

import { SidebarViewId } from '@mc/shared/constants/sidebar'
import { type SidebarView } from '@mc/shared/types/view'
import { useStore } from '@mc/store'
import { Button } from '@mc/ui/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@mc/ui/components/tabs'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@mc/ui/components/tooltip'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { type FC } from 'react'

interface ActivityBarProps {
  views: SidebarView[]
  onChange?: (id: SidebarViewId) => void
}

const ActivityBar: FC<ActivityBarProps> = ({ views, onChange }) => (
  <TabsList className="h-10 rounded-none bg-neutral-100 dark:bg-neutral-900">
    {views.map(view => (
      <TabsTrigger
        key={view.id}
        value={String(view.id)}
        onClick={() => onChange?.(view.id)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{view.icon}</TooltipTrigger>
            <TooltipContent>
              <p>{view.name}</p>
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

export const SideBar: FC<PanelSidebarProps> = ({ views }) => {
  // const [activeView, setActiveView] = useState<SidebarViewId>(
  //   SidebarViewId.FILES,
  // )

  return (
    <>
      <Tabs
        defaultValue={String(views.at(0)?.id ?? SidebarViewId.FILES)}
        className="h-full bg-neutral-100 dark:bg-neutral-900"
      >
        <ActivityBar views={views} />
        <ActivityContent views={views} />
      </Tabs>
    </>
  )
}

export const SidebarController = () => {
  const isPrimarySidebarCollapsed = useStore(
    state => state.isPrimarySideBarCollapsed,
  )
  const togglePrimarySidebar = useStore(state => state.togglePrimarySideBar)

  return (
    <Button variant="ghost" size="icon" onClick={togglePrimarySidebar}>
      {isPrimarySidebarCollapsed ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  )
}
