import { ProjectPage } from '@/components/pages/dashboard/project/page'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ projectName: string }>
}) {
  const { projectName } = use(params)

  if (!projectName) {
    return <div>Error: Project ID not found</div>
  }
  return <ProjectPage projectName={projectName} />
}
