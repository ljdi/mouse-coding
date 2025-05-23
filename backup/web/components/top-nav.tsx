'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@mc/ui/components/avatar'
import { Badge } from '@mc/ui/components/badge'
import { Button } from '@mc/ui/components/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@mc/ui/components/dropdown-menu'
import { Bell, ChevronDown, Triangle } from 'lucide-react'
import Link from 'next/link'

export function TopNav() {
  return (
    <div className="border-border flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center space-x-4">
        <Link href="#" className="flex items-center space-x-2">
          <Triangle className="h-5 w-5" />
        </Link>

        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="h-5 w-5 rounded-full border-emerald-500/20 bg-emerald-500/20 p-0 text-emerald-500"
          />
          <span className="text-sm font-medium">团队的项目</span>
          <Badge variant="outline" className="text-xs">
            Hobby
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          反馈
        </Button>
        <Button variant="ghost" size="sm">
          更新日志
        </Button>
        <Button variant="ghost" size="sm">
          帮助
        </Button>
        <Button variant="ghost" size="sm">
          文档
        </Button>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px]">
            2
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>用户</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>个人资料</DropdownMenuItem>
            <DropdownMenuItem>设置</DropdownMenuItem>
            <DropdownMenuItem>退出登录</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
