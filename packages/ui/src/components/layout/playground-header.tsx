'use client'

import { SidebarController } from '@mc/ui/components/side-bar'
import { WorkspaceSelector } from '@mc/ui/components/workspace'
import { Button } from '@mc/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@mc/ui/shadcn/dropdown-menu'
import { Moon, Mouse, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme('light')
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme('dark')
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme('system')
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const PlaygroundHeader = () => {
  return (
    <header className="flex h-14 items-center justify-between bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="my-8 flex items-center space-x-4">
        <Mouse className="text-neutral-950 dark:text-neutral-50" />
        <WorkspaceSelector />
      </div>
      <div className="flex items-center space-x-4">
        <SidebarController />
        <ModeToggle />
      </div>
    </header>
  )
}
