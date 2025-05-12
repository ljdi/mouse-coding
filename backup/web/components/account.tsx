import { Avatar, AvatarFallback, AvatarImage } from '@mc/ui/components/avatar'
import { Button } from '@mc/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@mc/ui/components/dropdown-menu'

export const Account = () => {
  return (
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
  )
}
