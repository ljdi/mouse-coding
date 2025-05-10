import { Badge } from '@mc/ui/components/badge'
import { Button } from '@mc/ui/components/button'
import { Card } from '@mc/ui/components/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@mc/ui/components/dropdown-menu'
import { Code, MoreHorizontal } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    url: string
    description?: string
    icon?: string
    updatedAt?: string
    updatedBy?: string
    status?: 'success' | 'error' | 'loading'
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="bg-card/50 hover:bg-card/80 overflow-hidden transition-colors">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
            <Code className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-muted-foreground text-xs">{project.url}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>查看项目</DropdownMenuItem>
            <DropdownMenuItem>项目设置</DropdownMenuItem>
            <DropdownMenuItem>重新部署</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              删除项目
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {project.description && (
        <div className="px-4 pb-2">
          <p className="text-muted-foreground text-sm">{project.description}</p>
        </div>
      )}
      {(project.updatedAt ?? project.updatedBy ?? project.status) && (
        <div className="border-border text-muted-foreground border-t px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            {project.status === 'success' && (
              <Badge
                variant="outline"
                className="h-2 w-2 rounded-full border-green-500/20 bg-green-500/20 p-0 text-green-500"
              />
            )}
            {project.status === 'error' && (
              <Badge
                variant="outline"
                className="h-2 w-2 rounded-full border-red-500/20 bg-red-500/20 p-0 text-red-500"
              />
            )}
            {project.updatedAt && <span>{project.updatedAt}</span>}
            {project.updatedBy && (
              <span>
                on
                {project.updatedBy}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
