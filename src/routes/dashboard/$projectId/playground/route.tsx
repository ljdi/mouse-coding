import { createFileRoute } from '@tanstack/react-router'

import { PlaygroundLayout } from '@/layouts/playground'

export const Route = createFileRoute('/dashboard/$projectId/playground')({
  component: PlaygroundLayout,
})
