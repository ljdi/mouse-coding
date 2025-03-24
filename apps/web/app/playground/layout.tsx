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
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
