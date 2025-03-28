import { FC, ReactNode } from 'react'

interface PlaygroundContentProps {
  children: ReactNode
}
export const PlaygroundContent: FC<PlaygroundContentProps> = ({ children }) => {
  return (
    <div className="flex flex-1 overflow-hidden bg-neutral-800">{children}</div>
  )
}
