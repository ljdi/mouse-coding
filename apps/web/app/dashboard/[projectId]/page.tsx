import { ProjectPage } from '@mc/ui/components/pages/dashboard/project/page'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)

  if (!projectId) {
    return <div>Error: Project ID not found</div>
  }
  return <ProjectPage projectId={projectId} />
}
