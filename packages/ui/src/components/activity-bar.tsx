'use client'

import { cn } from '@mc/ui/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mc/ui/shadcn/tooltip'
import {
  ExpandIcon as Extension,
  Files,
  GitBranch,
  Search,
  Settings,
} from 'lucide-react'

interface ActivityBarProps {
  activeView: string
  onViewChange: (view: string) => void
}

interface ActivityItem {
  id: string
  icon: React.ElementType
  label: string
}

export function ActivityBar({ activeView, onViewChange }: ActivityBarProps) {
  const activityItems: ActivityItem[] = [
    { id: 'explorer', icon: Files, label: '文件浏览器' },
    { id: 'search', icon: Search, label: '搜索' },
    { id: 'git', icon: GitBranch, label: 'Git' },
    { id: 'extensions', icon: Extension, label: '扩展' },
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-muted/20 flex h-full w-12 flex-col items-center border-r py-2">
        {activityItems.map(item => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center',
                  activeView === item.id
                  && 'after:bg-primary after:absolute after:left-0 after:top-0 after:h-full after:w-0.5',
                )}
                onClick={() => {
                  onViewChange(item.id)
                }}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    activeView === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground',
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}

        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center',
                  activeView === 'settings'
                  && 'after:bg-primary after:absolute after:left-0 after:top-0 after:h-full after:w-0.5',
                )}
                onClick={() => {
                  onViewChange('settings')
                }}
              >
                <Settings
                  className={cn(
                    'h-5 w-5',
                    activeView === 'settings'
                      ? 'text-primary'
                      : 'text-muted-foreground',
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">设置</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
