import { FC, ReactNode } from 'react'

interface PlaygroundContentProps {
  children: ReactNode
}
export const PlaygroundContent: FC<PlaygroundContentProps> = ({ children }) => {
  return (
    <div className="bg-neutral-800 flex flex-1 overflow-hidden">
      {children}
    </div>
  )
}
