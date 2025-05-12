import { createFileRoute } from '@tanstack/react-router'

import { Playground } from '@/views/dashboard/project/playground'

export const Route = createFileRoute('/dashboard/$projectId/playground/')({
  component: Playground,
})
