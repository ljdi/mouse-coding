'use client'

import { Button } from '@mc/ui/shadcn/button'
import { Input } from '@mc/ui/shadcn/input'
import { Download, ExpandIcon as Extension } from 'lucide-react'

export function SidebarViewPackages() {
  return (
    <>
      <div className="relative mb-4">
        <Input placeholder="搜索扩展..." className="mb-3" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded border p-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <Extension className="mr-2 size-4" />
              <span className="text-sm font-medium">React Developer Tools</span>
            </div>
            <Button size="sm" variant="outline" className="h-7">
              <Download className="mr-1 size-3" />
              安装
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            React调试工具，用于检查组件层次结构
          </p>
        </div>
        <div className="rounded border p-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <Extension className="mr-2 size-4" />
              <span className="text-sm font-medium">ESLint</span>
            </div>
            <Button size="sm" variant="outline" className="h-7">
              <Download className="mr-1 size-3" />
              安装
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            集成ESLint JavaScript代码检查工具
          </p>
        </div>
      </div>
    </>
  )
}
