'use client'

import { ChevronDown, Grid, List, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="relative w-full max-w-md">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="搜索仓库和项目..." className="pl-10 pr-10" />
        <div className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-xs">
          <kbd className="border-border bg-muted rounded border px-1.5">⌘</kbd>
          <kbd className="border-border bg-muted ml-1 rounded border px-1.5">
            K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          按活跃度排序
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>

        <div className="border-border flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none rounded-l-md"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none rounded-r-md"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          添加新项目...
        </Button>
      </div>
    </div>
  )
}
