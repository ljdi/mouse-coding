import { PlaygroundPage } from '@mc/ui/components/pages/dashboard/project/playground/page'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ workspaceName: string }>
}) {
  const { workspaceName } = use(params)
  return <PlaygroundPage workspaceName={workspaceName} />
}
