import { PlaygroundPage } from '@/components/pages/dashboard/project/playground/page'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ projectName: string }>
}) {
  const { projectName } = use(params)

  return <PlaygroundPage projectName={projectName} />
}
