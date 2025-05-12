import { createFileRoute } from '@tanstack/react-router'

import { Project } from '@/views/dashboard/project'

// 创建路由
export const Route = createFileRoute('/dashboard/$projectId/')({
  component: Project,
})
