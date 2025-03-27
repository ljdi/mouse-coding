import { PlaygroundContent } from '@mc/ui/components/layout/playground-content'
import { PlaygroundHeader } from '@mc/ui/components/layout/playground-header'
import { type ReactNode } from 'react'

export default function PlaygroundLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <PlaygroundHeader />
      <PlaygroundContent>{children}</PlaygroundContent>
    </div>
  )
}
