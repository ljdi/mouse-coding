import { PlaygroundLayout } from '@/components/layout/playground'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlaygroundLayout>
      {children}
    </PlaygroundLayout>
  )
}
