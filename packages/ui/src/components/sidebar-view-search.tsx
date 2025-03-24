'use client'

import { Input } from '@mc/ui/shadcn/input'
import { Search } from 'lucide-react'

export function SidebarViewSearch() {
  return (
    <>
      <div className="relative mb-4">
        <Search className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
        <Input placeholder="搜索..." className="pl-8" />
      </div>
      <div className="text-muted-foreground text-sm">
        在输入框中输入搜索词开始搜索
      </div>
    </>
  )
}
