'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@mc/ui/shadcn/resizable'
import { FC, Fragment, ReactNode } from 'react'

interface PanelWrapperProps {
  direction?: 'horizontal' | 'vertical'
  defaultLayout: number[]
  views: ReactNode[]
  onLayout?: (sizes: number[]) => void
}

export const PanelGroup: FC<PanelWrapperProps> = ({
  views,
  direction = 'horizontal',
  defaultLayout,
  onLayout,
}) => {
  return (
    <ResizablePanelGroup
      autoSaveId="playground"
      direction={direction}
      onLayout={onLayout}
    >
      {views.map((view, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <ResizableHandle className="w-0 after:w-0" />
          )}
          <ResizablePanel defaultSize={defaultLayout[index]}>
            {view}
          </ResizablePanel>
        </Fragment>
      ))}
    </ResizablePanelGroup>
  )
}
